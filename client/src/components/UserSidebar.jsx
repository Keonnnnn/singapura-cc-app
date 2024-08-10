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
  IconButton
} from "@mui/material";
import React, { useContext, useState } from "react";
import UserContext from "../contexts/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import { ExitToApp, Person, Star, History, RateReview, Settings } from "@mui/icons-material";

const UserSidebar = () => {
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  const menuItems = [
    { text: 'Account', path: '/profile', icon: <Person /> },
    { text: 'Membership', path: '/Membership', icon: <Star /> },
    { text: 'History', path: '/user-registration-history', icon: <History /> },
    { text: 'Reviews', path: '/reviews', icon: <RateReview /> },
    { text: 'Settings', path: '/settings', icon: <Settings /> }
  ];

  return (
    <>
      <Box
        sx={{
          width: 250,
          bgcolor: "#f4f6f9",
          p: 2,
          borderRadius: "12px",
          boxShadow: 3,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Avatar
            src="/path/to/avatar.jpg"
            alt={`${user.firstName} ${user.lastName}`}
            sx={{ width: 100, height: 100, mx: "auto" }}
          />
          <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
            {user.firstName} {user.lastName}
            <span role="img" aria-label="VIP">
              🌟
            </span>
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {user.membershipType} Member
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
            100,000 Points
          </Typography>
        </Box>
        <Divider />
        <List component="nav" aria-label="main mailbox folders">
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                backgroundColor: location.pathname === item.path ? "#e2160f" : "transparent",
                color: location.pathname === item.path ? "#fff" : "inherit",
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
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ '& .MuiDialog-paper': { borderRadius: '16px' } }}
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Logout"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to logout? You will be redirected to the homepage.
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
