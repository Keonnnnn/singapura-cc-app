import React, { useEffect, useState, useContext } from 'react';
import http from '../http';
import { Container, List, ListItem, ListItemText, Typography, Paper, Divider, ListItemAvatar, Avatar, Box, IconButton, Tooltip } from '@mui/material';
import { Edit } from '@mui/icons-material';
import UserContext from '../contexts/UserContext';

const FeedbackList = () => {
    const { user } = useContext(UserContext);
    const [FeedbackList, setFeedbacklist] = useState([]);

    useEffect(() => {
        http.get('/feedback').then((res) => {
            console.log(res.data);
            setFeedbacklist(res.data);
        });
    }, []);

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: '12px' }}>
                <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
                    Feedback List
                </Typography>
                <List>
                    {FeedbackList.map(feedback => (
                        <React.Fragment key={feedback.id}>
                            <ListItem 
                                button 
                                component="a" 
                                href={`/feedback/${feedback.id}`} 
                                sx={{ mb: 2, backgroundColor: '#f5f5f5', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between' }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: '#b71c1c', color: '#fff' }}>
                                            {feedback.userId}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText 
                                        primary={
                                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                {feedback.content}
                                            </Typography>
                                        } 
                                        secondary={
                                            <Box component="span" sx={{ display: 'flex', flexDirection: 'column' }}>
                                                <Typography variant="body2" color="textSecondary">
                                                    User ID: {feedback.userId}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Rating: {feedback.eventId}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </Box>
                                {feedback.userId === user.id && (
                                    <Tooltip title="Edit Feedback">
                                        <IconButton color="primary" component="a" href={`/feedback/${feedback.id}`}>
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
            </Paper>
        </Container>
    );
};

export default FeedbackList;
