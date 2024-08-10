import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import http from "../http";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  TextField,
  Button,
  Divider,
  Grid,
  MenuItem,
  FormHelperText,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import UserContext from "../contexts/UserContext";
import UserSidebar from "../components/UserSidebar";
import { useFormik } from "formik";
import * as yup from "yup";

const EditProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: loggedInUser } = location.state || {};
  const { setUser: setLoggedInUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const { id } = loggedInUser;

  const [user, setUser] = useState({
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
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarClick = () => {
    document.getElementById("imageUpload").click();
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (localStorage.getItem("accessToken")) {
        try {
          const res = await http.get(`/user/profile/${id}`);
          setUser({
            ...res.data,
          });
        } catch (error) {
          console.error(error);
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, [id]);

  const custValidationSchema = yup.object().shape({
    salutations: yup
      .string()
      .trim()
      .min(2, "Salutations must be at least 2 characters")
      .max(10, "Salutations can't be longer than 10 characters")
      .required("Salutations is required"),
    firstName: yup
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name can't be longer than 50 characters")
      .required("First name is required"),
    lastName: yup
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name can't be longer than 50 characters")
      .required("Last name is required"),
    dateOfBirth: yup.date().required("Date of Birth is required"),
    gender: yup.string().required("Gender is required"),
    email: yup
      .string()
      .trim()
      .lowercase()
      .email("Enter a valid email")
      .max(50, "Email can't be longer than 50 characters")
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

  const staffValidationSchema = yup.object().shape({
    salutations: yup
      .string()
      .trim()
      .min(2, "Salutations must be at least 2 characters")
      .max(10, "Salutations can't be longer than 10 characters")
      .required("Salutations is required"),
    firstName: yup
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name can't be longer than 50 characters")
      .required("First name is required"),
    lastName: yup
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name can't be longer than 50 characters")
      .required("Last name is required"),
    dateOfBirth: yup.date().required("Date of Birth is required"),
    gender: yup.string().required("Gender is required"),
    email: yup
      .string()
      .trim()
      .lowercase()
      .email("Enter a valid email")
      .max(50, "Email can't be longer than 50 characters")
      .required("Email is required"),
    mobileNumber: yup
      .string()
      .trim()
      .matches(/^\d{8}$/, "Mobile number must be exactly 8 digits")
      .required("Mobile number is required"),
  });

  const adminValidationSchema = yup.object().shape({
    firstName: yup
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name can't be longer than 50 characters")
      .required("First name is required"),
    lastName: yup
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name can't be longer than 50 characters")
      .required("Last name is required"),
    email: yup
      .string()
      .trim()
      .lowercase()
      .email("Enter a valid email")
      .max(50, "Email can't be longer than 50 characters")
      .required("Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      ...user,
    },
    validationSchema:
      loggedInUser.role == "Customer"
        ? custValidationSchema
        : loggedInUser.role == "Staff"
        ? staffValidationSchema
        : adminValidationSchema,
    onSubmit: async (values) => {
      try {
        let profilePictureURL = "";

        // Check if a new image has been selected
        if (selectedImage) {
          // Create a FormData object to handle file upload
          const formData = new FormData();
          formData.append("profilePicture", selectedImage);

          // Make the API request to upload the image
          const uploadResponse = await http.put(
            `/user/profile-picture/${id}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          profilePictureURL = uploadResponse.data.url; // Adjust based on your API's response structure
        }

        const updatedValues = {
          ...values,
          pfpURL: profilePictureURL || values.pfpURL,
        };

        // Update the user's profile
        await http.put(`/user/profile/${id}`, updatedValues);

        setLoggedInUser(
          (prevUser) => ({
            ...prevUser,
            ...updatedValues,
          }),
          setLoggedInUser(updatedValues)
        );

        navigate("/profile");
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    },
    enableReinitialize: true,
  });

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 5 }}>
      {user && (
        <>
          <UserSidebar />
          <Paper
            elevation={4}
            sx={{
              p: 4,
              maxWidth: 900,
              width: "100%",
              borderRadius: "16px",
              backgroundColor: "#f4f6f9",
              position: "relative",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              <Box
                sx={{
                  position: "relative",
                  width: 120,
                  height: 120,
                  cursor: "pointer",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "4px solid #D22B2B",
                  boxShadow: 3,
                  "&:hover": {
                    opacity: 0.8,
                  },
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleAvatarClick}
              >
                <Avatar
                  sx={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    transition: "opacity 0.3s ease",
                    ...(isHovered && {
                      opacity: 0.5,
                    }),
                  }}
                  src={imagePreview ? imagePreview : user.pfpURL || ""}
                  alt={`${loggedInUser.firstName} ${loggedInUser.lastName}`}
                />
                {isHovered && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: 18,
                    }}
                  >
                    <CameraAltIcon fontSize="large" />
                  </Box>
                )}
              </Box>
              <Typography
                variant="h4"
                sx={{
                  ml: 3,
                  fontWeight: 700,
                  color: "#333",
                }}
              >
                {loggedInUser.firstName} {loggedInUser.lastName}
              </Typography>
            </Box>

            <input
              type="file"
              id="imageUpload"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleImageChange} // Handle file selection
            />
            <Divider sx={{ mb: 3 }} />

            <Box component="form" onSubmit={formik.handleSubmit}>
              <Typography variant="h6" gutterBottom sx={{ color: "#555" }}>
                Basic Information
              </Typography>
              <Grid container spacing={3}>
                {
                  // Display salutations field only for customers and staff
                  loggedInUser.role != "Admin" && (
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        margin="dense"
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
                          formik.touched.salutations &&
                          formik.errors.salutations
                        }
                        variant="outlined"
                      />
                    </Grid>
                  )
                }
                <Grid item xs={12} sm={loggedInUser.role == "Admin" ? 6 : 4}>
                  <TextField
                    fullWidth
                    margin="dense"
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
                <Grid item xs={12} sm={loggedInUser.role == "Admin" ? 6 : 4}>
                  <TextField
                    fullWidth
                    margin="dense"
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
                    margin="dense"
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
                {loggedInUser.role != "Admin" && (
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      margin="dense"
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
                )}

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="dense"
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
                {loggedInUser.role != "Admin" && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      margin="dense"
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
                        formik.touched.mobileNumber &&
                        formik.errors.mobileNumber
                      }
                      variant="outlined"
                    />
                  </Grid>
                )}
              </Grid>

              {user.role === "Customer" && (
                <>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ mt: 4, color: "#555" }}
                  >
                    Residential Address
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Block No."
                        name="blockNo"
                        value={formik.values.blockNo}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.blockNo &&
                          Boolean(formik.errors.blockNo)
                        }
                        helperText={
                          formik.touched.blockNo && formik.errors.blockNo
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Unit No."
                        name="unitNo"
                        value={formik.values.unitNo}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.unitNo && Boolean(formik.errors.unitNo)
                        }
                        helperText={
                          formik.touched.unitNo && formik.errors.unitNo
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
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
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
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
                      />
                    </Grid>
                  </Grid>

                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ mt: 4, color: "#555" }}
                  >
                    Additional Information
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="ID Type"
                        name="idType"
                        value={formik.values.idType}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.idType && Boolean(formik.errors.idType)
                        }
                        helperText={
                          formik.touched.idType && formik.errors.idType
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="ID Number"
                        name="idNumber"
                        value={formik.values.idNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.idNumber &&
                          Boolean(formik.errors.idNumber)
                        }
                        helperText={
                          formik.touched.idNumber && formik.errors.idNumber
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Citizenship Status"
                        name="citizenshipStatus"
                        value={formik.values.citizenshipStatus}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.citizenshipStatus &&
                          Boolean(formik.errors.citizenshipStatus)
                        }
                        helperText={
                          formik.touched.citizenshipStatus &&
                          formik.errors.citizenshipStatus
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Race"
                        name="race"
                        value={formik.values.race}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.race && Boolean(formik.errors.race)
                        }
                        helperText={formik.touched.race && formik.errors.race}
                      />
                    </Grid>
                  </Grid>
                </>
              )}

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  width: "100%",
                  justifyContent: "right",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    mt: 4,
                    bgcolor: "#D22B2B", // Red color for save button
                    "&:hover": {
                      bgcolor: "#a61d1d", // Darker red for hover state
                    },
                  }}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    mt: 4,
                    color: "#D22B2B",
                    borderColor: "#D22B2B", // Red color for cancel button
                    "&:hover": {
                      bgcolor: "#fce7e7", // Light red for hover state
                      borderColor: "#a61d1d", // Darker red for border on hover
                    },
                  }}
                  onClick={() => navigate("/profile")} // Redirect to profile page on cancel
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default EditProfile;
