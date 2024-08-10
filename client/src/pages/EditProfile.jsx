import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import http from "../http";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  TextField,
  Button,
  Divider,
  Grid
} from "@mui/material";
import UserContext from "../contexts/UserContext";
import UserSidebar from "../components/UserSidebar";

const EditProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { user: loggedInUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const { id } = loggedInUser;

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

  const handleSave = async () => {
    try {
      await http.put(`/user/profile/${id}`, user);
      navigate("/profile");
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

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
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  border: "4px solid #D22B2B", // Red color for avatar border
                  boxShadow: 3,
                }}
                src={""}
                alt={`${loggedInUser.firstName} ${loggedInUser.lastName}`}
              />
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

            <Divider sx={{ mb: 3 }} />

            <Box>
              <Typography variant="h6" gutterBottom sx={{ color: "#555" }}>
                Basic Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Salutations"
                    name="salutations"
                    value={user.salutations || ""}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={user.firstName || ""}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={user.lastName || ""}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    value={user.dateOfBirth ? user.dateOfBirth.split("T")[0] : ""}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Gender"
                    name="gender"
                    value={user.gender || ""}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={user.email || ""}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mobile Number"
                    name="mobileNumber"
                    value={user.mobileNumber || ""}
                    onChange={handleChange}
                  />
                </Grid>
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
                        value={user.blockNo || ""}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Unit No."
                        name="unitNo"
                        value={user.unitNo || ""}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Street Name"
                        name="streetName"
                        value={user.streetName || ""}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Postal Code"
                        name="postalCode"
                        value={user.postalCode || ""}
                        onChange={handleChange}
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
                        value={user.idType || ""}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="ID Number"
                        name="idNumber"
                        value={user.idNumber || ""}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Citizenship Status"
                        name="citizenshipStatus"
                        value={user.citizenshipStatus || ""}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Race"
                        name="race"
                        value={user.race || ""}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>
                </>
              )}
            </Box>

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
                onClick={handleSave}
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

          </Paper>
        </>
      )}
    </Box>
  );
};

export default EditProfile;
