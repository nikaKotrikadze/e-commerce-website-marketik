import React, { useState } from "react";
import man from "../../assets/images/man.png";
import { Button } from "react-bootstrap";
import { auth } from "../../firebase";
import { updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ProductItself = ({
  image,
  name,
  price,
  productName,
  id,
  description,
}) => {
  const [open, setOpen] = useState(false);
  const [descriptionLength, setDescriptionLength] = useState(
    description.length
  );

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  console.log(auth.currentUser.uid === id);

  const [formData, setFormData] = useState({
    price: price,
    description: description,
    imageFile: [image],
    productName: productName,
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

        case "price":
          if (!value) {
            stateObj[id] = "Enter a price.";
          } else if (value.length > 8) {
            stateObj[id] = "You're asking too much for this my boy.";
          } else if (value.startsWith("0") || value.startsWith("-")) {
            stateObj[id] = "Number has to be at least 1 ₾";
          }
        case "description":
          if (!value) {
            stateObj[id] = "Please enter product description.";
          } else if (value.length > 300) {
            stateObj[id] = "product name can't be no more than 300 characters.";
          }
          break;
      }

      return stateObj;
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    if (name === "description") {
      setDescriptionLength(value.length);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const [edit, setEdit] = useState(false);

  const handleEdit = () => {
    setEdit((prev) => !prev);
  };

  const handleCancel = () => {
    setEdit((prev) => !prev);
    setFormData({
      price: price,
      imageFile: image,
      description: description,
      productName: productName,
    });
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();

    setError({ productName: "", imageFile: "", description: "", price: "" });

    try {
      const productRef = doc(db, "NewProducts", id);

      updateDoc(productRef, {
        productName: formData.productName,
        price: formData.price,
        imageFile: formData.imageFile,
        description: formData.description,
      });
      toast.success("ad changed successfully!");
      setEdit(false);
      navigate("/account");
    } catch (e) {
      console.log(e);
      toast.error("Couldn't change the ad...");
    }
  };

  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const productRef = doc(db, "NewProducts", id);
      await deleteDoc(productRef);
      toast.success("ad removed successfully!");
      navigate("/");
    } catch (e) {
      console.log(e);
      toast.error("Couldn't delete ad...");
    }
  };
  console.log(auth.currentUser);

  return (
    <div className="product-itself">
      {auth.currentUser.uid && auth.currentUser.displayName == name ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%",
          }}
        >
          {edit ? (
            <Button variant="danger" onClick={handleCancel}>
              Cancel
            </Button>
          ) : (
            <div>
              <Button variant="danger" onClick={handleOpen}>
                Delete
              </Button>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    Are you sure you want to delete your advert?
                  </Typography>
                  <div
                    style={{ display: "flex", justifyContent: "space-evenly" }}
                  >
                    <Button variant="warning" onClick={handleClose}>
                      No
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                      Yes
                    </Button>
                  </div>
                </Box>
              </Modal>
            </div>
          )}
          {edit ? (
            <Button
              variant="primary"
              onClick={handleSaveChanges}
              disabled={error.productName || error.price ? true : false}
            >
              Save Changes
            </Button>
          ) : (
            <Button variant="primary" onClick={handleEdit}>
              Edit
            </Button>
          )}
        </div>
      ) : null}
      <div className="product-items-div">
        <div className="product-img-border">
          {edit ? (
            <input
              type="file"
              accept="image/png, image/jpeg"
              name="imageFile"
              id="imageFile"
              onChange={handleFormChange}
              onBlur={validateInput}
            />
          ) : (
            <img src={image} alt="product image" className="product-img" />
          )}
        </div>
        <div className="product-info-div">
          <p style={{ color: "grey" }}>Ad ID: {id}</p>
          {edit ? (
            <>
              <input
                type="text"
                placeholder="product name"
                name="productName"
                id="productName"
                value={formData.productName}
                onChange={handleFormChange}
                onBlur={validateInput}
              />
              {error.productName && (
                <h6 className="err" style={{ color: "red" }}>
                  {error.productName}
                </h6>
              )}
            </>
          ) : edit ? (
            <h3>{productName}</h3>
          ) : (
            <h3>{formData.productName}</h3>
          )}
          <div
            style={{
              width: "100%",
              height: "100px",
              border: "1px solid black",
              borderRadius: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {edit ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                    height: "100%",
                  }}
                >
                  <input
                    type="number"
                    placeholder="Enter Price"
                    name="price"
                    id="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    onBlur={validateInput}
                  />
                  {error.price && (
                    <h6 className="err" style={{ color: "red" }}>
                      {error.price}
                    </h6>
                  )}
                </div>
              ) : edit ? (
                <h1>{price} ₾</h1>
              ) : (
                <h1>{formData.price} ₾</h1>
              )}
            </div>
          </div>
          <div
            style={{
              width: "100%",
              height: "100px",
              border: "1px solid black",
              borderRadius: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: "100%",
                textAlign: "center",
              }}
            >
              <img src={man} alt="man icon" style={{ width: 40 }} />
              <p style={{ fontSize: 17 }}>{name}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="description-div">
        <div>
          <h1>Description</h1>
        </div>
        {edit ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <textarea
              type="text"
              placeholder="Enter description"
              name="description"
              id="description"
              value={formData.description}
              onChange={handleFormChange}
              onBlur={validateInput}
              maxLength={300}
              style={{ resize: "none", height: 50 }}
            />
            {error.description && (
              <h6 className="err" style={{ color: "red" }}>
                {error.description}
              </h6>
            )}
            <label>{descriptionLength}/300</label>
          </div>
        ) : edit ? (
          <p>{description}</p>
        ) : (
          <div style={{ wordBreak: "break-all" }}>
            <p>{formData.description}</p>
          </div>
        )}
      </div>

      <div>
        <button className="register-button">Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductItself;
