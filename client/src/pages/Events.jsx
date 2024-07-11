import React, { useEffect, useState } from 'react'
import { Box, Typography, Grid, Card, CardContent, Button, IconButton } from '@mui/material';
import http from '../http';
import { AccessTime, Edit } from '@mui/icons-material';
import dayjs from 'dayjs';
import global from '../global';
import { Link } from 'react-router-dom';

function Events() {
    const [eventList, setEventList] = useState([])
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
                Explore Interest Groups
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Link to="/addevent" style={{ textDecoration: 'none' }}>
                <Button variant='contained'>
                    Add
                </Button>
            </Link>
            <Grid container spacing={2}>
                {
                    eventList.map((event, i) => {
                        return (
                            <Grid item xs={12} md={6} lg={4} key={event.id}>
                                <Card>
                                    <CardContent>
                                        <Typography variant='caption' sx={{color:"text.secondary"}}>Event Name</Typography>
                                        <Box sx={{ display: 'flex', mb: 0.5 }}>
                                            
                                            <Typography sx={{ flexGrow: 1, fontWeight:'bold'}}>
                                                {event.name}
                                            </Typography>
                                            <Link to={`/editevent/${event.id}`}>

                                                <IconButton color="primary" sx={{ padding: '4px' }}>
                                                    <Edit />
                                                </IconButton>
                                            </Link>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <AccessTime sx={{ mr: 1, fontsize:'xx-small' }} />
                                            <Typography variant='subtitle2'>Date of Event: &nbsp;</Typography>
                                            <Typography variant='subtitle2'>
                                                {dayjs(event.date).format(global.datetimeFormat)}
                                            </Typography>
                                        </Box>

                                        <Typography sx={{ color:"text.secondary" }} variant='subtitle2'>Details</Typography>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            {event.description}
                                        </Typography>

                                        <Typography sx={{ color:"text.secondary" }} variant='subtitle2'>Venue</Typography>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            {event.venue}
                                        </Typography>

                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })
                }
            </Grid>

        </Box>
    );
}

export default Events
