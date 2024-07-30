import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, TextField, MenuItem, Chip } from '@mui/material';
import http from '../http';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import * as yup from 'yup';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Link } from 'react-router-dom';
dayjs.extend(customParseFormat);

function CustomerEvents() {
    const [eventList, setEventList] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        http.get('/events').then((res) => {
            console.log(res.data);
            setEventList(res.data);
        });
    }, []);

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            organisation: "",
            eventTitle: "",
            eventType: "",
            eventDescription: "",
        },
        validationSchema: yup.object({
            firstName: yup.string().trim().required("First Name is required"),
            lastName: yup.string().trim().required("Last Name is required"),
            email: yup.string().trim().email("Invalid email format").required("Email is required"),
            organisation: yup.string().trim().required("Organisation is required"),
            eventTitle: yup.string().trim().required("Event Title is required"),
            eventType: yup.string().trim().required("Event Type is required"),
            eventDescription: yup.string().trim().required("Event Description is required"),
        }),
        onSubmit: (data, { resetForm }) => {
            console.log('Submitting data: ', data); // Logging the data being submitted
            setIsSubmitting(true);
            http.post('/events/eventrequests', data)
                .then((res) => {
                    alert('Program shared successfully!');
                    resetForm();
                })
                .catch((err) => {
                    console.error(err);
                    alert('Error sharing program.');
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        }
    });

    eventList.sort((a, b) => (a.date < b.date) ? 1 : -1);
    return (
        <Box sx={{ flexGrow: 1, p: 2 }}>
            <Typography variant="h4" sx={{ mt: 2, mb: 2, fontWeight: 'bold', textAlign: 'center', color: '#e2160f' }}>
                Events
            </Typography>

            <Grid container spacing={2}>
                {eventList.map((event, index) => (
                    <Grid item xs={12} key={index}>
                        <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                            <Box component="img" src={`${import.meta.env.VITE_FILE_BASE_URL}${event.imageFile}`} alt={event.name} sx={{ width: 240, height: 200, mr: 2, borderRadius: 1 }} />
                            <Box sx={{ flexGrow: 1, position: 'relative' }}>
                                <CardContent sx={{ p: 0 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        {dayjs(event.date).format('DD MMM')}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {dayjs(event.startTime, 'HH:mm').format('hh:mm A')} - {dayjs(event.endTime, 'HH:mm').format('hh:mm A')}
                                    </Typography>
                                    <Chip label={event.type} sx={{ mt: 1, mb: 1, bgcolor: 'primary.light', color: 'white' }} />
                                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        {event.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        {event.description}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Button variant="contained" color="primary" component={Link} to={`/register/${event.id}`} sx={{ mr: 2 }}>
                                            Register
                                        </Button>
                                    </Box>
                                    <Box sx={{ position: 'absolute', top: 0, right: 0, padding: '8px', backgroundColor: '#ff0000', color: '#fff', borderRadius: '4px', fontWeight: 'bold', fontSize:'small' }}>
                                        {event.points} points
                                    </Box>
                                </CardContent>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ mt: 4, borderRadius: 1, backgroundColor:"#EEEEEE" }}>
                <Typography>&nbsp;</Typography>
                <Typography variant="h5" sx={{ mb: 2, ml:6, mr:6}}>Share Your Program</Typography>
                <Typography variant="body1" sx={{ mb: 2 ,ml:6, mr:6}}>
                    Do you have an exciting sporting programme coming up that you’d like to share with us? Simply submit your event below, and we’ll carefully review it. Please keep in mind that all submissions are subject to approval by our Editorial Team.
                </Typography>
                <Box component="form" onSubmit={formik.handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mr:6, ml:6}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="First Name"
                                name="firstName"
                                value={formik.values.firstName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                helperText={formik.touched.firstName && formik.errors.firstName}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                name="lastName"
                                value={formik.values.lastName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                helperText={formik.touched.lastName && formik.errors.lastName}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Organisation"
                                name="organisation"
                                value={formik.values.organisation}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.organisation && Boolean(formik.errors.organisation)}
                                helperText={formik.touched.organisation && formik.errors.organisation}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Event Title"
                                name="eventTitle"
                                value={formik.values.eventTitle}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.eventTitle && Boolean(formik.errors.eventTitle)}
                                helperText={formik.touched.eventTitle && formik.errors.eventTitle}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                label="Type"
                                name="eventType"
                                value={formik.values.eventType}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.eventType && Boolean(formik.errors.eventType)}
                                helperText={formik.touched.eventType && formik.errors.eventType}
                            >
                                <MenuItem value="Volunteer Work">Volunteer Work</MenuItem>
                                <MenuItem value="Leisure">Leisure</MenuItem>
                                <MenuItem value="Sustainability">Sustainability</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                label="Event Description"
                                name="eventDescription"
                                value={formik.values.eventDescription}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.eventDescription && Boolean(formik.errors.eventDescription)}
                                helperText={formik.touched.eventDescription && formik.errors.eventDescription}
                            />
                        </Grid>
                        
                    </Grid>
                    <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                        Submit
                    </Button>
                </Box>
                <Typography>&nbsp;</Typography>
            </Box>
        </Box>
    );
}

export default CustomerEvents;