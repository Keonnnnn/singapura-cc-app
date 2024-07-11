import React from 'react'
import { Box, Typography, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { useNavigate } from 'react-router-dom';

function AddEvent() {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            date: "",
            time: "",
            venue: ""
        },
        validationSchema: yup.object({
            name: yup.string().trim().min(3).max(100).required(),
            description: yup.string().trim().min(3).max(500).required(),
            date: yup.date().required(),
            time: yup.string().trim().matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).required(),
            venue: yup.string().trim().min(3).max(100).required()
        }),

        onSubmit: (data) => {
            data.name = data.name.trim();
            data.description = data.description.trim();
            data.date = data.date.trim();
            data.time = data.time.trim();
            data.venue = data.venue.trim();
            http.post("/events", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/events");
                });
        }
    });

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Add Event
            </Typography>

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
                    name="date"
                    type="date"
                    value={formik.values.date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.date && Boolean(formik.errors.date)}
                    helperText={formik.touched.date && formik.errors.date} />

                <TextField
                    fullWidth margin="dense" autoComplete="off"
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
                        Add
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

export default AddEvent
