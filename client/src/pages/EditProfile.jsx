import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import http from "../http";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Button,
  TextField,
  MenuItem,
  FormHelperText,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import * as yup from "yup";
import UserContext from "../contexts/UserContext";
import UserSidebar from "../components/UserSidebar";

// Validation schema

const EditProfile = () => {
  const navigate = useNavigate();
  const { user: loggedInUser } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = loggedInUser;
  const options = { year: "numeric", month: "long", day: "numeric" };
  const validationSchema = yup.object({
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
    dateOfBirth: yup.date().required("Date of Birth is required"),
    gender: yup.string().required("Gender is required"),
    email: yup
      .string()
      .trim()
      .email("Enter a valid email")
      .max(50, "Email must be at most 50 characters")
      .required("Email is required"),
    mobileNumber: yup
      .string()
      .trim()
      .matches(/^\d{8}$/, "Mobile number must be exactly 8 digits")
      .required("Mobile number is required"),
    blockNo: yup.string().trim().required("Block No. is required"),
    unitNo: yup.string().trim().required("Unit No. is required"),
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
  }, [id]);

  const formik = useFormik({
    initialValues: {
      salutations: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      email: "",
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
    validationSchema,
    onSubmit: async (values) => {
      try {
        await http.put(`/user/profile/${id}`, values);
        toast.success("Profile updated successfully");
        navigate(-1); // Navigate back to the previous page or update this as per your navigation needs
      } catch (error) {
        toast.error("Failed to update profile");
        console.error(error);
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (user) {
      formik.setValues({
        salutations: user.salutations || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        dateOfBirth: user.dateOfBirth
          ? new Date(user.dateOfBirth).toISOString().split("T")[0]
          : "",
        gender: user.gender || "",
        email: user.email || "",
        mobileNumber: user.mobileNumber || "",
        blockNo: user.blockNo || "",
        unitNo: user.unitNo || "",
        streetName: user.streetName || "",
        postalCode: user.postalCode || "",
        idType: user.idType || "",
        idNumber: user.idNumber || "",
        citizenshipStatus: user.citizenshipStatus || "",
        race: user.race || "",
      });
    }
  }, [user]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", my: 4, gap: 5 }}>
      {!loading && user && (
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

            <Box component="form" onSubmit={formik.handleSubmit}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
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
                    <InputLabel id="salutations-label">Salutations</InputLabel>
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
                    {formik.touched.salutations &&
                      formik.errors.salutations && (
                        <FormHelperText>
                          {formik.errors.salutations}
                        </FormHelperText>
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
                      formik.touched.firstName &&
                      Boolean(formik.errors.firstName)
                    }
                    helperText={
                      formik.touched.firstName && formik.errors.firstName
                    }
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
                    helperText={
                      formik.touched.lastName && formik.errors.lastName
                    }
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
                    error={
                      formik.touched.gender && Boolean(formik.errors.gender)
                    }
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

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Residential Address
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Block No."
                    name="blockNo"
                    value={formik.values.blockNo}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.blockNo && Boolean(formik.errors.blockNo)
                    }
                    helperText={formik.touched.blockNo && formik.errors.blockNo}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Unit No."
                    name="unitNo"
                    value={formik.values.unitNo}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.unitNo && Boolean(formik.errors.unitNo)
                    }
                    helperText={formik.touched.unitNo && formik.errors.unitNo}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Street Name"
                    name="streetName"
                    value={formik.values.streetName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.streetName &&
                      Boolean(formik.errors.streetName)
                    }
                    helperText={
                      formik.touched.streetName && formik.errors.streetName
                    }
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Postal Code"
                    name="postalCode"
                    value={formik.values.postalCode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.postalCode &&
                      Boolean(formik.errors.postalCode)
                    }
                    helperText={
                      formik.touched.postalCode && formik.errors.postalCode
                    }
                    variant="outlined"
                  />
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Additional Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="ID Type"
                    name="idType"
                    value={formik.values.idType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    fullWidth
                    variant="outlined"
                    error={
                      formik.touched.idType && Boolean(formik.errors.idType)
                    }
                    helperText={formik.touched.idType && formik.errors.idType}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="ID Number"
                    name="idNumber"
                    value={formik.values.idNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    fullWidth
                    variant="outlined"
                    error={
                      formik.touched.idNumber && Boolean(formik.errors.idNumber)
                    }
                    helperText={
                      formik.touched.idNumber && formik.errors.idNumber
                    }
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Citizenship Status"
                    name="citizenshipStatus"
                    value={formik.values.citizenshipStatus}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    fullWidth
                    variant="outlined"
                    error={
                      formik.touched.citizenshipStatus &&
                      Boolean(formik.errors.citizenshipStatus)
                    }
                    helperText={
                      formik.touched.citizenshipStatus &&
                      formik.errors.citizenshipStatus
                    }
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Race"
                    name="race"
                    value={formik.values.race}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    fullWidth
                    variant="outlined"
                    error={formik.touched.race && Boolean(formik.errors.race)}
                    helperText={formik.touched.race && formik.errors.race}
                    disabled
                  />
                </Grid>
              </Grid>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  width: "100%",
                  justifyContent: "right",
                }}
              >
                <Button type="submit" variant="contained" sx={{ mt: 3 }}>
                  Save
                </Button>
                <Button onClick={handleBack} variant="outlined" sx={{ mt: 3 }}>
                  Cancel
                </Button>
              </Box>
            </Box>
            <ToastContainer />
          </Paper>
        </>
      )}
    </Box>
  );
};

export default EditProfile;
