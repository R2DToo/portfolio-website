import React from "react";
import DarkModeIcon from "@mui/icons-material/DarkMode";
//import DeleteIcon from "@mui/icons-material/Delete";
import logo from "../images/logo.png";
import "./Navbar.css";

const Navbar = () => {
    return (
        <nav>
            <ul className="navbar">
                <li>
                    <a className="navbar-brand" href="/">
                        <img src={logo} alt="Company Logo" id="brand-logo" />
                        Still-Routley Development
                    </a>
                </li>
                <div className="nav">
                    <li>
                        <DarkModeIcon />
                    </li>
                </div>
            </ul>
        </nav>
    );
};

export default Navbar;
