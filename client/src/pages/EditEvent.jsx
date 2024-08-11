import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import http from "../http";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Paper,
} from "@mui/material";
import moment from "moment";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [initialValues, setInitialValues] = useState({
    name: "",
    description: "",
    type: "",
    date: "",
    startTime: "",
    endTime: "",
    venue: "",
    points: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http.get(`/events/${id}`).then((res) => {
      setInitialValues(res.data);
      setImageFile(res.data.imageFile);
      setLoading(false);
    });
  }, [id]);

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
          toast.error("Failed to upload image");
        });
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
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
      data.date = moment(data.date).format("DD-MMM-YYYY");
      data.startTime = moment(data.startTime, "HH:mm").format("HH:mm");
      data.endTime = moment(data.endTime, "HH:mm").format("HH:mm");
      data.venue = data.venue.trim();
      data.points = parseInt(data.points);

      http
        .put(`/events/${id}`, data)
        .then((res) => {
          toast.success("Event updated successfully");
          navigate("/events");
        })
        .catch((err) => {
          toast.error("Failed to update event");
        });
    },
  });

  const [open, setOpen] = useState(false);
  const deleteEvent = () => {
    http.delete(`/events/${id}`).then((res) => {
      navigate("/events");
    });
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

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
          Edit Event
        </Typography>
        {!loading && (
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
              helperText={
                formik.touched.description && formik.errors.description
              }
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
              label="Date"
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
              error={
                formik.touched.startTime && Boolean(formik.errors.startTime)
              }
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
              multiline
              minRows={2}
              label="Points"
              name="points"
              value={formik.values.points}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.points && Boolean(formik.errors.points)}
              helperText={formik.touched.points && formik.errors.points}
            />

            <Box sx={{ mt: 2 }}>
              <Button variant="contained" component="label">
                Change Image
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
                Update
              </Button>

              <Button
                variant="contained"
                sx={{ ml: 2 }}
                color="error"
                onClick={handleOpen}
              >
                Delete
              </Button>
            </Box>
          </Box>
        )}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Delete Event</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this event?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="inherit" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={deleteEvent}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
}

export default EditEvent;
