import React, { useState, useContext } from 'react';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import UserContext from '../contexts/UserContext';
import http from '../http';

const AddNotification = () => {
    const { user } = useContext(UserContext);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [userId, setUserId] = useState(user.id || '');
    const [titleError, setTitleError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [userIdError, setUserIdError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset errors
        setTitleError('');
        setDescriptionError('');
        setUserIdError('');

        // Validation
        if (!title) {
            setTitleError('Please fill in this field');
        }
        if (!description) {
            setDescriptionError('Please fill in this field');
        }
        if (!userId) {
            setUserIdError('Please fill in this field');
        }
        if (!title || !description || !userId) {
            return;
        }

        try {
            const response = await http.post('/notificationEvents', {
                title,
                description,
                userId
            });

            if (response.status === 201) {
                alert('Notification created successfully');
                setTitle('');
                setDescription('');
                setUserId(user.id || '');
            }
        } catch (error) {
            console.error('Failed to create notification:', error);
            alert('Failed to create notification');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: '12px', width: '100%' }}>
                <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', color: '#000' }}>
                    Add Notification
                </Typography>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: '8px' }}>
                        <TextField
                            label="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            fullWidth
                            required
                            margin="normal"
                            error={!!titleError}
                            helperText={titleError}
                        />
                    </Box>
                    <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: '8px' }}>
                        <TextField
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                            required
                            multiline
                            rows={4}
                            margin="normal"
                            error={!!descriptionError}
                            helperText={descriptionError}
                        />
                    </Box>
                    <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: '8px' }}>
                        <TextField
                            label="User ID"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            fullWidth
                            required
                            margin="normal"
                            error={!!userIdError}
                            helperText={userIdError}
                            disabled
                        />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button type="submit" variant="contained" color="primary" sx={{ width: '50%' }}>
                            Create Notification
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default AddNotification;
