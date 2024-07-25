import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, TextField, Box, Paper, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import http from '../http';
import { useContext } from 'react';
import UserContext from '../contexts/UserContext';

const FeedbackDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [feedback, setFeedback] = useState(null);
    const [userId, setUserId] = useState('');
    const [eventId, setEventId] = useState('');
    const [content, setContent] = useState('');
    const [response, setResponse] = useState('');
    const [image, setImage] = useState('');

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const res = await http.get(`/feedback/${id}`);
                setFeedback(res.data);
                setUserId(res.data.userId);
                setEventId(res.data.eventId);
                setContent(res.data.content);
                setResponse(res.data.response || '');
                setImage(res.data.image);
            } catch (error) {
                console.error('Failed to fetch feedback:', error);
            }
        };

        fetchFeedback();
    }, [id]);

    const handleUpdate = async () => {
        try {
            await http.put(`/feedback/${id}`, {
                userId,
                eventId,
                content,
                response
            });
            alert('Feedback updated successfully');
            navigate('/feedbacklist', { replace: true });
        } catch (error) {
            console.error('Failed to update feedback:', error);
            alert('Failed to update feedback');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this feedback?')) {
            try {
                await http.delete(`/feedback/${id}`);
                alert('Feedback deleted successfully');
                navigate('/feedbacklist', { replace: true });
            } catch (error) {
                console.error('Failed to delete feedback:', error);
                alert('Failed to delete feedback');
            }
        }
    };

    if (!feedback) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
            <Paper elevation={3} sx={{ padding: '20px', maxWidth: '600px', width: '100%', position: 'relative', borderRadius: '12px' }}>
                <IconButton
                    color="secondary"
                    sx={{ position: 'absolute', top: '8px', right: '8px', bgcolor: 'rgba(255,255,255,0.8)', borderRadius: '50%' }}
                    onClick={() => navigate('/feedbacklist')}
                >
                    <Close />
                </IconButton>
                <Typography variant="h5" gutterBottom>
                    Feedback Detail
                </Typography>
                <form>
                    <TextField
                        label="User ID"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        fullWidth
                        required
                        variant="outlined"
                        margin="normal"
                        disabled
                    />
                    <TextField
                        label="Rating"
                        value={eventId}
                        onChange={(e) => setEventId(e.target.value)}
                        fullWidth
                        required
                        variant="outlined"
                        margin="normal"
                        disabled={userId !== user.id}
                    />
                    <TextField
                        label="Feedback"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        fullWidth
                        required
                        multiline
                        rows={4}
                        variant="outlined"
                        margin="normal"
                        disabled={userId !== user.id}
                    />
                    <TextField
                        label="Response (reason for changing feedback)"
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        margin="normal"
                        disabled={userId !== user.id}
                    />
                    {image && (
                        <Box sx={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                            <img src={`http://localhost:5000/uploads/${image}`} alt="feedback" style={{ maxWidth: '100%', borderRadius: '8px' }} />
                        </Box>
                    )}
                    {userId === user.id && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                            <Button variant="contained" color="primary" onClick={handleUpdate}>
                                Update Feedback
                            </Button>
                            <Button variant="contained" color="secondary" onClick={handleDelete}>
                                Delete Feedback
                            </Button>
                        </Box>
                    )}
                </form>
            </Paper>
        </Box>
    );
};

export default FeedbackDetail;
