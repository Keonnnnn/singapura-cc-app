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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Grid,
  Avatar,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { Close } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState({
    salutations: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    password: "",
    mobileNumber: "",
    blockNo: "",
    unitNo: "",
    streetName: "",
    postalCode: "",
    idType: "",
    idNumber: "",
    citizenshipStatus: "",
    race: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http.get(`/user/${id}`).then((res) => {
      setUser(res.data);
      setLoading(false);
    });
  }, [id]);

  const validationSchema = yup.object({
    salutations: yup
      .string()
      .trim()
      .min(2)
      .max(10)
      .required("Salutations is required"),
    firstName: yup
      .string()
      .trim()
      .min(2)
      .max(50)
      .required("First name is required"),
    lastName: yup
      .string()
      .trim()
      .min(2)
      .max(50)
      .required("Last name is required"),
    dateOfBirth: yup.date().required("Date of Birth is required"),
    gender: yup.string().required("Gender is required"),
    email: yup
      .string()
      .trim()
      .lowercase()
      .email()
      .max(50)
      .required("Email is required"),
    password: yup
      .string()
      .trim()
      .min(8)
      .max(50)
      .required("Password is required"),
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

  const formik = useFormik({
    initialValues: user,
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const updatedUser = {
          ...values,
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          email: values.email.trim(),
        };

        const response = await http.put(`/user/${id}`, updatedUser);
        console.log(response.data);
        navigate("/users");
      } catch (error) {
        console.error("Error updating user:", error);
        toast.error("Failed to update user");
      }
    },
  });

  const handleCancel = () => {
    navigate("/users"); // Redirect to users list
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
            Edit User
          </Typography>
        </Box>

        {!loading && (
          <Box component="form" onSubmit={formik.handleSubmit}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Avatar
                sx={{ width: 100, height: 100 }}
                src={user.avatarUrl || ""}
                alt={`${user.firstName} ${user.lastName}`}
              />
              <Typography variant="h5" sx={{ mt: 2 }}>
                {user.firstName} {user.lastName}
              </Typography>
            </Box>
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
                  disabled
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
              <Grid
                item
                xs={12}
                sm={6}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button variant="contained" color="primary" fullWidth>
                  Reset Password
                </Button>
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
                  error={formik.touched.unitNo && Boolean(formik.errors.unitNo)}
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
                <FormControl
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={formik.touched.idType && Boolean(formik.errors.idType)}
                >
                  <InputLabel id="id-type-label">ID Type</InputLabel>
                  <Select
                    labelId="id-type-label"
                    id="idType"
                    name="idType"
                    value={formik.values.idType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label="ID Type"
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
                  {formik.touched.idType && formik.errors.idType && (
                    <FormHelperText>{formik.errors.idType}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="ID Number"
                  name="idNumber"
                  value={formik.values.idNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.idNumber && Boolean(formik.errors.idNumber)
                  }
                  helperText={formik.touched.idNumber && formik.errors.idNumber}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={
                    formik.touched.citizenshipStatus &&
                    Boolean(formik.errors.citizenshipStatus)
                  }
                >
                  <InputLabel id="citizenship-status-label">
                    Citizenship Status
                  </InputLabel>
                  <Select
                    labelId="citizenship-status-label"
                    id="citizenshipStatus"
                    name="citizenshipStatus"
                    value={formik.values.citizenshipStatus}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label="Citizenship Status"
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
                  {formik.touched.citizenshipStatus &&
                    formik.errors.citizenshipStatus && (
                      <FormHelperText>
                        {formik.errors.citizenshipStatus}
                      </FormHelperText>
                    )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={formik.touched.race && Boolean(formik.errors.race)}
                >
                  <InputLabel id="race-label">Race</InputLabel>
                  <Select
                    labelId="race-label"
                    id="race"
                    name="race"
                    value={formik.values.race}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label="Race"
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
                  {formik.touched.race && formik.errors.race && (
                    <FormHelperText>{formik.errors.race}</FormHelperText>
                  )}
                </FormControl>
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
                Update
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

export default EditUser;
