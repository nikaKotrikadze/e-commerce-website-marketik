import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import EditProduct from "../edit product/EditProduct";

const Account = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(null);
  const [docs, setDocs] = useState([]);

  const auth = getAuth();

  const listingsRef = collection(db, "NewProducts");

  const q = query(listingsRef, orderBy("timestamp", "desc"));

  useEffect(() => {
    getDocs(q).then((snapshot) => {
      const userRN = snapshot.docs.filter(
        (doc) => auth.currentUser.displayName == doc.data().name
      );
      setDocs(userRN);
    });

    const fetchListings = async () => {
      try {
        const listings = [];
        docs.map((doc) => {
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
  }, [docs]);

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;

  const navigate = useNavigate();

  const onLogout = () => {
    auth.signOut();
    navigate("/signIn");
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <p>Welcome</p>

        <h1>{auth.currentUser ? name : "not logged in"}</h1>
        <p>{auth.currentUser ? email : "not logged in"}</p>

        <button className="register-button" onClick={onLogout}>
          Logout
        </button>
      </div>
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
          <h1>Your Advertisement</h1>
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
            {listings && listings.length > 0 ? (
              <>
                {listings.map((listing) => {
                  return (
                    <>
                      <EditProduct
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
    </>
  );
};

export default Account;
