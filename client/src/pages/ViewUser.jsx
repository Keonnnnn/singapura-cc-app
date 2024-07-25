import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import http from '../http';
import { Box, Typography, TextField, Button, Paper, IconButton } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Close } from '@mui/icons-material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ViewUser() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        http.get(`/user/${id}`).then((res) => {
            setUser(res.data);
            setLoading(false);
        }).catch(err => {
            console.error("Error fetching user:", err);
            if (err.response && err.response.status === 404) {
                navigate('/users'); // Redirect to users list if user is not found
            }
        });
    }, [id, navigate]);

    const formik = useFormik({
        initialValues: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
        },
        enableReinitialize: true,
        validationSchema: yup.object({
            firstName: yup.string().trim().min(2).max(50)
                .matches(/^[a-zA-Z '-,.]+$/, "First name only allows letters, spaces and characters: ' - , .")
                .required('First name is required.'),
            lastName: yup.string().trim().min(2).max(50)
                .matches(/^[a-zA-Z '-,.]+$/, "Last name only allows letters, spaces and characters: ' - , .")
                .required('Last name is required.'),
            email: yup.string().trim().lowercase().email().max(50).required('Email is required.'),
            username: yup.string().trim().min(1).max(50)
                .matches(/^[a-zA-Z0-9_.-]+$/, "Username only allows letters, numbers, underscores, periods, and hyphens."),
        }),
        onSubmit: async (values) => {
            navigate(`/users/${id}/edit`); // Redirect to edit user page
        },
    });

    const handleCancel = () => {
        navigate('/users'); // Redirect to users list
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Paper elevation={3} sx={{ p: 3, maxWidth: 600, width: '100%', position: 'relative', borderRadius: '12px' }}>
                <IconButton
                    color="secondary"
                    sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.8)', borderRadius: '50%' }}
                    onClick={handleCancel}
                >
                    <Close />
                </IconButton>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" sx={{ flex: 1 }}>
                        View User
                    </Typography>
                </Box>

                {!loading && (
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="First Name"
                            name="firstName"
                            value={formik.values.firstName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                            helperText={formik.touched.firstName && formik.errors.firstName}
                            variant="outlined"
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Last Name"
                            name="lastName"
                            value={formik.values.lastName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                            helperText={formik.touched.lastName && formik.errors.lastName}
                            variant="outlined"
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            variant="outlined"
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Username"
                            name="username"
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.username && Boolean(formik.errors.username)}
                            helperText={formik.touched.username && formik.errors.username}
                            variant="outlined"
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                            <Button variant="contained" type="submit" color="secondary" sx={{ borderRadius: '24px' }}>
                                Edit
                            </Button>
                        </Box>
                    </Box>
                )}

                <ToastContainer />
            </Paper>
        </Box>
    );
}

export default ViewUser;
