import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemText, Button, Box } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import http from '../http'; 

const AnnouncementList = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const { data } = await http.get('/announcements');
                setAnnouncements(data);
            } catch (err) {
                toast.error("Failed to fetch announcements");
                console.error(err);
            }
            setLoading(false);
        };

        fetchAnnouncements();
    }, []);

    const handleDelete = async (id) => {
        try {
            await http.delete(`/announcements/${id}`);
            setAnnouncements(announcements.filter((announcement) => announcement.id !== id));
            toast.success("Announcement deleted successfully");
        } catch (err) {
            toast.error("Failed to delete announcement");
            console.error(err);
        }
    };

    return (
        <Container maxWidth="md">            
        <ToastContainer />
            <Typography variant="h4" align="center" gutterBottom>
                Announcements
            </Typography>
            {loading ? (
                <Typography>Loading...</Typography>
            ) : (
                <List>
                    {announcements.map((announcement) => (
                        <ListItem key={announcement.id} divider>
                            <ListItemText
                                primary={announcement.title}
                                secondary={`Date: ${announcement.date} | Time: ${announcement.time} | Location: ${announcement.location}`}
                            />
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    component={Link}
                                    to={`/announcements/${announcement.id}`}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleDelete(announcement.id)}
                                >
                                    Delete
                                </Button>
                            </Box>
                        </ListItem>
                    ))}
                </List>
            )}

        </Container>
    );
};

export default AnnouncementList;
