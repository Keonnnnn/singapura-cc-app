import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import http from "../http";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Grid,
  Avatar,
  Divider,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import "react-toastify/dist/ReactToastify.css";

function ViewUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const options = { year: "numeric", month: "long", day: "numeric" };

  useEffect(() => {
    http.get(`/user/${id}`).then((res) => {
      setUser(res.data);
      setLoading(false);
    });
  }, [id]);

  const handleEdit = () => {
    navigate(`/admin/users/${id}/edit`); // Redirect to edit user page
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
            View User
          </Typography>
        </Box>

        <IconButton
          color="primary"
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            bgcolor: "white",
            borderRadius: "50%",
            boxShadow: 2,
            color: "#D22B2B",
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.9)",
            },
          }}
          onClick={handleEdit}
        >
          <Edit />
        </IconButton>

        {!loading && user && (
          <>
            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  border: "4px solid #D22B2B",
                  boxShadow: 3,
                }}
                src={user.pfpURL || ""}
                alt={`${user.firstName} ${user.lastName}`}
              />
              <Typography
                variant="h4"
                sx={{
                  ml: 3,
                  fontWeight: 700,
                  color: "#333",
                }}
              >
                {user.firstName} {user.lastName}
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box>
              <Typography variant="h6" gutterBottom sx={{ color: "#555" }}>
                Basic Information
              </Typography>
              <Grid container spacing={3}>
                {user.role !== "Admin" && (
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body1">
                      <strong>Salutations:</strong> {user.salutations}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={12} sm={user.role === "Admin" ? 6 : 4}>
                  <Typography variant="body1">
                    <strong>First Name:</strong> {user.firstName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={user.role === "Admin" ? 6 : 4}>
                  <Typography variant="body1">
                    <strong>Last Name:</strong> {user.lastName}
                  </Typography>
                </Grid>
                {user.role !== "Admin" && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1">
                        <strong>Date of Birth:</strong>{" "}
                        {new Date(user.dateOfBirth).toLocaleDateString(
                          "en-US",
                          options
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1">
                        <strong>Gender:</strong> {user.gender}
                      </Typography>
                    </Grid>
                  </>
                )}
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Email:</strong> {user.email}
                  </Typography>
                </Grid>
                {user.role !== "Admin" && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      <strong>Mobile Number:</strong> {user.mobileNumber}
                    </Typography>
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
                      <Typography variant="body1">
                        <strong>Block No.:</strong> {user.blockNo}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1">
                        <strong>Unit No.:</strong> {user.unitNo}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1">
                        <strong>Street Name:</strong> {user.streetName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1">
                        <strong>Postal Code:</strong> {user.postalCode}
                      </Typography>
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
                      <Typography variant="body1">
                        <strong>ID Type:</strong> {user.idType}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1">
                        <strong>ID Number:</strong> {user.idNumber}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1">
                        <strong>Citizenship Status:</strong>{" "}
                        {user.citizenshipStatus}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1">
                        <strong>Race:</strong> {user.race}
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              )}
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
}

export default ViewUser;
