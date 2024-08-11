import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import moment from 'moment';
import {
    TextField,
    Button,
    Container,
    Typography,
    Box,
    Paper,
} from "@mui/material";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AnnouncementDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState({
        title: "",
        date: "",
        time: "",
        location: ""
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        http.get(`/announcements/${id}`).then((res) => {
            setInitialValues(res.data);
            setLoading(false);
        }).catch(err => {
            console.error('Failed to fetch announcement:', err);
            toast.error('Failed to fetch announcement details');
            setLoading(false);
        });
    }, [id]);

    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema: yup.object({
            title: yup.string().trim().min(3).max(100).required('Title is required'),
            date: yup.date().required('Date is required'),
            time: yup.string().trim().required('Time is required'),
            location: yup.string().trim().min(3).max(100).required('Location is required')
        }),
        onSubmit: (data) => {
            data.title = data.title.trim();
            data.date = moment(data.date).format('DD-MMM-YYYY');
            data.time = moment(data.time, 'HH:mm').format('HH:mm');
            data.location = data.location.trim();

            http.put(`/announcements/${id}`, data)
                .then((res) => {
                    console.log(res.data);
                    toast.success('Announcement updated successfully');
                    navigate('/announcements');
                })
                .catch((err) => {
                    console.error(err);
                    toast.error('Failed to update announcement');
                });
        }
    });

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container component={Paper} maxWidth="sm" sx={{ p: 4, mt: 5 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Edit Announcement
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
                    id="date"
                    name="date"
                    label="Date"
                    type="date"
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={formik.values.date}
                    onChange={formik.handleChange}
                    error={formik.touched.date && Boolean(formik.errors.date)}
                    helperText={formik.touched.date && formik.errors.date}
                />
                <TextField
                    fullWidth
                    id="time"
                    name="time"
                    label="Time"
                    type="time"
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={formik.values.time}
                    onChange={formik.handleChange}
                    error={formik.touched.time && Boolean(formik.errors.time)}
                    helperText={formik.touched.time && formik.errors.time}
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
                    Update Announcement
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    sx={{ mt: 2 }}
                    component={Link}
                    to="/announcements"
                >
                    Cancel
                </Button>
            </Box>
        </Container>
    );
};

export default AnnouncementDetail;
