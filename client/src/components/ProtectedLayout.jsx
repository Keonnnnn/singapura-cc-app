import React from "react";
import {
  CssBaseline,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Button,
  Container,
  Grid,
} from "@mui/material";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import logo from "../logo.png";
import UserContext from "../contexts/UserContext";

const ProtectedLayout = ({ children }) => {
  const { user } = React.useContext(UserContext);
  const getInitials = (firstName) => {
    if (!firstName) return "";
    return firstName.charAt(0).toUpperCase();
  };
  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };



  return (
    <Box sx={{ overflow: "hidden" }}>
      <CssBaseline />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          display: "flex",
        }}
      >
        <Sidebar />
        <Box
          sx={{
            p: 7.5,
            width: "100%",
            minHeight: "100vh",
            overflowY: "auto",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default ProtectedLayout;
