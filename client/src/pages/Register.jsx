import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormHelperText,
  InputLabel,
  FormControl,
  Container,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../http";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import signupImage from "../assets/signup.png";
import arrowRight from "../assets/arrow-right.svg";
import arrowLeft from "../assets/arrow-left.svg";
import logo from "../assets/logo.png";

// First form validation schema
const firstFormValidationSchema = yup.object({
  salutations: yup
    .string()
    .trim()
    .min(2, "Salutations must be at least 2 characters.")
    .max(10, "Salutations must be at most 10 characters")
    .required("Salutations is required")
    .matches(
      /^[a-zA-Z '-,.]+$/,
      "Salutations only allow letters, spaces and characters: ' - , ."
    ),
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
  confirmPassword: yup
    .string()
    .trim()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

// Second form validation schema
const secondFormValidationSchema = yup.object({
  dateOfBirth: yup.date().required("Date of Birth is required"),
  gender: yup.string().required("Gender is required"),
  mobileNumber: yup
    .string()
    .trim()
    .matches(/^\d{8}$/, "Mobile number must be exactly 8 digits")
    .required("Mobile number is required"),
  blockNo: yup
    .string()
    .trim()
    .required("Block No. is required")
    .matches(
      /^\d+[a-zA-Z]?$/,
      "Block No. must be numbers and can have a letter at the end"
    ),
  unitNo: yup
    .string()
    .trim()
    .required("Unit No. is required")
    .matches(
      /^\d{2}-?\d{2,3}$/,
      "Unit No. must be in the format 08-238, 08238, or 08-23"
    ),
  streetName: yup.string().trim().required("Street Name is required"),
  postalCode: yup
    .string()
    .trim()
    .matches(/^\d{6}$/, "Postal Code must be exactly 6 digits")
    .required("Postal Code is required"),
  idType: yup.string().required("ID Type is required"),
  idNumber: yup.string().trim().required("ID Number is required"),
  citizenshipStatus: yup.string().required("Citizenship Status is required"),
  race: yup.string().required("Race is required"),
});

function Register() {
  const [showSecondForm, setShowSecondForm] = useState(false);
  const navigate = useNavigate();

  // First formik instance for the first form
  const formik1 = useFormik({
    initialValues: {
      salutations: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: firstFormValidationSchema,
    onSubmit: () => {
      // Validate first form before proceeding to the second form
      setShowSecondForm(true);
    },
  });

  // Second formik instance for the second form
  const formik2 = useFormik({
    initialValues: {
      dateOfBirth: "",
      gender: "",
      mobileNumber: "",
      blockNo: "",
      unitNo: "",
      streetName: "",
      postalCode: "",
      idType: "",
      idNumber: "",
      citizenshipStatus: "",
      race: "",
    },
    validationSchema: secondFormValidationSchema,
    onSubmit: (data) => {
      const finalData = {
        ...formik1.values,
        ...data,
      };
      // Send the combined data to the server
      http
        .post("/user/register", finalData)
        .then((res) => {
          console.log(res.data);
          toast.success("User registered successfully");
          navigate("/login");
        })
        .catch((err) => {
          toast.error(`${err.response.data.message}`);
        });
    },
  });

  return (
    <Container
      sx={{
        mb: 10,
      }}
    >
      {showSecondForm ? (
        <Box
          sx={{
            mt: { xs: 4, md: 10 },
            display: "flex",
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: 3,
            p: { xs: 2, md: 5 },
            justifyContent: "center",
          }}
        >
          <Box
            component="form"
            onSubmit={formik2.handleSubmit}
            sx={{ width: "100%", minWidth: 0 }}
          >
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }} gap={{ xs: 0, md: 5 }}>
              <Grid container spacing={2} sx={{ width: { xs: "100%", md: "50%" }, minWidth: 0 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Date of Birth"
                    name="dateOfBirth"
                    value={formik2.values.dateOfBirth}
                    onChange={formik2.handleChange}
                    onBlur={formik2.handleBlur}
                    error={
                      formik2.touched.dateOfBirth &&
                      Boolean(formik2.errors.dateOfBirth)
                    }
                    helperText={
                      formik2.touched.dateOfBirth && formik2.errors.dateOfBirth
                    }
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl
                    fullWidth
                    error={
                      formik2.touched.gender && Boolean(formik2.errors.gender)
                    }
                  >
                    <InputLabel id="gender-label">Gender</InputLabel>
                    <Select
                      labelId="gender-label"
                      id="gender"
                      name="gender"
                      label="Gender"
                      value={formik2.values.gender}
                      onChange={formik2.handleChange}
                      onBlur={formik2.handleBlur}
                    >
                      <MenuItem value="">
                        <em>---</em>
                      </MenuItem>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                    {formik2.touched.gender && formik2.errors.gender && (
                      <FormHelperText>{formik2.errors.gender}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Mobile Number"
                    name="mobileNumber"
                    value={formik2.values.mobileNumber}
                    onChange={formik2.handleChange}
                    onBlur={formik2.handleBlur}
                    error={
                      formik2.touched.mobileNumber &&
                      Boolean(formik2.errors.mobileNumber)
                    }
                    helperText={
                      formik2.touched.mobileNumber &&
                      formik2.errors.mobileNumber
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Block No."
                    name="blockNo"
                    value={formik2.values.blockNo}
                    onChange={formik2.handleChange}
                    onBlur={formik2.handleBlur}
                    error={
                      formik2.touched.blockNo && Boolean(formik2.errors.blockNo)
                    }
                    helperText={
                      formik2.touched.blockNo && formik2.errors.blockNo
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Unit No."
                    name="unitNo"
                    value={formik2.values.unitNo}
                    onChange={formik2.handleChange}
                    onBlur={formik2.handleBlur}
                    error={
                      formik2.touched.unitNo && Boolean(formik2.errors.unitNo)
                    }
                    helperText={formik2.touched.unitNo && formik2.errors.unitNo}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Street Name"
                    name="streetName"
                    value={formik2.values.streetName}
                    onChange={formik2.handleChange}
                    onBlur={formik2.handleBlur}
                    error={
                      formik2.touched.streetName &&
                      Boolean(formik2.errors.streetName)
                    }
                    helperText={
                      formik2.touched.streetName && formik2.errors.streetName
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Postal Code"
                    name="postalCode"
                    value={formik2.values.postalCode}
                    onChange={formik2.handleChange}
                    onBlur={formik2.handleBlur}
                    error={
                      formik2.touched.postalCode &&
                      Boolean(formik2.errors.postalCode)
                    }
                    helperText={
                      formik2.touched.postalCode && formik2.errors.postalCode
                    }
                  />
                </Grid>
                {/* add ID type dropdown, ID number textfield, citizenship status dropdown, and race dropdown*/}
              </Grid>
              <Grid container spacing={2} sx={{ width: { xs: "100%", md: "50%" }, minWidth: 0 }}>
                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    error={
                      formik2.touched.idType && Boolean(formik2.errors.idType)
                    }
                  >
                    <InputLabel id="id-type-label">ID Type</InputLabel>
                    <Select
                      labelId="id-type-label"
                      id="idType"
                      name="idType"
                      label="ID Type"
                      value={formik2.values.idType}
                      onChange={formik2.handleChange}
                      onBlur={formik2.handleBlur}
                    >
                      <MenuItem value="">
                        <em>---</em>
                      </MenuItem>
                      <MenuItem value="Passport">Passport</MenuItem>
                      <MenuItem value="Driver's License">
                        Driver{"'"}s License
                      </MenuItem>
                      <MenuItem value="National ID">National ID</MenuItem>
                    </Select>
                    {formik2.touched.idType && formik2.errors.idType && (
                      <FormHelperText>{formik2.errors.idType}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="ID Number"
                    name="idNumber"
                    value={formik2.values.idNumber}
                    onChange={formik2.handleChange}
                    onBlur={formik2.handleBlur}
                    error={
                      formik2.touched.idNumber &&
                      Boolean(formik2.errors.idNumber)
                    }
                    helperText={
                      formik2.touched.idNumber && formik2.errors.idNumber
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    error={
                      formik2.touched.citizenshipStatus &&
                      Boolean(formik2.errors.citizenshipStatus)
                    }
                  >
                    <InputLabel id="citizenship-status-label">
                      Citizenship Status
                    </InputLabel>
                    <Select
                      labelId="citizenship-status-label"
                      id="citizenshipStatus"
                      name="citizenshipStatus"
                      label="Citizenship Status"
                      value={formik2.values.citizenshipStatus}
                      onChange={formik2.handleChange}
                      onBlur={formik2.handleBlur}
                    >
                      <MenuItem value="">
                        <em>---</em>
                      </MenuItem>
                      <MenuItem value="Singapore Citizen">
                        Singapore Citizen
                      </MenuItem>
                      <MenuItem value="Permanent Resident">
                        Permanent Resident
                      </MenuItem>
                      <MenuItem value="Foreigner">Foreigner</MenuItem>
                    </Select>
                    {formik2.touched.citizenshipStatus &&
                      formik2.errors.citizenshipStatus && (
                        <FormHelperText>
                          {formik2.errors.citizenshipStatus}
                        </FormHelperText>
                      )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    error={formik2.touched.race && Boolean(formik2.errors.race)}
                  >
                    <InputLabel id="race-label">Race</InputLabel>
                    <Select
                      labelId="race-label"
                      id="race"
                      name="race"
                      label="Race"
                      value={formik2.values.race}
                      onChange={formik2.handleChange}
                      onBlur={formik2.handleBlur}
                    >
                      <MenuItem value="">
                        <em>---</em>
                      </MenuItem>
                      <MenuItem value="Chinese">Chinese</MenuItem>
                      <MenuItem value="Malay">Malay</MenuItem>
                      <MenuItem value="Indian">Indian</MenuItem>
                      <MenuItem value="Eurasian">Eurasian</MenuItem>
                      <MenuItem value="Others">Others</MenuItem>
                    </Select>
                    {formik2.touched.race && formik2.errors.race && (
                      <FormHelperText>{formik2.errors.race}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                variant="text"
                sx={{ mt: 2, fontSize: "16px" }}
                onClick={() => {
                  setShowSecondForm(false);
                }}
              >
                <img
                  src={arrowLeft}
                  alt="arrow-left"
                  style={{ marginRight: 10 }}
                />
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 2, paddingX: 10, fontSize: "16px" }}
              >
                Sign up
              </Button>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            mt: { xs: 4, md: 10 },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: 3,
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", md: "50%" },
              height: { xs: 220, md: "auto" },
              flexShrink: 0,
              minWidth: 0,
              borderTopRightRadius: 2,
              backgroundImage: `url(${signupImage})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            <Box
              sx={{
                p: { xs: 2, md: 5 },
              }}
            >
              <Box
                sx={{
                  bgcolor: "rgba(0, 0, 0, 0.5)",
                  p: 2,
                  borderRadius: 2,
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                <Typography
                  variant="p"
                  align="left"
                  sx={{
                    color: "white",
                  }}
                >
                  Already a Member?
                </Typography>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "white", width: "140px", py: 0.2 }}
                >
                  <Link
                    to="/login"
                    style={{
                      textDecoration: "none",
                      color: "red",
                      fontSize: "16px",
                    }}
                  >
                    Login
                  </Link>
                </Button>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              width: { xs: "100%", md: "50%" },
              minWidth: 0,
              display: "flex",
              justifyContent: "center",
              bgcolor: "rgba(255, 255, 255, 0.8)", // Optional: semi-transparent background
              p: { xs: 2, md: 3 },
            }}
          >
            <Box component="form" onSubmit={formik1.handleSubmit} sx={{ width: "100%", maxWidth: 450, minWidth: 0 }}>
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
                Sign Up
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControl
                    fullWidth
                    margin="dense"
                    sx={{}}
                    error={
                      formik1.touched.salutations &&
                      Boolean(formik1.errors.salutations)
                    }
                  >
                    <InputLabel id="salutations-label">Salutations</InputLabel>
                    <Select
                      labelId="salutations-label"
                      id="salutations"
                      name="salutations"
                      label="Salutations"
                      value={formik1.values.salutations}
                      onChange={formik1.handleChange}
                      onBlur={formik1.handleBlur}
                    >
                      <MenuItem value="">
                        <em>---</em>
                      </MenuItem>
                      <MenuItem value="Mr">Mr</MenuItem>
                      <MenuItem value="Mrs">Mrs</MenuItem>
                      <MenuItem value="Ms">Ms</MenuItem>
                      <MenuItem value="Mdm">Mdm</MenuItem>
                    </Select>
                    {formik1.touched.salutations &&
                      formik1.errors.salutations && (
                        <FormHelperText>
                          {formik1.errors.salutations}
                        </FormHelperText>
                      )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    margin="dense"
                    autoComplete="off"
                    label="First Name"
                    name="firstName"
                    value={formik1.values.firstName}
                    onChange={formik1.handleChange}
                    onBlur={formik1.handleBlur}
                    error={
                      formik1.touched.firstName &&
                      Boolean(formik1.errors.firstName)
                    }
                    helperText={
                      formik1.touched.firstName && formik1.errors.firstName
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    margin="dense"
                    autoComplete="off"
                    label="Last Name"
                    name="lastName"
                    value={formik1.values.lastName}
                    onChange={formik1.handleChange}
                    onBlur={formik1.handleBlur}
                    error={
                      formik1.touched.lastName &&
                      Boolean(formik1.errors.lastName)
                    }
                    helperText={
                      formik1.touched.lastName && formik1.errors.lastName
                    }
                  />
                </Grid>
              </Grid>

              <TextField
                fullWidth
                margin="dense"
                autoComplete="off"
                label="Email Address"
                name="email"
                value={formik1.values.email}
                onChange={formik1.handleChange}
                onBlur={formik1.handleBlur}
                error={formik1.touched.email && Boolean(formik1.errors.email)}
                helperText={formik1.touched.email && formik1.errors.email}
              />

              <TextField
                fullWidth
                margin="dense"
                autoComplete="off"
                type="password"
                label="Password"
                name="password"
                value={formik1.values.password}
                onChange={formik1.handleChange}
                onBlur={formik1.handleBlur}
                error={
                  formik1.touched.password && Boolean(formik1.errors.password)
                }
                helperText={formik1.touched.password && formik1.errors.password}
              />

              <TextField
                fullWidth
                margin="dense"
                autoComplete="off"
                type="password"
                label="Confirm Password"
                name="confirmPassword"
                value={formik1.values.confirmPassword}
                onChange={formik1.handleChange}
                onBlur={formik1.handleBlur}
                error={
                  formik1.touched.confirmPassword &&
                  Boolean(formik1.errors.confirmPassword)
                }
                helperText={
                  formik1.touched.confirmPassword &&
                  formik1.errors.confirmPassword
                }
              />

              <Box
                fullWidth
                sx={{
                  display: "flex",
                  justifyContent: "right",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="text"
                  sx={{ mt: 2, fontSize: "16px" }}
                  onClick={() => {
                    formik1.handleSubmit();
                  }}
                >
                  Next
                  <img
                    src={arrowRight}
                    alt="arrow-right"
                    style={{ marginLeft: 10 }}
                  />
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Container>
  );
}

export default Register;
