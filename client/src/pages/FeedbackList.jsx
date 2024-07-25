import React, { useEffect, useState } from 'react';
import axios from 'axios';
import http from '../http'
import { Container, List, ListItem, ListItemText, Typography, Paper, Divider, ListItemAvatar, Avatar, Box } from '@mui/material';

const FeedbackList = () => {
    const [FeedbackList, setFeedbacklist] = useState([])
    useEffect(() => {
        http.get('/Feedback').then((res) => {
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
                                sx={{ mb: 2, backgroundColor: '#f5f5f5', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                            >
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
