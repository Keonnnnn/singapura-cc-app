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
import { Close, ArrowBack, Edit } from "@mui/icons-material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ViewUser() {
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

  useEffect(() => {
    http.get(`/user/${id}`).then((res) => {
      setUser({
        ...res.data,
        password: "**********",
      });
      setLoading(false);
    });
  }, [id]);

  const [loading, setLoading] = useState(true);
  const options = { year: "numeric", month: "long", day: "numeric" };
  const handleEdit = () => {
    navigate(`/admin/users/${id}/edit`); // Redirect to edit user page
  };

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
          <Typography variant="h5" sx={{ flex: 1 }}>
            View User
          </Typography>
          <IconButton
            color="secondary"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "rgba(255,255,255,0.8)",
              borderRadius: "25%",
              gap: 1,
            }}
            onClick={handleEdit}
          >
            <Edit />
            <Typography>Edit</Typography>
          </IconButton>
        </Box>

        {!loading && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="body1">
                  <strong>Salutations:</strong> {user.salutations}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body1">
                  <strong>First Name:</strong> {user.firstName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body1">
                  <strong>Last Name:</strong> {user.lastName}
                </Typography>
              </Grid>
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
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Email:</strong> {user.email}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Mobile Number:</strong> {user.mobileNumber}
                </Typography>
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Residential Address
            </Typography>
            <Grid container spacing={2}>
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

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Additional Information
            </Typography>
            <Grid container spacing={2}>
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
                  <strong>Citizenship Status:</strong> {user.citizenshipStatus}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Race:</strong> {user.race}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}

        <ToastContainer />
      </Paper>
    </Box>
  );
}

export default ViewUser;
