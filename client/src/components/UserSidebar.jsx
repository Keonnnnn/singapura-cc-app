import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import UserContext from "../contexts/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import http from "../http";
import {
  ExitToApp,
  Person,
  Star,
  History,
  RateReview,
  Settings,
} from "@mui/icons-material";

const UserSidebar = () => {
  const { user: loggedInUser } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [membershipOpen, setMembershipOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMembershipClick = () => {
    setMembershipOpen(!membershipOpen); // Toggle dropdown under Membership
  };

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  const menuItems = [
    { text: "Account", path: "/profile", icon: <Person /> },
    { text: "Rewards", path: "/ClaimRewards", icon: <Star /> },
    {
      text: "Event Registrations",
      path: "/user-registration-history",
      icon: <History />,
    },
    { text: "Settings", path: "/settings", icon: <Settings /> },
  ];

  const menuItemsAdmin = [
    { text: "Account", path: "/profile", icon: <Person /> },
    { text: "Settings", path: "/settings", icon: <Settings /> },
  ];

  useEffect(() => {
    if (user == null) {
      http.get(`/user/${loggedInUser.id}`).then((res) => {
        setUser(res.data);
      });
    }
  }, [user]);

  return (
    <>
      {user && (
        <Box
          sx={{
            width: { xs: "100%", md: 250 },
            maxWidth: { xs: 400, md: 250 },
            flexShrink: 0,
            bgcolor: "#f4f6f9",
            p: 2,
            borderRadius: "12px",
            boxShadow: 3,
          }}
        >
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Avatar
              src={user?.pfpURL || ""}
              alt={`${user.firstName} ${user.lastName}`}
              sx={{ width: 100, height: 100, mx: "auto" }}
            />
            <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
              {user.firstName} {user.lastName}
              <span role="img" aria-label="VIP">
                🌟
              </span>
            </Typography>
            {user.role != "Admin" && (
              <>
                <Typography variant="body2" color="textSecondary">
                  {user.membershipType} Member
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
                  {user.totalPoints} Points
                </Typography>
              </>
            )}
          </Box>
          <Divider />
          <List component="nav" aria-label="main mailbox folders">
            {user.role == "Customer" &&
              menuItems.map((item) => (
                <ListItem
                  button
                  key={item.text}
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: location.pathname.startsWith(item.path)
                      ? "#e2160f"
                      : "transparent",
                    color: location.pathname.startsWith(item.path)
                      ? "#fff"
                      : "inherit",
                  }}
                >
                  {item.icon}
                  <ListItemText primary={item.text} sx={{ ml: 1 }} />
                </ListItem>
              ))}

            {user.role != "Customer" &&
              menuItemsAdmin.map((item) => (
                <ListItem
                  button
                  key={item.text}
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: location.pathname.startsWith(item.path)
                      ? "#e2160f"
                      : "transparent",
                    color: location.pathname.startsWith(item.path)
                      ? "#fff"
                      : "inherit",
                  }}
                >
                  {item.icon}
                  <ListItemText primary={item.text} sx={{ ml: 1 }} />
                </ListItem>
              ))}
          </List>
          <Divider />
          <Button
            variant="contained"
            color="error"
            fullWidth
            sx={{ mt: 2, borderRadius: "8px" }}
            onClick={handleClickOpen}
            startIcon={<ExitToApp />}
          >
            Logout
          </Button>
        </Box>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Logout"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to logout? You will be redirected to the
            homepage.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={logout} color="error" variant="contained" autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserSidebar;
