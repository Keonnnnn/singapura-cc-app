import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Grid,
  Alert,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import http from "../http";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserContext from "../contexts/UserContext";

const OtpVerification = () => {
  const { user, setUser } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [otpGenerated, setOtpGenerated] = useState(false); // State to track OTP generation
  const email = location.state?.email || "";

  useEffect(() => {
    // Redirect if no email is found or if user is already logged in
    if (!email) {
      navigate("/login");
      return;
    }

    if (localStorage.getItem("accessToken")) {
      navigate("/");
      return;
    }

    // Generate OTP only if it hasn't been generated yet
    if (!otpGenerated) {
      const generateOtp = async () => {
        try {
          await http.post("/user/generate-otp", { email });
          toast.success("OTP sent to your email");
          setOtpGenerated(true); // Update state to prevent re-generation
        } catch (err) {
          console.error("Error generating OTP:", err);
          setError("Error generating OTP.");
        }
      };

      generateOtp();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await http.post("/user/verify-otp", {
        email,
        otp,
      });
      setMessage(response.data.message);
      setError("");
      localStorage.setItem("accessToken", response.data.accessToken);
      setUser(response.data.user);
      navigate("/"); // Redirect to home or another page after successful verification
    } catch (err) {
      setError(err.response ? err.response.data.message : "An error occurred");
      setMessage("");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 10, p: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          OTP Verification
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="OTP"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                autoFocus
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
          {message && <Alert severity="success">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Button type="submit" variant="contained" color="primary">
              Verify OTP
            </Button>
          </Box>
          <ToastContainer />
        </Box>
      </Box>
    </Container>
  );
};

export default OtpVerification;
