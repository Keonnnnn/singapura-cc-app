import React from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import http from "../http";
import { useFormik } from "formik";
import * as yup from "yup";
import moment from "moment";

const AnnouncementForm = () => {
  const navigate = useNavigate();
  var today = new Date();
  var year = today.getFullYear();
  var mes = today.getMonth() + 1;
  var dia = today.getDate();
  var fecha = dia + "-" + mes + "-" + year;
  const formik = useFormik({
    initialValues: {
      title: "",
      date: "",
      time: "",
      location: "",
    },
    validationSchema: yup.object({
      title: yup.string().trim().min(3).max(100).required("Title is required"),
      location: yup
        .string()
        .trim()
        .min(3)
        .max(100)
        .required("Location is required"),
    }),
    onSubmit: (data) => {
      data.title = data.title.trim();
      data.date = fecha;
      data.time = `${new Date().getHours()}:${new Date().getMinutes()}`;
      data.location = data.location.trim();

      http
        .post("/announcements", data)
        .then((res) => {
          console.log(res.data);
          toast.success("Announcement created successfully");
          navigate("/announcements");
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to create announcement");
        });
    },
  });

  return (
    <Container component={Paper} maxWidth="sm" sx={{ p: 4, mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Create Announcement
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit} noValidate>
        <TextField
          fullWidth
          id="title"
          name="title"
          label="Title"
          margin="normal"
          value={formik.values.title}
          onChange={formik.handleChange}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
        />
        
        <TextField
          fullWidth
          id="location"
          name="location"
          label="Location"
          margin="normal"
          value={formik.values.location}
          onChange={formik.handleChange}
          error={formik.touched.location && Boolean(formik.errors.location)}
          helperText={formik.touched.location && formik.errors.location}
        />
        <Button
          color="primary"
          variant="contained"
          fullWidth
          type="submit"
          sx={{ mt: 2 }}
        >
          Create Announcement
        </Button>
      </Box>
    </Container>
  );
};

export default AnnouncementForm;
