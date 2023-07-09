import React, { useState } from "react";
import { toast } from "react-toastify";
import "./signs.css";
import VisiblePass from "../assets/images/visible-password.png";
import NotVisiblePass from "../assets/images/not-visible-password.png";
import { Link } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const SingUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;
  const [visiblePassword, setVisiblePassword] = useState(false);

  const handleFormChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleChangeVisibility = () => {
    setVisiblePassword((prev) => !prev);
  };

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential.user) {
        navigate("/account");
      }
    } catch (error) {
      toast.error("User not found");
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
            <h1 className="sign-header">Sign In</h1>
            <div className="sign-inputs">
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
                required
              />
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
                required
              />

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
              <button className="register-button">Log In</button>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                paddingTop: "20px",
              }}
              className="forgot-password-div"
            >
              <Link to="/forgotPassword" className="forgot-passw ord">
                Forgot Password?
              </Link>
              <div style={{ display: "flex", fontSize: "14px" }}>
                <p>Don't have an Account?</p>

                <a
                  href="/SignIn"
                  className="forgot-password-link"
                  rel="noreferrer"
                >
                  <Link to="/signUp">Sign Up</Link>
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
