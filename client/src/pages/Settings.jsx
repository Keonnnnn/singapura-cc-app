import React, { useContext, useEffect, useState } from "react";
import UserSidebar from "../components/UserSidebar";
import {
  Box,
  FormControlLabel,
  Grid,
  Paper,
  Switch,
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
              p: 3,
              maxWidth: 800,
              width: "100%",
              position: "relative",
              borderRadius: "12px",
            }}
          >
            <Grid container spacing={2} mt={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch checked={otpEnabled} onChange={handleOtpToggle} />
                  }
                  label="Enable Two-Factor Authentication (OTP)"
                />
              </Grid>
              {/* ... other settings */}
            </Grid>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default Settings;
