import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Container,
  Paper,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../http";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddEvent() {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);

  const onFileChange = (e) => {
    let file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error("Maximum file size is 1MB");
        return;
      }

      let formData = new FormData();
      formData.append("file", file);

      http
        .post("/file/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          setImageFile(res.data.filename);
        })
        .catch(function (error) {
          console.error("Failed to upload image:", error);
          toast.error("Failed to upload image");
        });
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      type: "",
      date: "",
      startTime: "",
      endTime: "",
      venue: "",
      points: "",
    },

    validationSchema: yup.object({
      name: yup.string().trim().min(3).max(100).required(),
      description: yup.string().trim().min(3).max(500).required(),
      type: yup.string().required(),
      date: yup
        .date()
        .required()
        .min(new Date(), "Event date cannot be in the past"),
      startTime: yup.string().trim().required(),
      endTime: yup
        .string()
        .trim()
        .required()
        .test("is-greater", "End time should be greater", function (value) {
          const { startTime } = this.parent;
          return moment(value, "HH:mm").isAfter(moment(startTime, "HH:mm"));
        }),
      venue: yup.string().trim().min(3).max(100).required(),
      points: yup.number().min(100).max(1000).required(),
    }),

    onSubmit: (data) => {
      if (imageFile) {
        data.imageFile = imageFile;
      }
      data.name = data.name.trim();
      data.description = data.description.trim();
      data.type = data.type.trim();
      data.date = moment(data.date).format("DD-MMM-YYYY");
      data.startTime = moment(data.startTime, "HH:mm").format("HH:mm");
      data.endTime = moment(data.endTime, "HH:mm").format("HH:mm");
      data.venue = data.venue.trim();
      data.points = parseInt(data.points);
      http
        .post("/events", data)
        .then((res) => {
          console.log(res.data);
          toast.success("Event created successfully");
          navigate("/events");
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to create event");
        });
    },
  });

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Button
          variant="outlined"
          color="secondary"
          sx={{ display: "inline-block", float: "right" }}
          onClick={() => navigate("/events")}
        >
          Cancel
        </Button>

        <Typography variant="h5" sx={{ my: 2, textAlign: "center" }}>
          Add Event
        </Typography>

        <Box component="form" onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            margin="dense"
            autoComplete="off"
            label="Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />

          <TextField
            fullWidth
            margin="dense"
            autoComplete="off"
            multiline
            minRows={2}
            label="Description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
          />

          <FormControl fullWidth margin="dense">
            <InputLabel>Type</InputLabel>
            <Select
              name="type"
              label="Type of Event"
              value={formik.values.type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.type && Boolean(formik.errors.type)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="Workshop">Workshop</MenuItem>
              <MenuItem value="Leisure">Leisure</MenuItem>
              <MenuItem value="Volunteer Work">Volunteer Work</MenuItem>
            </Select>
            {formik.touched.type && formik.errors.type ? (
              <Typography color="error" variant="caption">
                {formik.errors.type}
              </Typography>
            ) : null}
          </FormControl>

          <TextField
            fullWidth
            margin="dense"
            autoComplete="off"
            name="date"
            type="date"
            value={formik.values.date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.date && Boolean(formik.errors.date)}
            helperText={formik.touched.date && formik.errors.date}
          />

          <Typography variant="caption">Start Time</Typography>
          <TextField
            fullWidth
            margin="dense"
            autoComplete="off"
            name="startTime"
            type="time"
            value={formik.values.startTime}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.startTime && Boolean(formik.errors.startTime)}
            helperText={formik.touched.startTime && formik.errors.startTime}
          />

          <Typography variant="caption">End Time</Typography>
          <TextField
            fullWidth
            margin="dense"
            autoComplete="off"
            name="endTime"
            type="time"
            value={formik.values.endTime}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.endTime && Boolean(formik.errors.endTime)}
            helperText={formik.touched.endTime && formik.errors.endTime}
          />

          <TextField
            fullWidth
            margin="dense"
            autoComplete="off"
            multiline
            minRows={2}
            label="Venue"
            name="venue"
            value={formik.values.venue}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.venue && Boolean(formik.errors.venue)}
            helperText={formik.touched.venue && formik.errors.venue}
          />

          <TextField
            fullWidth
            margin="dense"
            autoComplete="off"
            label="Points"
            name="points"
            type="number"
            value={formik.values.points}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.points && Boolean(formik.errors.points)}
            helperText={formik.touched.points && formik.errors.points}
          />

          <Box sx={{ mt: 2 }}>
            <Button variant="contained" component="label">
              Upload Image
              <input
                hidden
                accept="image/*"
                multiple
                type="file"
                onChange={onFileChange}
              />
            </Button>
            {imageFile && (
              <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                <img
                  alt="tutorial"
                  src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}
                ></img>
              </Box>
            )}
          </Box>

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Button variant="contained" type="submit">
              Add
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default AddEvent;
