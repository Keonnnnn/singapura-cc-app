import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Chip, Container } from '@mui/material';
import http from '../http';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

function CustomerEvents() {
    const [eventList, setEventList] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        http.get('/events').then((res) => {
            console.log(res.data);
            setEventList(res.data);
        });
    }, []);

    const handleRegister = (eventId) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
        } else {
            setIsSubmitting(true);
            http.post(`/events/${eventId}/register`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then((res) => {
                alert("You've successfully registered for the event!");
                // Optionally update the UI or eventList here to reflect the registration
            })
            .catch((err) => {
                if (err.response && err.response.data && err.response.data.error) {
                    if (err.response.data.error === 'User already registered for this event') {
                        alert("You are already registered for this event.");
                    } else {
                        alert(err.response.data.error);
                    }
                } else {
                    console.error('Failed to register:', err);
                    alert("An error occurred while registering. Please try again.");
                }
            })
            .finally(() => {
                setIsSubmitting(false);
            });
        }
    };

    eventList.sort((a, b) => (a.date < b.date) ? 1 : -1);

    return (
        <Container sx={{ flexGrow: 1, py: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', color: '#e2160f', mb: 4 }}>
                Events
            </Typography>
            <Grid container spacing={4}>
                {eventList.map((event, index) => (
                    <Grid item xs={12} md={12} key={index}>
                        <Card sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 2 }}>
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
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            onClick={() => handleRegister(event.id)} 
                                            sx={{ mr: 2 }}
                                            disabled={isSubmitting}
                                        >
                                            Register
                                        </Button> 
                                    </Box>
                                    <Typography sx={{mt:2}} variant="body2" color="text.secondary">Only members can register. Walk-ins are available for non-members.</Typography>
                                    <Box sx={{ position: 'absolute', top: 0, right: 0, padding: '8px', backgroundColor: '#ff0000', color: '#fff', borderRadius: '4px', fontWeight: 'bold', fontSize: 'small' }}>
                                        + {event.points} points
                                    </Box>
                                </CardContent>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default CustomerEvents;
