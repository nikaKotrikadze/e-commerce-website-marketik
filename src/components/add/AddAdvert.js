import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import warningImage from "../../assets/images/warningImage.png";

const AddAdvert = () => {
  const [descriptionLength, setDescriptionLength] = useState(0);
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    imageFile: "",
    price: "",
  });

  const [error, setError] = useState({
    productName: "",
    description: "",
    imageFile: [],
    price: "",
  });

  const validateInput = (e) => {
    let { id, value } = e.target;
    setError((prev) => {
      const stateObj = { ...prev, [id]: "" };

      switch (id) {
        case "productName":
          if (!value) {
            stateObj[id] = "Please enter product name.";
          } else if (value.length > 20) {
            stateObj[id] = "product name can't be no more than 20 characters.";
          }
          break;

        case "description":
          if (!value) {
            stateObj[id] = "Please enter product description.";
          } else if (value.length > 300) {
            stateObj[id] = "product name can't be no more than 300 characters.";
          }
          break;

        case "price":
          if (!value) {
            stateObj[id] = "Enter a price.";
          } else if (value.length > 8) {
            stateObj[id] = "You're asking too much for this my boy.";
          } else if (value.startsWith("0") || value.startsWith("-")) {
            stateObj[id] = "Number has to be at least 1 ₾";
          }
      }

      return stateObj;
    });
  };

  let auth = getAuth();

  const handleFormChange = (e) => {
    if (e.target.name === "description") {
      setDescriptionLength(e.target.value.length);
    }
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));

    if (e.target.type === "file") {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result;

        setFormData((prev) => ({
          ...prev,
          [e.target.id]: [base64],
        }));
      };
    }
  };

  const navigate = useNavigate();
  const [unique, setUnique] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError({ productName: "", imageFile: "", description: "", price: "" });

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const formDataCopy = { ...formData };
      formDataCopy.timestamp = serverTimestamp();
      formDataCopy.name = user.displayName;

      let firstPart = (Math.random() * 46656) | 0;
      let secondPart = (Math.random() * 46656) | 0;
      firstPart = ("000" + firstPart.toString(36)).slice(-3);
      secondPart = ("000" + secondPart.toString(36)).slice(-3);
      let uuid = firstPart + secondPart;

      await setDoc(
        doc(db, "NewProducts", uuid + "-" + formData.productName),
        formDataCopy,
        {
          merge: true,
        }
      );

      toast.success("advert submitted!");
      navigate("/");
    } catch (e) {
      console.log(e);
      toast.error("something went wrong..");
    }
  };

  const { productName, description, imageFile, price } = formData;

  // console.log(formData);
  return (
    <>
      <div
        style={{
          display: "flex",
          height: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="sign-up">
          <form className="sign-up-box" onSubmit={handleSubmit}>
            <h1 className="sign-header">Add a Product</h1>
            {/* <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                width: "100%",
                height: "100%",
              }}
            >
              <div
                style={{
                  backgroundColor: "yellow",
                  opacity: 0.8,
                  borderRadius: 10,
                  justifyContent: "center",
                  textAlign: "center",
                  alignItems: "center",
                  display: "flex",
                  width: "100%",
                  height: "100%",
                }}
              >
                <img
                  src={warningImage}
                  style={{
                    height: 25,
                  }}
                />
                <p
                  style={{
                    display: "flex",
                    marginTop: 15,
                  }}
                >
                  <b>WARNING!ㅤ</b>You can only add one product
                </p>
              </div>
            </div> */}
            <div className="sign-inputs">
              <label for="productName">
                <b>Product Name</b>
              </label>
              <input
                type="text"
                placeholder="product name"
                name="productName"
                id="productName"
                value={productName}
                onChange={handleFormChange}
                onBlur={validateInput}
                required
              />
              {error.productName && (
                <h6 className="err">{error.productName}</h6>
              )}
              <br />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label for="description">
                  <b>Description</b>
                </label>
                <label for="description">{descriptionLength}/300</label>
              </div>
              <textarea
                type="text"
                placeholder="Enter description"
                name="description"
                id="description"
                maxLength={300}
                value={description}
                onChange={handleFormChange}
                onBlur={validateInput}
                style={{ resize: "none" }}
                required
              />
              {error.description && (
                <h6 className="err">{error.description}</h6>
              )}
              <label for="imageFile">
                <b>Upload product Image</b>
              </label>
              <input
                type="file"
                accept="image/png, image/jpeg"
                name="imageFile"
                id="imageFile"
                onChange={handleFormChange}
                onBlur={validateInput}
                required
              />
              <p style={{ fontSize: 13, textDecoration: "underline" }}>
                (only accepting '.png' & '.jpeg' files)
              </p>
              <label for="price">
                <b>price </b>
                <span>(₾)</span>
              </label>

              <input
                type="number"
                placeholder="Enter Price"
                name="price"
                id="price"
                value={price}
                onChange={handleFormChange}
                onBlur={validateInput}
                required
              />
              {error.price && <h6 className="err">{error.price}</h6>}
            </div>
            <br />
            <div>
              <button
                className="register-button"
                disabled={
                  formData.productName === "" ||
                  formData.price === "" ||
                  formData.description === "" ||
                  error.productName ||
                  error.price
                    ? true
                    : false
                }
              >
                {" "}
                Submit{" "}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddAdvert;
