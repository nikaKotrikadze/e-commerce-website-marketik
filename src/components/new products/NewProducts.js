import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import ProductItem from "../product item/ProductItem";

const NewProducts = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(null);

  const params = useParams();

  // const smyth = async () => {
  //   console.log("hi1");
  // };

  //understanding event loops.

  useEffect(() => {
    const fetchListings = async () => {
      // setTimeout(() => {
      //   console.log("hi3");
      // }, 1000);

      // setTimeout(() => {
      //   console.log("hi2");
      // }, 0);

      // await smyth();

      try {
        const listingsRef = collection(db, "NewProducts");

        const q = query(listingsRef, orderBy("timestamp", "desc"), limit(4));

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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "",
        justifyContent: "",
        padding: "20px 50px 20px 40px",
        height: "auto",
      }}
    >
      <div>
        <h1>New Products</h1>
        <br />
        <div
          style={{
            width: "100%",
            height: "auto",
            boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
            display: "flex",
            flexWrap: "wrap",
            gap: "15px",
            justifyContent: "space-evenly",
            padding: "15px",
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex" }}>
              <CircularProgress />
            </Box>
          ) : listings && listings.length > 0 ? (
            <>
              {listings.map((listing) => {
                return (
                  <>
                    <ProductItem
                      key={listing.id}
                      id={listing.id}
                      listing={listing.data}
                      image={listing.data.imageFile}
                    />
                  </>
                );
              })}
            </>
          ) : (
            <Box sx={{ display: "flex" }}>
              <CircularProgress />
            </Box>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <Link
              to={"/allProducts"}
              style={{ textDecoration: "none", color: "orange" }}
            >
              <div className="showAllProducts-div">
                <b>Show All Products</b>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProducts;
