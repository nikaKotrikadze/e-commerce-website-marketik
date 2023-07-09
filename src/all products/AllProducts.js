import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import magnifier from "../assets/images/magnifier.png";
import ProductItem from "../components/product item/ProductItem";

const NewProducts = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(null);
  const [search, setSearch] = useState("");
  const [price, setPrice] = useState(40);

  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, "NewProducts");

        const q = query(listingsRef, orderBy("timestamp", "desc"));

        if (search) {
          q = query(q, "where", "productName", "==", search);
        }

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

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleInput = (e) => {
    setPrice(e.target.value);
  };

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
        <div className="title-search-bar">
          <h1>All Products</h1>
          <div
            style={{
              width: 250,
              height: 50,
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <img src={magnifier} style={{ width: 30 }} />
            <input
              style={{ borderRadius: 10 }}
              type="text"
              placeholder="Search"
              onChange={handleSearch}
              value={search}
            />
          </div>
        </div>
        <br />
        <div style={{ display: "flex", gap: 20 }}>
          {/* <div
            style={{
              width: "30%",
              height: "auto",
              boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
              display: "flex",
              flexDirection: "column",
              gap: 30,
              paddingLeft: 20,
            }}
          >
            <h1>Filters</h1>
            <div style={{ paddingLeft: 20 }}>
              <input type="range" onInput={handleInput} />
              <p>Price: {price}</p>
            </div>
          </div> */}
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
                {/* Only render the listings that match the search term */}

                {listings
                  .filter((listing) =>
                    listing.data.productName
                      .toLowerCase()
                      .includes(search.toLowerCase())
                  )
                  .map((listing) => {
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProducts;
