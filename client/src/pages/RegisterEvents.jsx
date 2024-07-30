import React from 'react';
import { Box, Typography, TextField, Button, Container, Paper } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http'; // Assuming you have a http.js for Axios instance
import { useNavigate, useParams } from 'react-router-dom';

function RegisterEvent() {
    const { id: eventId } = useParams();
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            contact: ""
        },
        validationSchema: yup.object({
            name: yup.string().trim().min(3).max(100).required("Name is required"),
            email: yup.string().trim().email("Invalid email format").required("Email is required"),
            contact: yup.string().trim().min(8, "Contact number is too short").max(15, "Contact number is too long").required("Contact is required")
        }),
        onSubmit: (data) => {
            http.post(`/events/${eventId}/register`, data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/customer-events");
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    });

    return (
        <Container component={Paper} sx={{ p: 4, mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
                Register for Event
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth
                    margin="dense"
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
                    label="Email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    label="Contact"
                    name="contact"
                    value={formik.values.contact}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.contact && Boolean(formik.errors.contact)}
                    helperText={formik.touched.contact && formik.errors.contact}
                />
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" color="primary" type="submit">
                        Register
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default RegisterEvent;
