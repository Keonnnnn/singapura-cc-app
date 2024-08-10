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
} from "@mui/material";
import UserContext from "../contexts/UserContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import http from "../http";

const Settings = () => {
  const { user, setUser } = useContext(UserContext);
  const [otpEnabled, setOtpEnabled] = useState(user?.otpEnabled || false);

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
  }, [user]);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 5 }}>
      <ToastContainer />
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
            <Typography gutterBottom variant="h4"
        sx={{ my: 2, textAlign: "center", color: "#e2160f", fontWeight: "bold" }}>
              Account Settings
            </Typography>
            <Divider sx={{ my: 2 }} />


            {/* Two-Factor Authentication */}
            <Typography variant="h6" sx={{color: "#e2160f", fontWeight: "bold"}}>Security Settings</Typography>

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
            <Typography variant="h6" sx={{color: "#e2160f", fontWeight: "bold"}}>Danger Zone</Typography>

            


          </Paper>
        </>
      )}
    </Box>
  );
};

export default Settings;
