import SignIn from "./signs/SignIn";
import SignUp from "./signs/SignUp";
import Account from "./components/account/Account";
import Home from "./components/Home/Home";
import NavbarTop from "./components/Navbar/Navbar";
import AddAdvert from "./components/add/AddAdvert";
import PrivateRoute from "./components/private route/PrivateRoute";
import ForgotPassword from "./Forgot Password/ForgotPassword";
import ProductDetails from "./components/product details/ProductDetails";
import AllProducts from "./all products/AllProducts";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShoppingCart from "./components/shopping cart/ShoppingCart";

function App() {
  return (
    <>
      <Router>
        <AuthContextProvider>
          <div className="App">
            <NavbarTop />
            <Routes>
              <Route exact path="/" element={<Home />}></Route>
              <Route
                exact
                path="/allProducts"
                element={<AllProducts />}
              ></Route>

              <Route path="/addAdvert" element={<PrivateRoute />}>
                <Route path="/addAdvert" element={<AddAdvert />} />
              </Route>
              <Route path="/shopping-cart" element={<PrivateRoute />}>
                <Route path="/shopping-cart" element={<ShoppingCart />} />
              </Route>

              <Route path="/productDetails/:id" element={<PrivateRoute />}>
                <Route
                  path="/productDetails/:id"
                  element={<ProductDetails />}
                />
              </Route>

              <Route path="/signUp" element={<SignUp />}></Route>
              <Route path="/signIn" element={<SignIn />}></Route>
              <Route
                path="/forgotPassword"
                element={<ForgotPassword />}
              ></Route>

              <Route path="/account" element={<PrivateRoute />}>
                <Route path="/account" element={<Account />} />
              </Route>
            </Routes>
          </div>
        </AuthContextProvider>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
