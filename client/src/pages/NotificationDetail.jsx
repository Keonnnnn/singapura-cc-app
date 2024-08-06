import React, { useEffect, useState, useContext } from 'react';
import http from '../http';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, TextField, Box, Paper, IconButton, CircularProgress } from '@mui/material';
import UserContext from '../contexts/UserContext';
import { ArrowBack } from '@mui/icons-material';

const NotificationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [notification, setNotification] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotification = async () => {
            try {
                const res = await http.get(`/notificationEvents/${id}`);
                setNotification(res.data);
                setTitle(res.data.title);
                setDescription(res.data.description);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch notification:', error);
                setLoading(false);
            }
        };

        fetchNotification();
    }, [id]);

    const handleUpdate = async () => {
        try {
            const response = await http.put(`/notificationEvents/${id}`, {
                title,
                description
            });

            if (response.status === 200) {
                alert('Notification updated successfully');
                navigate('/admin/notifications');
            } else {
                alert('Failed to update notification');
            }
        } catch (error) {
            console.error('Failed to update notification:', error);
            alert('Failed to update notification');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this notification?')) {
            try {
                const response = await http.delete(`/notificationEvents/${id}`);

                if (response.status === 200) {
                    alert('Notification deleted successfully');
                    navigate('/admin/notifications');
                } else {
                    alert('Failed to delete notification');
                }
            } catch (error) {
                console.error('Failed to delete notification:', error);
                alert('Failed to delete notification');
            }
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!notification) {
        return (
            <Typography align="center" sx={{ mt: 4, color: '#757575' }}>
                Notification not found
            </Typography>
        );
    }

    const isAdmin = user.id === 1;

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: '12px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <IconButton onClick={() => navigate(isAdmin ? '/admin/notifications' : '/notifications')}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h4" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 'bold' }}>
                        {isAdmin ? 'Edit Notification' : 'Notification Details'}
                    </Typography>
                </Box>
                <TextField
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    required
                    margin="normal"
                    disabled={!isAdmin}
                />
                <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    required
                    multiline
                    rows={4}
                    margin="normal"
                    disabled={!isAdmin}
                />
                {isAdmin && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                        <Button variant="contained" color="primary" onClick={handleUpdate}>
                            Update Notification
                        </Button>
                        <Button variant="contained" color="secondary" onClick={handleDelete}>
                            Delete Notification
                        </Button>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default NotificationDetail;
