// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";
import http from "../http";
import loginImage from "../assets/login.png"; 
import logo from "../assets/logo.png"; 

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await http.post("/user/forgot-password", { email });
      setMessage(response.data.message);
      setError("");
    } catch (err) {
      setError(err.response ? err.response.data.message : "An error occurred");
      setMessage("");
    }
  };

  return (
    <Container>
      <Box
        sx={{
          mt: 10,
          display: "flex",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 3,
          height: "500px",
        }}
      >
        <Box
          sx={{
            width: "50%",
            backgroundImage: `url(${loginImage})`,
            backgroundPosition: "left",
            backgroundSize: "cover",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
        </Box>
        <Box
          sx={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            bgcolor: "rgba(255, 255, 255, 0.8)", // Optional: semi-transparent background
            p: 3,
          }}
        >
          <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img src={logo} alt="logo" style={{ width: 100 }} />
            </Box>

          <Typography variant="h4" align="center" gutterBottom>
            Forgot Password
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              label="Email Address"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            {message && <Alert severity="success">{message}</Alert>}
            {error && <Alert severity="error">{error}</Alert>}
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Send Password Reset Link
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
