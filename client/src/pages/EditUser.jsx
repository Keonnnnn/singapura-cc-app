import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import http from '../http';
import { Box, Typography, TextField, Button, Grid, Paper, IconButton } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { PhotoCamera, Delete, Close } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditUser() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        http.get(`/user/${id}`).then((res) => {
            setUser(res.data);
            setLoading(false);
        });
    }, []);

    const formik = useFormik({
        initialValues: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
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
        }),
        onSubmit: async (values) => {
            try {
                const updatedUser = {
                    firstName: values.firstName.trim(),
                    lastName: values.lastName.trim(),
                    email: values.email.trim(),
                };

                const response = await http.put(`/user/${id}`, updatedUser);
                console.log(response.data); 
                navigate('/users'); 
            } catch (error) {
                console.error('Error updating user:', error);
                toast.error('Failed to update user');
            }
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
                        Edit User
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

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                            <Button variant="contained" type="submit" color="secondary" sx={{ borderRadius: '24px' }}>
                                Update
                            </Button>
                        </Box>
                    </Box>
                )}

                <ToastContainer />
            </Paper>
        </Box>
    );
}

export default EditUser;
