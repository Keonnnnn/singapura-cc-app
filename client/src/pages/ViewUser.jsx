import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import http from "../http";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  Grid,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { Close, ArrowBack } from "@mui/icons-material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ViewUser() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [userDetails, setUserDetails] = useState({
    salutations: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    mobileNumber: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http
      .get(`/user/${id}`)
      .then((res) => {
        setUserDetails(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        if (err.response && err.response.status === 404) {
          navigate("/admin/users"); // Redirect to users list if user is not found
        }
      });
  }, [id, navigate]);

  const formik = useFormik({
    initialValues: {
      salutations: userDetails.salutations,
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      dateOfBirth: userDetails.dateOfBirth,
      gender: userDetails.gender,
      email: userDetails.email,
      mobileNumber: userDetails.mobileNumber,
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      salutations: yup.string().trim(),
      firstName: yup
        .string()
        .trim()
        .min(2)
        .max(50)
        .matches(
          /^[a-zA-Z '-,.]+$/,
          "First name only allows letters, spaces and characters: ' - , ."
        )
        .required("First name is required."),
      lastName: yup
        .string()
        .trim()
        .min(2)
        .max(50)
        .matches(
          /^[a-zA-Z '-,.]+$/,
          "Last name only allows letters, spaces and characters: ' - , ."
        )
        .required("Last name is required."),
      dateOfBirth: yup.date(),
      gender: yup.string(),
      email: yup
        .string()
        .trim()
        .lowercase()
        .email()
        .max(50)
        .required("Email is required."),
      mobileNumber: yup
        .string()
        .trim()
        .matches(/^\d{8}$/, "Mobile number must be exactly 8 digits"),
    }),
    onSubmit: async () => {
      navigate(`/admin/users/${id}/edit`); // Redirect to edit user page
    },
  });

  const handleCancel = () => {
    navigate("/admin/users"); // Redirect to users list
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
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
          }}
          onClick={handleCancel}
        >
          <Close />
        </IconButton>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography variant="h5" sx={{ flex: 1 }}>
            View User
          </Typography>
        </Box>

        {!loading && (
          <Box component="form" onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Salutations"
                  name="salutations"
                  value={formik.values.salutations}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.salutations &&
                    Boolean(formik.errors.salutations)
                  }
                  helperText={
                    formik.touched.salutations && formik.errors.salutations
                  }
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="First Name"
                  name="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.firstName && Boolean(formik.errors.firstName)
                  }
                  helperText={
                    formik.touched.firstName && formik.errors.firstName
                  }
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Last Name"
                  name="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.lastName && Boolean(formik.errors.lastName)
                  }
                  helperText={formik.touched.lastName && formik.errors.lastName}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Date of Birth"
                  name="dateOfBirth"
                  value={formik.values.dateOfBirth}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.dateOfBirth &&
                    Boolean(formik.errors.dateOfBirth)
                  }
                  helperText={
                    formik.touched.dateOfBirth && formik.errors.dateOfBirth
                  }
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="outlined"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Gender"
                  name="gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.gender && Boolean(formik.errors.gender)}
                  helperText={formik.touched.gender && formik.errors.gender}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Mobile Number"
                  name="mobileNumber"
                  value={formik.values.mobileNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.mobileNumber &&
                    Boolean(formik.errors.mobileNumber)
                  }
                  helperText={
                    formik.touched.mobileNumber && formik.errors.mobileNumber
                  }
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="outlined"
                />
              </Grid>
            </Grid>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
              }}
            >
              <Button
                variant="contained"
                type="submit"
                color="secondary"
                sx={{ borderRadius: "24px" }}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCancel}
                sx={{ borderRadius: "24px" }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        )}

        <ToastContainer />
      </Paper>
    </Box>
  );
}

export default ViewUser;
