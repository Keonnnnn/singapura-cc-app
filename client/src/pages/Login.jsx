import React, { useContext } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Container,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../http";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserContext from "../contexts/UserContext";

import loginImage from "../assets/login.png";
import logo from "../assets/logo.png";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: yup.object({
      email: yup
        .string()
        .trim()
        .email("Enter a valid email")
        .max(50, "Email must be at most 50 characters")
        .required("Email is required"),
      password: yup
        .string()
        .trim()
        .min(8, "Password must be at least 8 characters")
        .max(50, "Password must be at most 50 characters")
        .required("Password is required")
        .matches(
          /^(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
          "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character."
        ),
    }),
    onSubmit: async (data) => {
      data.email = data.email.trim().toLowerCase();
      data.password = data.password.trim();
      try {
        const res = await http.post("/user/login", data);
        if (res.data.needOtp) {
          // Redirect to OTP page if OTP is needed
          navigate("/otp-verification", {
            state: { email: data.email, accessToken: res.data.accessToken },
          });
        } else {
          localStorage.setItem("accessToken", res.data.accessToken);
          setUser(res.data.user);
          if (
            res.data.user.role === "Admin" ||
            res.data.user.role === "Staff"
          ) {
            navigate("/admin/dashboard");
          } else {
            navigate("/");
          }
        }
      } catch (err) {
        toast.error(`${err.response.data.message}`);
      }
    },
  });

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
            borderTopRightRadius: 2,
            backgroundImage: `url(${loginImage})`,
            backgroundPosition: "left",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <Box
            sx={{
              p: 5,
            }}
          >
            <Box
              sx={{
                bgcolor: "rgba(0, 0, 0, 0.5)",
                p: 2,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="p"
                align="left"
                sx={{
                  color: "white",
                }}
              >
                Not a Member yet?
              </Typography>
              <Button
                variant="contained"
                sx={{ backgroundColor: "white", width: "140px", py: 0.2 }}
              >
                <Link
                  to="/register"
                  style={{
                    textDecoration: "none",
                    color: "red",
                    fontSize: "16px",
                  }}
                >
                  Sign Up
                </Link>
              </Button>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            width: "50%",
            display: "flex",
            justifyContent: "center",
            bgcolor: "rgba(255, 255, 255, 0.8)", // Optional: semi-transparent background
            p: 3,
          }}
        >
          <Box component="form" onSubmit={formik.handleSubmit}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img src={logo} alt="logo" style={{ width: 100 }} />
            </Box>
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{ color: "red", fontWeight: "600" }}
            >
              Log In
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  label="Email Address"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  type="password"
                  label="Password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                />
              </Grid>
            </Grid>
            <Link to="/forgot-password" style={{ textDecoration: "none" }}>
              <Typography
                variant="p"
                align="right"
                sx={{
                  color: "red",
                  fontSize: "14px",
                  mt: 1,
                }}
              >
                Forgot Password?
              </Typography>
            </Link>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 5, paddingX: 12, fontSize: 16 }}
              >
                Login
              </Button>
            </Box>
            <ToastContainer />
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
