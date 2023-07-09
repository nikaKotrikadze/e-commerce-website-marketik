import React, { useState, useEffect } from "react";
import ProductItself from "./ProductItself";
import man from "../../assets/images/man.png";
import { useParams } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const ProductDetails = () => {
  const { id } = useParams();
  // console.log(id);

  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, "NewProducts");

        const q = query(listingsRef, orderBy("timestamp", "desc"));

        const querySnap = await getDocs(q);

        const listings = [];

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error("could not fetch new products");
      }
    };
    fetchListings();
  }, []);

  const product = listings && listings.find((product) => product.id === id);

  return (
    <div>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : listings && listings.length > 0 ? (
        <ProductItself
          image={product?.data?.imageFile[0]}
          productName={product?.data?.productName}
          name={product?.data?.name}
          price={product?.data?.price}
          description={product?.data?.description}
          id={id}
        />
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </div>
  );
};

export default ProductDetails;
