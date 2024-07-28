import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Grid,
  MenuItem,
  IconButton,
  Menu,
  Divider,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../logo.png";
import UserContext from "../contexts/UserContext";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Navbar = () => {
  const { user } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElCustomer, setAnchorElCustomer] = useState(null);
  const open = Boolean(anchorEl);
  const openCustomer = Boolean(anchorElCustomer);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClickCustomer = (event) => {
    setAnchorElCustomer(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseCustomer = () => {
    setAnchorElCustomer(null);
  };

  const getInitials = (firstName) => {
    if (!firstName) return "";
    return firstName.charAt(0).toUpperCase();
  };

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  const isAdmin = user && (user.role === "Admin" || user.role === "Staff");

  return (
    <AppBar
      position="static"
      className="AppBar"
      sx={{ backgroundColor: "#D22B2B" }}
    >
      <Container>
        <Toolbar disableGutters={true}>
          <Link to="/">
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
              paddingTop={"10px"}
            >
              <Avatar src={logo} sx={{ width: 60, height: 60 }} />
              <Typography variant="h6" component="div">
                SINGAPURA CC
              </Typography>
            </Grid>
          </Link>

          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              gap: 10,
            }}
          >
            {!isAdmin && (
              <>
                <Link to="/events">
                  <Typography>Events</Typography>
                </Link>

                <Link to="/facilities">
                  <Typography>Facilities</Typography>
                </Link>

                <Link to="/posts">
                  <Typography>Connect</Typography>
                </Link>
              </>
            )}
          </Box>
          {user ? (
            <>
              {isAdmin && (
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Staff Management Portal
                </Typography>
              )}
              <IconButton
                id="account-button"
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={isAdmin ? handleClick : handleClickCustomer}
              >
                <Avatar sx={{ width: 40, height: 40 }}>
                  {getInitials(user.firstName)}
                </Avatar>
              </IconButton>
              <Menu
                id="account-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "account-button",
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    paddingX: 2,
                    paddingY: 1,
                  }}
                >
                  <Typography fontWeight={"medium"}>
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography color={"textSecondary"}>{user.email}</Typography>
                </Box>
                <Divider />
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <MenuItem>
                      <Typography>Dashboard</Typography>
                    </MenuItem>
                  </Link>
                )}
                <MenuItem onClick={logout}>Logout</MenuItem>
              </Menu>
              <Menu
                id="account-menu-customer"
                anchorEl={anchorElCustomer}
                open={openCustomer}
                onClose={handleCloseCustomer}
                MenuListProps={{
                  "aria-labelledby": "account-button",
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    paddingX: 2,
                    paddingY: 1,
                  }}
                >
                  <Typography fontWeight={"medium"}>
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography color={"textSecondary"}>{user.email}</Typography>
                </Box>

                <Divider />
                <Link
                  to="/profile"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <MenuItem>
                    <Typography>Profile</Typography>
                  </MenuItem>
                </Link>
                <Link
                  to="/settings"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <MenuItem>
                    <Typography>Settings</Typography>
                  </MenuItem>
                </Link>
                <MenuItem onClick={logout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Link
                to="/register"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Typography>SIGN UP</Typography>
              </Link>
              <Link
                to="/login"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Typography>LOGIN</Typography>
              </Link>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
