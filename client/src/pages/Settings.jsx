import React, { useContext, useEffect, useState } from "react";
import UserSidebar from "../components/UserSidebar";
import {
  Box,
  FormControlLabel,
  Grid,
  Paper,
  Switch,
  Divider,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import UserContext from "../contexts/UserContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import http from "../http";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { user, setUser } = useContext(UserContext);
  const [otpEnabled, setOtpEnabled] = useState(user?.otpEnabled || false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const navigate = useNavigate();

  const handleOtpToggle = () => {
    const newOtpEnabled = !otpEnabled;
    setOtpEnabled(newOtpEnabled);

    http
      .put(`/user/${user.id}`, { ...user, otpEnabled: newOtpEnabled })
      .then(() => {
        setUser({ ...user, otpEnabled: newOtpEnabled });
        toast.success("OTP status updated successfully.");
      })
      .catch((error) => {
        setOtpEnabled(!newOtpEnabled); // Revert OTP status if there's an error
        console.error("Error updating OTP status:", error);
        toast.error("Error updating OTP status.");
      });
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleAccountDeletion = () => {
    http
      .post(`/user/${user.id}/delete-request`)
      .then(() => {
        toast.success(
          "Your account will be disabled for 24 hours before permanent deletion."
        );
        setOpenDeleteDialog(false);
        // Optionally, you can log the user out here
        localStorage.clear();
        window.location = "/";
        setUser(null);
      })
      .catch((error) => {
        console.error("Error requesting account deletion:", error);
        toast.error("Error requesting account deletion.");
      });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await http.get(`/user/${user.id}`);
        setUser(response.data);
        setOtpEnabled(response.data.otpEnabled);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, []);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 5 }}>
      {user && (
        <>
          <UserSidebar />
          <Paper
            elevation={3}
            sx={{
              p: 4,
              maxWidth: 900,
              width: "100%",
              borderRadius: "16px",
              backgroundColor: "#f4f6f9",
              position: "relative",
            }}
          >
            <Typography
              gutterBottom
              variant="h4"
              sx={{
                my: 2,
                textAlign: "center",
                color: "#e2160f",
                fontWeight: "bold",
              }}
            >
              Account Settings
            </Typography>
            <Divider sx={{ my: 2 }} />

            {/* Two-Factor Authentication */}
            <Typography
              variant="h6"
              sx={{ color: "#e2160f", fontWeight: "bold" }}
            >
              Security Settings
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch checked={otpEnabled} onChange={handleOtpToggle} />
                  }
                  label="Enable Two-Factor Authentication (OTP)"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Delete Account */}
            {user.role != "Admin" && (
              <>
                <Typography
                  variant="h6"
                  sx={{ color: "#e2160f", fontWeight: "bold" }}
                >
                  Danger Zone
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleOpenDeleteDialog}
                  sx={{ mt: 2 }}
                >
                  Delete My Account
                </Button>
              </>
            )}
          </Paper>
        </>
      )}
      {/* Delete Account Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Account?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete your account?  
          </DialogContentText>

          <DialogContentText>
            This action will disable your account for 24 hours before permanent deletion. You can
            undo this action by logging in again within 24 hours.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleAccountDeletion}
            color="error"
            variant="contained"
          >
            Delete My Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;
