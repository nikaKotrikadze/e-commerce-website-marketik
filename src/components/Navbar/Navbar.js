import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import plus from "../../assets/images/plus.png";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function NavbarTop() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
      }
      setCheckingStatus(false);
    });
  });
  return (
    <>
      <Navbar
        key="lg"
        bg="primary"
        expand="lg"
        className="bg-warning"
        sticky="top"
      >
        <Container fluid>
          <Navbar.Brand href="/">Marketik</Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-lg`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-lg`}
            aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-lg`}>
                Marketik
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link href="/addAdvert">
                  <img src={plus} alt="plus image" style={{ width: 20 }}></img>{" "}
                  Add{" "}
                </Nav.Link>
                {/* {loggedIn ? null : <Nav.Link href="/signIn">Sign In</Nav.Link>} */}
                {/* {loggedIn ? null : <Nav.Link href="/signUp">Sign Up</Nav.Link>} */}
                {loggedIn ? (
                  <>
                    <Nav.Link href="/shopping-cart">Cart</Nav.Link>
                    <Nav.Link href="/account">Profile</Nav.Link>
                  </>
                ) : (
                  <Nav.Link href="/signIn">Sign In</Nav.Link>
                )}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}

export default NavbarTop;
