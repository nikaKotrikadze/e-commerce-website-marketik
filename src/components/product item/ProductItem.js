import React from "react";
import { Link } from "react-router-dom";
import userImg from "../../assets/images/user.png";

const ProductItem = ({ listing, id, image }) => {
  return (
    <Link to={`/productDetails/${id}`} style={{ textDecoration: "none" }}>
      <div
        style={{
          width: 300,
          height: 380,
          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
          borderRadius: 5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
        className="productItem"
      >
        <div
          style={{
            width: "80%",
            height: "50%",
            border: "1px solid black",
            borderRadius: 5,
          }}
        >
          <img
            src={image}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div
          style={{
            width: "90%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <img src={userImg} style={{ width: 20 }} />

              <p
                style={{
                  color: "grey",
                  marginTop: 15,
                }}
              >
                {listing.name}
              </p>
            </div>

            <p style={{ color: "black", fontSize: 20 }}>
              {listing.productName}
            </p>
            <hr />
          </div>
          <p style={{ color: "black" }}>{listing.price} ₾</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
