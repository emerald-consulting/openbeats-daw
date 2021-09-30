import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <Link className="p-4" to="/login">
        Login
      </Link>
      <Link className="p-4" to="/signup">
        Signup
      </Link>
    </nav>
  );
};

export default Navbar;
