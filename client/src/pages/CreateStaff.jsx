import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../http";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CreateStaff() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      salutations: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      email: "",
      password: "",
      mobileNumber: "",
    },

    validationSchema: yup.object({
      salutations: yup.string().required("Salutations is required"),
      firstName: yup
        .string()
        .trim()
        .min(2, "First name must be at least 2 characters.")
        .max(50, "First name must be at most 50 characters")
        .required("First name is required")
        .matches(
          /^[a-zA-Z '-,.]+$/,
          "First name only allow letters, spaces and characters: ' - , ."
        ),
      lastName: yup
        .string()
        .trim()
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name must be at most 50 characters")
        .required("Last name is required")
        .matches(
          /^[a-zA-Z '-,.]+$/,
          "Last name only allow letters, spaces and characters: ' - , ."
        ),
      dateOfBirth: yup.date().required("Date of Birth is required"),
      gender: yup.string().required("Gender is required"),
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
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character."
        ),
      mobileNumber: yup
        .string()
        .trim()
        .matches(/^\d{8}$/, "Mobile number must be exactly 8 digits")
        .required("Mobile number is required"),
    }),
    onSubmit: (data) => {
      data.firstName = data.firstName.trim();
      data.lastName = data.lastName.trim();
      data.email = data.email.trim();
      data.password = data.password.trim();
      data.mobileNumber = data.mobileNumber.trim();
      http
        .post("/user/register-staff", data)
        .then((res) => {
          navigate("/admin/users");
        })
        .catch(function (err) {
          toast.error(`${err.response.data.message}`);
        });
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
          p: 4,
          maxWidth: 900,
          width: "100%",
          borderRadius: "16px",
          backgroundColor: "#f4f6f9",
          position: "relative",
        }}
      >
        {/* <Tooltip title="Cancel">
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
        </Tooltip> */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography
            variant="h5"
            sx={{
              my: 2,
              textAlign: "center",
              color: "#e2160f",
              fontWeight: "bold",
            }}
          >
            Add Staff
          </Typography>
        </Box>

        <Box component="form" onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl
                fullWidth
                margin="normal"
                variant="outlined"
                error={
                  formik.touched.salutations &&
                  Boolean(formik.errors.salutations)
                }
              >
                <InputLabel id="salutations-label">Salutation</InputLabel>
                <Select
                  labelId="salutations-label"
                  id="salutations"
                  name="salutations"
                  value={formik.values.salutations}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Salutations"
                >
                  <MenuItem value="">
                    <em>---</em>
                  </MenuItem>
                  <MenuItem value="Mr">Mr</MenuItem>
                  <MenuItem value="Mrs">Mrs</MenuItem>
                  <MenuItem value="Ms">Ms</MenuItem>
                  <MenuItem value="Mdm">Mdm</MenuItem>
                </Select>
                {formik.touched.salutations && formik.errors.salutations && (
                  <FormHelperText>{formik.errors.salutations}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
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
                helperText={formik.touched.firstName && formik.errors.firstName}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
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
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                type="date"
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
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                margin="normal"
                variant="outlined"
                error={formik.touched.gender && Boolean(formik.errors.gender)}
              >
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  id="gender"
                  name="gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Gender"
                >
                  <MenuItem value="">
                    <em>---</em>
                  </MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
                {formik.touched.gender && formik.errors.gender && (
                  <FormHelperText>{formik.errors.gender}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Email Address"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
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
              Add
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
      </Paper>
    </Box>
  );
}

export default CreateStaff;
