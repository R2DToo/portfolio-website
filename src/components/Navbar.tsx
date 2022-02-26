import React from "react";
import DarkModeIcon from "@mui/icons-material/DarkMode";
//import DeleteIcon from "@mui/icons-material/Delete";
import logo from "../images/logo.png";

const Navbar = () => {
    return (
        <nav>
            <ul className="navbar">
                <li>
                    <a href="/">
                        <img src={logo} alt="Company Logo" id="brand-logo" />
                    </a>
                </li>
                <li>
                    <a href="/">Home</a>
                </li>
                <li className="nav-right">
                    <DarkModeIcon />
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
