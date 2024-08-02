import React, { useEffect, useState, useContext } from 'react';
import http from '../http';
import { Container, List, ListItem, ListItemText, Typography, Paper, Divider, ListItemAvatar, Avatar, Box, IconButton, Tooltip, Badge } from '@mui/material';
import { Edit, Notifications, PushPin, Delete } from '@mui/icons-material';
import UserContext from '../contexts/UserContext';

const NotificationList = () => {
    const { user } = useContext(UserContext);
    const [notifications, setNotifications] = useState([]);
    const [pinnedNotificationId, setPinnedNotificationId] = useState(null);

    useEffect(() => {
        http.get('/notificationEvents') // Ensure this matches the endpoint
            .then((res) => {
                console.log('Response data:', res.data); // Log response data
                setNotifications(res.data);
            })
            .catch((error) => {
                console.error('Failed to fetch notifications:', error);
            });
    }, []);

    const handlePin = (e, notificationId) => {
        e.stopPropagation(); // Prevent navigating to the notification detail
        setPinnedNotificationId(pinnedNotificationId === notificationId ? null : notificationId);
    };

    const handleDismiss = (id) => {
        setNotifications(notifications.map(notification =>
            notification.id === id ? { ...notification, dismissed: !notification.dismissed } : notification
        ));
    };

    const renderNotifications = () => {
        let sortedNotifications = notifications.slice();

        // Move pinned notification to the top
        if (pinnedNotificationId) {
            const pinnedNotification = sortedNotifications.find(notification => notification.id === pinnedNotificationId);
            sortedNotifications = sortedNotifications.filter(notification => notification.id !== pinnedNotificationId);
            sortedNotifications.unshift(pinnedNotification);
        }

        // Move dismissed notifications to the bottom
        sortedNotifications = sortedNotifications.sort((a, b) => {
            if (a.dismissed === b.dismissed) {
                return 0;
            }
            return a.dismissed ? 1 : -1;
        });

        return sortedNotifications.map(notification => (
            <React.Fragment key={notification.id}>
                <ListItem 
                    sx={{ 
                        mb: 2, 
                        backgroundColor: pinnedNotificationId === notification.id ? '#e0f7fa' : '#f9f9f9', 
                        borderRadius: '8px', 
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
                        display: 'flex', 
                        justifyContent: 'space-between' 
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ListItemAvatar>
                            <Tooltip title="View Notification">
                                <IconButton component="a" href={`/notifications/${notification.id}`}>
                                    <Avatar sx={{ bgcolor: '#b71c1c', color: notification.dismissed ? '#fff' : '#ffeb3b' }}>
                                        <Notifications />
                                    </Avatar>
                                </IconButton>
                            </Tooltip>
                        </ListItemAvatar>
                        <ListItemText 
                            primary={
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    {notification.title}
                                </Typography>
                            } 
                            secondary={
                                <Box component="span" sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                        {notification.description}
                                    </Typography>
                                </Box>
                            }
                        />
                    </Box>
                    <Box>
                        {user.id === 1 && (
                            <Tooltip title="Edit Notification">
                                <IconButton color="primary" component="a" href={`/notifications/${notification.id}`}>
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                        )}
                        <Tooltip title="Pin Notification">
                            <IconButton 
                                onClick={(e) => handlePin(e, notification.id)}
                                sx={{ color: pinnedNotificationId === notification.id ? '#ffeb3b' : 'inherit' }}
                            >
                                <PushPin />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Dismiss Notification">
                            <IconButton color="secondary" onClick={() => handleDismiss(notification.id)}>
                                <Delete />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </ListItem>
                <Divider />
            </React.Fragment>
        ));
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: '12px', position: 'relative' }}>
                <Badge
                    badgeContent={notifications.length}
                    color="primary"
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    sx={{ position: 'absolute', top: 16, right: 16 }}
                >
                    <Notifications color="action" />
                </Badge>
                <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: '#000' }}>
                    Notifications
                </Typography>
                {notifications.length === 0 ? (
                    <Typography align="center" sx={{ color: '#757575' }}>No notifications available</Typography>
                ) : (
                    <List>
                        {renderNotifications()}
                    </List>
                )}
            </Paper>
        </Container>
    );
};

export default NotificationList;



