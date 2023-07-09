import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success("Email Sent! (please check spam)");
    } catch (error) {
      toast.error("Could not send reset email!");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div className="sign-up">
        <form
          className="sign-up-box"
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          onSubmit={handleSubmit}
        >
          <h1 className="sign-header">Forgot Password?</h1>
          <div className="sign-inputs">
            <label for="email">
              <b>Email</b>
            </label>
            <input
              type="email"
              className="emailInput"
              placeholder="email"
              id="email"
              value={email}
              onChange={handleChange}
            />
          </div>

          <div>
            <button className="register-button">Send Reset Link</button>
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
              <Link to="/signIn">Sign In</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
