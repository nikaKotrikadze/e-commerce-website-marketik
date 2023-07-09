import React, { useState } from "react";
import "./signs.css";
import VisiblePass from "../assets/images/visible-password.png";
import NotVisiblePass from "../assets/images/not-visible-password.png";
import { Link, useNavigate } from "react-router-dom";

import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";

const SingUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const [error, setError] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const { username, email, password, repeatPassword } = formData;
  const [visiblePassword, setVisiblePassword] = useState(false);

  const handleFormChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
    validateInput(e);
  };

  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$@|gmail\.com/;
  const validateInput = (e) => {
    let { id, value } = e.target;
    setError((prev) => {
      const stateObj = { ...prev, [id]: "" };

      switch (id) {
        case "username":
          if (!value) {
            stateObj[id] = "Please enter username.";
          } else if (value.length < 4) {
            stateObj[id] = "Please use at least 4 characters.";
          } else if (value.length > 20) {
            stateObj[id] = "Can't use no more than 20 characters.";
          }
          break;
        case "email":
          if (!value || !regex.test(value)) {
            stateObj[id] = "Please enter a valid email.";
          }
          break;

        case "password":
          if (!value) {
            stateObj[id] = "Please enter Password.";
          } else if (value.length < 8) {
            stateObj[id] = "Password must be at least 8 characters long. ";
          } else if (
            formData.repeatPassword &&
            value !== formData.repeatPassword
          ) {
            stateObj["repeatPassword"] = "Passwords don't match.";
          } else {
            stateObj["repeatPassword"] = formData.repeatPassword
              ? ""
              : error.repeatPassword;
          }
          break;

        case "repeatPassword":
          if (!value) {
            stateObj[id] = "Please repeat Password.";
          } else if (formData.password && value !== formData.password) {
            stateObj[id] = "Passwords don't match.";
          }
          break;

        default:
          break;
      }

      return stateObj;
    });
  };
  const navigate = useNavigate();

  const clearHandle = () => {
    setFormData({ username: "", email: "", password: "", repeatPassword: "" });
  };

  const handleChangeVisibility = () => {
    setVisiblePassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError({ username: "", email: "", password: "", repeatPassword: "" });

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      updateProfile(auth.currentUser, {
        displayName: username,
      });

      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      delete formDataCopy.repeatPassword;
      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, "users", user.uid), formDataCopy);
      navigate("/");
      toast.success("User Registered!");
    } catch (e) {
      console.log(e);
      toast.error("This email is already in use!");
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <div className="sign-up">
          <form className="sign-up-box" onSubmit={handleSubmit}>
            <h1 className="sign-header">Sign Up</h1>
            <div className="sign-inputs">
              <label for="username">
                <b>Username</b>
              </label>
              <input
                type="text"
                placeholder="Enter Username"
                name="username"
                id="username"
                value={username}
                onChange={handleFormChange}
                onBlur={validateInput}
                required
              />
              {error.username && <h6 className="err">{error.username}</h6>}
              <label for="email">
                <b>Email</b>
              </label>
              <input
                type="email"
                placeholder="Enter Email"
                name="email"
                id="email"
                value={email}
                onChange={handleFormChange}
                onBlur={validateInput}
                required
              />
              {error.email && <h6 className="err">{error.email}</h6>}
              <label for="psw">
                <b>Password</b>
              </label>
              <input
                type={visiblePassword ? "text" : "password"}
                placeholder="Enter Password"
                name="psw"
                id="password"
                value={password}
                onChange={handleFormChange}
                onBlur={validateInput}
                required
              />
              {error.password && <h6 className="err">{error.password}</h6>}
              <label for="psw-repeat">
                <b>Repeat Password</b>
              </label>
              <input
                type={visiblePassword ? "text" : "password"}
                placeholder="Repeat Password"
                name="psw-repeat"
                id="repeatPassword"
                value={repeatPassword}
                onChange={handleFormChange}
                onBlur={validateInput}
                required
              />
              {error.repeatPassword && (
                <h6 className="err">{error.repeatPassword}</h6>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <img
                  src={visiblePassword ? NotVisiblePass : VisiblePass}
                  alt="password visibility"
                  style={{ width: "30px", cursor: "pointer" }}
                  onClick={handleChangeVisibility}
                />
              </div>
            </div>

            <div>
              <button
                className="register-button"
                // type="submit"
                onChange={clearHandle}
                disabled={
                  formData.username === "" ||
                  formData.email === "" ||
                  formData.password === "" ||
                  formData.password.length < 8 ||
                  formData.repeatPassword === "" ||
                  error.username ||
                  error.email ||
                  error.password ||
                  error.repeatPassword
                    ? true
                    : false
                }
              >
                REGISTER
              </button>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                paddingTop: "20px",
              }}
            >
              <div style={{ display: "flex", fontSize: "14px" }}>
                <p>Already have an Account?</p>

                <a href="/SignIn" className="forgot-password" rel="noreferrer">
                  <Link to="/signIn">Sign In</Link>
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SingUp;
