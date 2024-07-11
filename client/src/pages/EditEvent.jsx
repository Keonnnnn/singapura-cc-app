import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Box, Typography, TextField, Button } from '@mui/material';
import {
  Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions
} from '@mui/material';

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    venue: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http.get(`/events/${id}`).then((res) => {
      setEvent(res.data);
      setLoading(false);
    });
  }, []);

  const formik = useFormik({
    initialValues: event,
    enableReinitialize: true,
    validationSchema: yup.object({
      name: yup.string().trim().min(3).max(100).required(),
      description: yup.string().trim().min(3).max(500).required(),
      date: yup.date().required(),
      time: yup.string().trim().required(),
      venue: yup.string().trim().min(3).max(100).required()
    }),

    onSubmit: (data) => {
      data.name = data.name.trim();
      data.description = data.description.trim();
      data.date = data.date.trim();
      data.time = data.time.trim();
      data.venue = data.venue.trim();
      http.put(`/events/${id}`, data)
        .then((res) => {
          console.log(res.data);
          navigate("/events");
        });
    }
  });

  const deleteEvent = () => {
    http.delete(`/events/${id}`)
      .then((res) => {
        console.log(res.data);
        navigate("/events");
      }
      );
  }
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Edit Event
      </Typography>
      {
        !loading && (
          <Box component="form" onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth margin="dense" autoComplete="off"
              label="Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />

            <TextField
              fullWidth margin="dense" autoComplete="off"
              multiline minRows={2}
              label="Description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />

            <TextField
              fullWidth margin="dense" autoComplete="off"
              label="Date"
              name="date"
              type="date"
              value={formik.values.date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.date && Boolean(formik.errors.date)}
              helperText={formik.touched.date && formik.errors.date} />

            <TextField
              fullWidth margin="dense" autoComplete="off"
              label="Time"
              name="time"
              type="time"
              value={formik.values.time}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.time && Boolean(formik.errors.time)}
              helperText={formik.touched.time && formik.errors.time}
            />

            <TextField
              fullWidth margin="dense" autoComplete="off"
              multiline minRows={2}
              label="Venue"
              name="venue"
              value={formik.values.venue}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.venue && Boolean(formik.errors.venue)}
              helperText={formik.touched.venue && formik.errors.venue}
            />

            <Box sx={{ mt: 2 }}>
              <Button variant="contained" type="submit">
                Update
              </Button>
              <Button variant="contained" sx={{ ml: 2 }} color="error" onClick={handleOpen}>
                Delete
              </Button>

            </Box>
          </Box>
        )
      }
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Delete Event
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this event?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit"
            onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="error"
            onClick={deleteEvent}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EditEvent;
