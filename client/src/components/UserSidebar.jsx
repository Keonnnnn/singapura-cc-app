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
} from "@mui/material";
import React, { useContext, useState } from "react";
import UserContext from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const UserSidebar = () => {
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

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
  return (
    <>
      <Box
        sx={{
          width: 250,
          bgcolor: "#f5f5f5",
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
          <Typography variant="h6" sx={{ mt: 2 }}>
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
          <ListItem
            button
            onClick={() => navigate("/profile")}
            sx={{
              borderRadius: 2,
              backgroundColor: location.pathname === "/profile" && "#e2160f",
            }}
          >
            <ListItemText primary="Account" />
          </ListItem>
          <ListItem
            button
            onClick={() => navigate("/Membership")}
            sx={{
              borderRadius: 2,
              backgroundColor: location.pathname === "/Membership" && "#e2160f",
            }}
          >
            <ListItemText primary="Membership" />
          </ListItem>
          <ListItem
            button
            onClick={() => navigate("/user-registration-history")}
            sx={{
              borderRadius: 2,
              backgroundColor: location.pathname === "/user-registration-history" && "#e2160f",
            }}
          >
            <ListItemText primary="History" />
          </ListItem>
          <ListItem
            button
            onClick={() => navigate("/reviews")}
            sx={{
              borderRadius: 2,
              backgroundColor: location.pathname === "/reviews" && "#e2160f",
            }}
          >
            <ListItemText primary="Reviews" />
          </ListItem>
          <ListItem
            button
            onClick={() => navigate("/settings")}
            sx={{
              borderRadius: 2,
              backgroundColor: location.pathname === "/settings" && "#e2160f",
            }}
          >
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
        <Divider />
        <Button
          variant="contained"
          color="error"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleClickOpen}
        >
          Logout
        </Button>
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Logout"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={logout} color="error" autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserSidebar;
