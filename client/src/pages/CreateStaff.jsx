import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, IconButton, Paper } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PhotoCamera, Close } from '@mui/icons-material';


function CreateStaff() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); 

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: ''
        },

        validationSchema: yup.object({
            firstName: yup.string().trim().min(2, 'First name must be at least 2 characters.').max(50, 'First name must be at most 50 characters').required('First name is required')
            .matches(/^[a-zA-Z '-,.]+$/, "First name only allow letters, spaces and characters: ' - , ."),
            lastName: yup.string().trim().min(2, 'Last name must be at least 2 characters').max(50, 'Last name must be at most 50 characters').required('Last name is required')
            .matches(/^[a-zA-Z '-,.]+$/, "Last name only allow letters, spaces and characters: ' - , ."),
            email: yup.string().trim().email('Enter a valid email').max(50, 'Email must be at most 50 characters').required('Email is required'),
            password: yup.string().trim().min(8, 'Password must be at least 8 characters').max(50, 'Password must be at most 50 characters').required('Password is required')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character."),
            confirmPassword: yup.string().trim().required('Confirm password is required').oneOf([yup.ref('password')], 'Passwords must match')
        }),
        onSubmit: (data) => {
            data.firstName = data.firstName.trim();
            data.lastName = data.lastName.trim();
            data.email = data.email.trim();
            data.password = data.password.trim();
            console.log(data)
            http.post('/user/register-staff', data)
                .then((res) => {
                    console.log(res);
                    console.log(res.data);
                    navigate('/users');
                })
                .catch(function (err) {
                    console.log(err)
                    toast.error(`${err.response.data.message}`);
                });

        }
    });

    return (
        <Box sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <Typography variant="h5" sx={{my: 2}}>Add Staff</Typography>
    
            <Box component="form" sx={{maxWidth: '500px'}} onSubmit={formik.handleSubmit}>
                <TextField fullWidth margin="dense" autoComplete="off" label="First Name" name="firstName" value={formik.values.firstName} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.firstName && Boolean(formik.errors.firstName)} helperText={formik.touched.firstName && formik.errors.firstName} />
    
                <TextField fullWidth margin="dense" autoComplete="off" label="Last Name" name="lastName" value={formik.values.lastName} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.lastName && Boolean(formik.errors.lastName)} helperText={formik.touched.lastName && formik.errors.lastName} />
    
                <TextField fullWidth margin="dense" autoComplete="off" label="Email" name="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.email && Boolean(formik.errors.email)} helperText={formik.touched.email && formik.errors.email} />
    
                <TextField fullWidth margin="dense" autoComplete="off" type="password" label="Password" name="password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.password && Boolean(formik.errors.password)} helperText={formik.touched.password && formik.errors.password} />
    
                <TextField fullWidth margin="dense" autoComplete="off" type="password" label="Confirm Password" name="confirmPassword" value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)} helperText={formik.touched.confirmPassword && formik.errors.confirmPassword} />
    
                <Button fullWidth variant="contained" type="submit" sx={{mt: 2}}>Add</Button>
    
                <ToastContainer />
            </Box>
    
        </Box>
      );

}

export default CreateStaff;