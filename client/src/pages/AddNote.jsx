import React from 'react';
import { Box, Typography, TextField, Button, Grid, IconButton, Paper } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../contexts/UserContext';
import { PhotoCamera, Close } from '@mui/icons-material';

function AddNote() {
    const navigate = useNavigate();
    // const { user } = useContext(UserContext);

    const formik = useFormik({
        initialValues: {
            title: "",
            description: ""
        },
        validationSchema: yup.object({
            title: yup.string().trim()
                .min(3, 'Title must be at least 3 characters.')
                .max(100, 'Title must be at most 100 characters.')
                .required('Title is required.'),
            description: yup.string().trim()
                .min(3, 'Description must be at least 3 characters.')
                .max(500, 'Description must be at most 500 characters.')
                .required('Description is required.')
        }),
        onSubmit: (data) => {
            data.title = data.title.trim();
            data.description = data.description.trim();
            http.post('/notes', data)
                .then((res) => {
                    console.log(res.data);
                    toast.success('Note created successfully');
                    navigate('/notes');
                })
                .catch((err) => {
                    console.error(err);
                    toast.error('Failed to create note');
                });
        }
    });

    const handleCancel = () => {
        navigate("/notes");
    };

    // Function to get the first initial from the first name
    const getInitials = (firstName) => {
        if (!firstName) return '';
        return firstName.charAt(0).toUpperCase();
    };

    // Function to generate random background color
    const getRandomColor = () => {
        const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Paper elevation={3} sx={{ p: 3, maxWidth: 600, width: '100%', position: 'relative', borderRadius: '12px' }}>
                <IconButton
                    color="secondary"
                    sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.8)', borderRadius: '50%' }}
                    onClick={handleCancel}>
                    <Close />
                </IconButton>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {/* <Box sx={{ width: '48px', height: '48px', overflow: 'hidden', borderRadius: '50%', marginRight: '12px', backgroundColor: getRandomColor(), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', color: '#ffffff' }}>
                        {getInitials(user?.firstName)}
                    </Box> */}
                    <Typography variant="h6" sx={{ flex: 1 }}>
                        Create a Note
                    </Typography>
                </Box>
                <Box component="form" onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        autoComplete="off"
                        label="Title"
                        name="title"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.title && Boolean(formik.errors.title)}
                        helperText={formik.touched.title && formik.errors.title}
                        variant="outlined"
                        InputProps={{ style: { borderRadius: '8px' } }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        autoComplete="off"
                        multiline
                        minRows={3}
                        label="What's on your mind?"
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        helperText={formik.touched.description && formik.errors.description}
                        variant="outlined"
                        InputProps={{ style: { borderRadius: '8px' } }}
                    />
                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" type="submit" color="secondary" fullWidth sx={{ borderRadius: '24px', '&:hover': { bgcolor: '#313131' } }}>
                            Add
                        </Button>
                    </Box>
                </Box>
                <ToastContainer />
            </Paper>
        </Box>
    );
}

export default AddNote;