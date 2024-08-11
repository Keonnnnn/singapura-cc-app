import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, IconButton, Chip } from '@mui/material';
import http from '../http';
import { AccessTime, Edit } from '@mui/icons-material';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Link } from 'react-router-dom';
dayjs.extend(customParseFormat);

function Events() {
    const [eventList, setEventList] = useState([]);
    
    useEffect(() => {
        http.get('/events').then((res) => {
            console.log(res.data);
            setEventList(res.data);
        });
    }, []);

    eventList.sort((a, b) => (a.date < b.date) ? 1 : -1);

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2, textAlign: 'center', color: "#e2160f", fontWeight: "bold" }}>
                Staff Management
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Link to="/addevent" style={{ textDecoration: 'none' }}>
                <Button variant='contained' sx={{ mb: 2 }}>
                    Add new event
                </Button>
            </Link>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
                {eventList.map((event, i) => (
                    <Grid item xs={12} md={6} lg={4} key={event.id}>
                        <Card sx={{ display: 'flex', flexDirection: 'column', p: 2}}>
                            <IconButton color="primary"
                                component={Link}
                                to={`/admin/edit-event/${event.id}`}
                                sx={{ alignSelf: 'flex-end' }}
                            >
                                <Edit />
                            </IconButton>
                            <Box component="img" src={`${import.meta.env.VITE_FILE_BASE_URL}${event.imageFile}`} alt={event.name} sx={{ width: 1, height: 200, mr: 2, borderRadius: 1 }} />
                            <CardContent sx={{ p: 0 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    {event.name}
                                </Typography>
                                <Chip label={event.type} color="primary" sx={{ mb: 1 }} />
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <AccessTime sx={{ mr: 1 }} />
                                    <Typography variant='subtitle2'>Happening on: &nbsp;</Typography>
                                    <Typography variant="subtitle2">
                                        {dayjs(event.date).format('DD MMM YYYY')}
                                    </Typography>
                                </Box>
                                
                                <Typography variant="body2">
                                    {dayjs(event.startTime, 'HH:mm').format('hh:mm A')} - {dayjs(event.endTime, 'HH:mm').format('hh:mm A')}
                                </Typography>
                                <Typography variant='subtitle2' sx={{ color: "text.secondary", mt: 2 }}>Details</Typography>
                                <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                    {event.description}
                                </Typography>
                                <Typography variant='subtitle2' sx={{ color: "text.secondary", mt: 2 }}>Venue</Typography>
                                <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                    {event.venue}
                                </Typography>
                                <Typography variant='subtitle2' sx={{ color: "text.secondary", mt: 2 }}>Points to be awarded</Typography>
                                <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                    {event.points}
                                </Typography>
                                <Link to={`/eventsregistrations/${event.id}`} style={{ textDecoration: 'none' }}>
                                    <Button variant='contained' color='secondary' sx={{ mt: 2 }}>
                                        View Registrations
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Typography>&nbsp;</Typography>
        </Box>
    );
}

export default Events;
