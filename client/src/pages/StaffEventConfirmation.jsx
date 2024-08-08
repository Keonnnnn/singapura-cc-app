import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, Paper, List, ListItem, ListItemText, Grid } from '@mui/material';
import http from '../http'; 
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CSVLink } from "react-csv";

function StaffEventConfirmation() {
    const { id: eventId } = useParams();
    const navigate = useNavigate();
    const [registrations, setRegistrations] = useState([]);
    const [eventName, setEventName] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const eventResponse = await http.get(`/events/${eventId}`);
                setEventName(eventResponse.data.name);
            } catch (error) {
                console.error("Failed to fetch event details", error);
                toast.error("Failed to fetch event details");
            }
        };

        const fetchRegistrations = async () => {
            try {
                const registrationResponse = await http.get(`/events/${eventId}/registrations`);
                setRegistrations(registrationResponse.data);
            } catch (error) {
                console.error("Failed to fetch registrations", error);
                toast.error("Failed to fetch registrations");
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetails();
        fetchRegistrations();
    }, [eventId]);

    const markAsPresent = (userId) => {
        http.post(`/events/${eventId}/mark-present`, { userId }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}` 
            }
        })
        .then((res) => {
            toast.success(res.data.message);
            setRegistrations(registrations.map(reg => reg.userId === userId ? { ...reg, present: true } : reg));
        })
        .catch((err) => {
            console.error("Failed to mark user as present", err);
            if (err.response && err.response.data && err.response.data.error) {
                toast.error(err.response.data.error);
            } else {
                toast.error("An error occurred while marking user as present. Please try again.");
            }
        });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const headers = [
        { label: "Name", key: "name" },
        { label: "Email", key: "email" },
        { label: "Present", key: "present" },
    ];

    const csvData = registrations.map(reg => ({
        name: reg.name,
        email: reg.email,
        present: reg.present ? "Yes" : "No"
    }));

    const fileName = `${eventName.replace(/ /g, "_")}_registrations.csv`;

    return (
        <Container component={Paper} sx={{ p: 4, mt: 4 }}>
            <ToastContainer />
            <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
                Event Registrations
            </Typography>
            <List>
                {registrations.map(registration => (
                    <ListItem key={registration.userId} sx={{ mb: 2, borderBottom: '1px solid #ddd' }}>
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={8}>
                                <ListItemText 
                                    primary={<Typography variant="h6">{registration.name}</Typography>}
                                    secondary={<Typography variant="body2">{registration.email}</Typography>}
                                />
                                <Typography variant="body2" color={registration.present ? 'green' : 'red'}>
                                    {registration.present ? "Present" : "Absent"}
                                </Typography>
                            </Grid>
                            <Grid item xs={4} textAlign="right">
                                {!registration.present && (
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        onClick={() => markAsPresent(registration.userId)}
                                    >
                                        Mark as Present
                                    </Button>
                                )}
                            </Grid>
                        </Grid>
                    </ListItem>
                ))}
            </List>
            <Box textAlign="center" sx={{ mt: 4 }}>
                <Button 
                    variant="outlined" 
                    onClick={() => navigate('/events')}
                    sx={{ mr: 2 }}
                >
                    Back to Events
                </Button>
                <CSVLink data={csvData} headers={headers} filename={fileName}>
                    <Button variant="contained" color="secondary">
                        Export to CSV
                    </Button>
                </CSVLink>
            </Box>
        </Container>
    );
}

export default StaffEventConfirmation;
