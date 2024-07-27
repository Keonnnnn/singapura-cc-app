import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import http from "../http";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Grid,
  Avatar,
  Divider,
  Button,
  ListItemText,
  ListItem,
  List,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
  DialogContentText,
} from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Edit } from "@mui/icons-material";
import UserContext from "../contexts/UserContext";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { user: loggedInUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const { id } = loggedInUser;

  const [open, setOpen] = useState(false);

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
  useEffect(() => {
    const fetchProfile = async () => {
      if (localStorage.getItem("accessToken")) {
        try {
          const res = await http.get(`/user/profile/${id}`);
          setUser(res.data);
        } catch (error) {
          console.error(error);
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 5 }}>
      {user && (
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
                alt="Keon Shu"
                sx={{ width: 100, height: 100, mx: "auto" }}
              />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Keon Shu{" "}
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
                  backgroundColor:
                    location.pathname === "/profile" && "#e2160f",
                }}
              >
                <ListItemText primary="Account" />
              </ListItem>
              <ListItem
                button
                onClick={() => navigate("/membership")}
                sx={{
                  borderRadius: 2,
                  backgroundColor:
                    location.pathname === "/membership" && "#e2160f",
                }}
              >
                <ListItemText primary="Membership" />
              </ListItem>
              <ListItem
                button
                onClick={() => navigate("/history")}
                sx={{
                  borderRadius: 2,
                  backgroundColor:
                    location.pathname === "/history" && "#e2160f",
                }}
              >
                <ListItemText primary="History" />
              </ListItem>
              <ListItem
                button
                onClick={() => navigate("/reviews")}
                sx={{
                  borderRadius: 2,
                  backgroundColor:
                    location.pathname === "/reviews" && "#e2160f",
                }}
              >
                <ListItemText primary="Reviews" />
              </ListItem>
              <ListItem
                button
                onClick={() => navigate("/settings")}
                sx={{
                  borderRadius: 2,
                  backgroundColor:
                    location.pathname === "/settings" && "#e2160f",
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
          <Paper
            elevation={3}
            sx={{
              p: 3,
              maxWidth: 800,
              width: "100%",
              position: "relative",
              borderRadius: "12px",
            }}
          >
            <IconButton
              color="secondary"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                bgcolor: "rgba(255,255,255,0.8)",
                borderRadius: "50%",
                gap: 1,
              }}
              onClick={handleBack}
            >
              <Edit />
              <Typography>Edit</Typography>
            </IconButton>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                sx={{ width: 100, height: 100 }}
                src={""}
                alt={`${loggedInUser.firstName} ${loggedInUser.lastName}`}
              />
              <Typography variant="h5" sx={{ ml: 2 }}>
                {loggedInUser.firstName} {loggedInUser.lastName}
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body1">
                    <strong>Salutations:</strong> {user.salutations}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body1">
                    <strong>First Name:</strong> {user.firstName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body1">
                    <strong>Last Name:</strong> {user.lastName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Date of Birth:</strong> {user.dateOfBirth}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Gender:</strong> {user.gender}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Email:</strong> {user.email}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Mobile Number:</strong> {user.mobileNumber}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Residential Address
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Block No.:</strong> {user.blockNo}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Unit No.:</strong> {user.unitNo}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <strong>Street Name:</strong> {user.streetName}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <strong>Postal Code:</strong> {user.postalCode}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Additional Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>ID Type:</strong> {user.idType}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>ID Number:</strong> {user.idNumber}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Citizenship Status:</strong>{" "}
                    {user.citizenshipStatus}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Race:</strong> {user.race}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <ToastContainer />
          </Paper>
        </>
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
    </Box>
  );
};

export default Profile;
