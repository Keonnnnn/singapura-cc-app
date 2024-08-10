import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Box, Typography, Card, Avatar, Divider, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, DialogContentText } from '@mui/material';
import { ArrowBack, Edit, Save, Delete, Close, PersonAdd, PersonRemove } from '@mui/icons-material';
import http from '../http';
import UserContext from '../contexts/UserContext';
import dayjs from 'dayjs';
import global from '../global';

function PostProfile() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { user, setUser, darkMode } = useContext(UserContext);
    const [profileUser, setProfileUser] = useState(null);
    const [postList, setPostList] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false); // State for delete confirmation dialog

    useEffect(() => {
        if (userId) {
            fetchUserProfile(userId);
            fetchUserPosts(userId);
            fetchFollowers(userId);
            fetchFollowing(userId);
            checkIfFollowing(userId);
        }
    }, [userId, isFollowing]);

    const fetchUserProfile = async (id) => {
        try {
            const res = await http.get(`/user/${id}`);
            setProfileUser(res.data);
            setNewUsername(res.data.username || '');
            setNewDescription(res.data.profileDescription || '');
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };

    const fetchUserPosts = async (id) => {
        try {
            const res = await http.get(`/post?userId=${id}`);
            setPostList(res.data);
        } catch (error) {
            console.error("Error fetching user posts:", error);
        }
    };

    const fetchFollowers = async (id) => {
        try {
            const res = await http.get(`/user/${id}/followers`);
            setFollowers(res.data);
        } catch (error) {
            console.error("Error fetching followers:", error);
        }
    };

    const fetchFollowing = async (id) => {
        try {
            const res = await http.get(`/user/${id}/following`);
            setFollowing(res.data);
        } catch (error) {
            console.error("Error fetching following:", error);
        }
    };

    const checkIfFollowing = async (id) => {
        try {
            const res = await http.get(`/user/${user.id}/following`);
            const followingIds = res.data.map(user => user.id);
            setIsFollowing(followingIds.includes(parseInt(id)));
        } catch (error) {
            console.error("Error checking following status:", error);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        http.put(`/user/${profileUser.id}`, { username: newUsername, profileDescription: newDescription })
            .then((res) => {
                setProfileUser(res.data);
                setUser(res.data); // Update user context if the logged-in user is editing their own profile
                setIsEditing(false);
            })
            .catch((error) => {
                console.error("Failed to update profile:", error);
            });
    };

    const handleOpen = (post) => {
        setSelectedPost(post);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedPost(null);
    };

    const handleDeleteConfirmOpen = () => {
        setDeleteConfirmOpen(true);
    };

    const handleDeleteConfirmClose = () => {
        setDeleteConfirmOpen(false);
    };

    const deletePost = () => {
        http.delete(`/post/${selectedPost.id}`)
            .then((res) => {
                fetchUserPosts(userId);
                handleClose();
                handleDeleteConfirmClose(); // Close the delete confirmation dialog
            })
            .catch((error) => {
                console.error("Failed to delete post:", error);
            });
    };

    const handleFollow = () => {
        http.post(`/user/${profileUser.id}/follow`)
            .then(() => {
                setIsFollowing(true);
                fetchFollowers(profileUser.id);
            })
            .catch((error) => {
                console.error("Failed to follow user:", error);
            });
    };

    const handleUnfollow = () => {
        http.delete(`/user/${profileUser.id}/unfollow`)
            .then(() => {
                setIsFollowing(false);
                fetchFollowers(profileUser.id);
            })
            .catch((error) => {
                console.error("Failed to unfollow user:", error);
            });
    };

    return (
        <Box sx={{ padding: 3, backgroundColor: darkMode ? '#000000' : '#f5f5f5', minHeight: '100vh' }}>
            <Button 
                startIcon={<ArrowBack />} 
                onClick={() => navigate(-1)} 
                variant="outlined" 
                sx={{
                    mb: 3,
                    borderRadius: '12px',
                    color: darkMode ? '#BB86FC' : '#c62828',
                    borderColor: darkMode ? '#BB86FC' : '#c62828',
                    '&:hover': {
                        backgroundColor: darkMode ? '#BB86FC' : '#c62828',
                        color: darkMode ? '#000000' : '#ffffff',
                    }
                }}
            >
                Back
            </Button>
            {profileUser && (
                <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '600px', margin: '0 auto' }}>
                    <Avatar sx={{ bgcolor: darkMode ? '#BB86FC' : '#c62828', width: 120, height: 120, mb: 2 }}>
                        {profileUser.firstName.charAt(0).toUpperCase()}
                    </Avatar>
                    {isEditing ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3 }}>
                            <TextField
                                variant="outlined"
                                size="medium"
                                fullWidth
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                placeholder="Enter your username"
                                sx={{
                                    mb: 2,
                                    maxWidth: '400px',
                                    borderRadius: '12px',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        backgroundColor: darkMode ? '#1E1E1E' : '#ffffff',
                                        boxShadow: darkMode ? '0px 4px 12px rgba(255, 255, 255, 0.1)' : '0px 4px 12px rgba(0, 0, 0, 0.1)',
                                        color: darkMode ? '#ffffff' : '#000000',
                                        borderColor: darkMode ? '#BB86FC' : '#c62828',
                                    },
                                    '& .MuiOutlinedInput-root:hover': {
                                        borderColor: darkMode ? '#BB86FC' : '#c62828',
                                    },
                                    '& .MuiOutlinedInput-root.Mui-focused': {
                                        borderColor: darkMode ? '#BB86FC' : '#c62828',
                                    }
                                }}
                                inputProps={{ style: { padding: '14px', fontSize: '1rem' } }}
                                InputLabelProps={{ style: { color: darkMode ? '#BB86FC' : '#c62828' } }}
                            />
                            <TextField
                                variant="outlined"
                                size="medium"
                                fullWidth
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                                placeholder="Enter your profile description"
                                multiline
                                rows={2}
                                sx={{
                                    mb: 3,
                                    maxWidth: '400px',
                                    borderRadius: '12px',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        backgroundColor: darkMode ? '#1E1E1E' : '#ffffff',
                                        boxShadow: darkMode ? '0px 4px 12px rgba(255, 255, 255, 0.1)' : '0px 4px 12px rgba(0, 0, 0, 0.1)',
                                        color: darkMode ? '#ffffff' : '#000000',
                                        borderColor: darkMode ? '#BB86FC' : '#c62828',
                                    },
                                    '& .MuiOutlinedInput-root:hover': {
                                        borderColor: darkMode ? '#BB86FC' : '#c62828',
                                    },
                                    '& .MuiOutlinedInput-root.Mui-focused': {
                                        borderColor: darkMode ? '#BB86FC' : '#c62828',
                                    }
                                }}
                                inputProps={{ style: { padding: '14px', fontSize: '1rem' } }}
                                InputLabelProps={{ style: { color: darkMode ? '#BB86FC' : '#c62828' } }}
                            />
                            <Button 
                                variant="contained" 
                                color="primary" 
                                startIcon={<Save />} 
                                onClick={handleSave}
                                sx={{
                                    borderRadius: '24px',
                                    textTransform: 'none',
                                    padding: '12px 36px',
                                    fontSize: '1rem',
                                    backgroundColor: darkMode ? '#BB86FC' : '#b71c1c',
                                    boxShadow: darkMode ? '0px 4px 12px rgba(255, 255, 255, 0.2)' : '0px 4px 12px rgba(0, 0, 0, 0.2)',
                                    mb: 3,
                                    '&:hover': {
                                        backgroundColor: darkMode ? '#7b4dff' : '#8e0000',
                                    },
                                }}
                            >
                                Save
                            </Button>
                        </Box>
                    ) : (
                        <>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 1, color: darkMode ? '#BB86FC' : '#b71c1c' }}>
                                {profileUser.firstName} {profileUser.lastName}
                            </Typography>
                            <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', color: darkMode ? '#7b4dff' : '#8e0000', fontSize: '1.2rem' }}>
                                @{profileUser.username}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', color: darkMode ? '#A7A7A7' : '#424242' }}>
                                {followers.length} Followers | {following.length} Following
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 2, mb: 3, textAlign: 'center', color: darkMode ? '#BB86FC' : '#8e0000', fontSize: '1.1rem', fontWeight: 'bold' }}>
                                {profileUser.profileDescription}
                            </Typography>
                            {user && user.id === profileUser.id && (
                                <Button 
                                    variant="outlined" 
                                    startIcon={<Edit />} 
                                    onClick={handleEdit} 
                                    sx={{
                                        mb: 2,
                                        borderRadius: '24px',
                                        textTransform: 'none',
                                        padding: '8px 24px',
                                        color: darkMode ? '#BB86FC' : '#c62828',
                                        borderColor: darkMode ? '#BB86FC' : '#c62828',
                                        '&:hover': {
                                            backgroundColor: darkMode ? '#BB86FC' : '#c62828',
                                            color: darkMode ? '#000000' : '#ffffff',
                                        },
                                    }}
                                >
                                    Edit Profile
                                </Button>
                            )}
                            {user && user.id !== profileUser.id && (
                                isFollowing ? (
                                    <Button 
                                        variant="contained" 
                                        color="secondary" 
                                        startIcon={<PersonRemove />} 
                                        onClick={handleUnfollow}
                                        sx={{
                                            borderRadius: '24px',
                                            textTransform: 'none',
                                            padding: '8px 24px',
                                            backgroundColor: darkMode ? '#BB86FC' : '#b71c1c',
                                            mb: 3, // Added margin bottom to create space between button and line
                                            '&:hover': {
                                                backgroundColor: darkMode ? '#7b4dff' : '#8e0000',
                                            },
                                        }}
                                    >
                                        Unfollow
                                    </Button>
                                ) : (
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        startIcon={<PersonAdd />} 
                                        onClick={handleFollow}
                                        sx={{
                                            borderRadius: '24px',
                                            textTransform: 'none',
                                            padding: '8px 24px',
                                            backgroundColor: darkMode ? '#BB86FC' : '#b71c1c',
                                            mb: 3, // Added margin bottom to create space between button and line
                                            '&:hover': {
                                                backgroundColor: darkMode ? '#7b4dff' : '#8e0000',
                                            },
                                        }}
                                    >
                                        Follow
                                    </Button>
                                )
                            )}
                        </>
                    )}
                </Box>
            )}
            <Divider sx={{ mb: 3, backgroundColor: darkMode ? '#BB86FC' : '#b71c1c' }} />
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center', color: darkMode ? '#BB86FC' : '#b71c1c' }}>
                Posts
            </Typography>
            <Grid container spacing={3}>
                {postList.map((post) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={post.id}>
                        <Card 
                            sx={{ 
                                cursor: 'pointer',
                                borderRadius: '16px',
                                boxShadow: 3,
                                overflow: 'hidden',
                                transition: 'transform 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    boxShadow: 6,
                                },
                                backgroundColor: darkMode ? '#1E1E1E' : '#ffffff',
                            }} 
                            onClick={() => handleOpen(post)}
                        >
                            {post.imageFile && (
                                <Box sx={{ position: 'relative', width: '100%', paddingBottom: '100%', overflow: 'hidden' }}>
                                    <img
                                        src={`${import.meta.env.VITE_FILE_BASE_URL}${post.imageFile}`}
                                        alt="post"
                                        style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </Box>
                            )}
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {selectedPost && (
                <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                    <DialogTitle sx={{ backgroundColor: darkMode ? '#1E1E1E' : '#fff', color: darkMode ? '#BB86FC' : '#b71c1c' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6">Post Details</Typography>
                            <IconButton onClick={handleClose} sx={{ color: darkMode ? '#BB86FC' : '#b71c1c' }}>
                                <Close />
                            </IconButton>
                        </Box>
                    </DialogTitle>
                    <DialogContent sx={{ backgroundColor: darkMode ? '#1E1E1E' : '#fff' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Link to={`/profile/${selectedPost.userId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <Avatar sx={{ bgcolor: darkMode ? '#BB86FC' : '#b71c1c', mr: 2 }}>
                                    {selectedPost.user?.firstName.charAt(0).toUpperCase()}
                                </Avatar>
                            </Link>
                            <Box sx={{ flexGrow: 1 }}>
                                <Link to={`/profile/${selectedPost.userId}`} style={{ textDecoration: 'none', color: darkMode ? '#BB86FC' : '#8e0000' }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                        {selectedPost.user?.username}
                                    </Typography>
                                </Link>
                                <Typography variant="body2" color="textSecondary">
                                    {dayjs(selectedPost.createdAt).format(global.datetimeFormat)}
                                </Typography>
                            </Box>
                            {user && (user.id === selectedPost.userId || user.role === 'Admin') && (
                                <>
                                    <Link to={`/editpost/${selectedPost.id}`} state={{ redirectTo: `/profile/${userId}` }}>
                                        <IconButton color="primary" sx={{ padding: '4px', color: darkMode ? '#BB86FC' : '#8e0000' }}>
                                            <Edit />
                                        </IconButton>
                                    </Link>
                                    <IconButton color="error" sx={{ padding: '4px', color: darkMode ? '#E53935' : '#D32F2F' }} onClick={handleDeleteConfirmOpen}>
                                        <Delete />
                                    </IconButton>
                                </>
                            )}
                        </Box>
                        <Divider sx={{ mb: 2, backgroundColor: darkMode ? '#BB86FC' : '#b71c1c' }} />
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: darkMode ? '#BB86FC' : '#b71c1c' }}>
                            {selectedPost.title}
                        </Typography>
                        {selectedPost.imageFile && (
                            <Box sx={{ position: 'relative', width: '100%', paddingBottom: '56.25%', mb: 2, overflow: 'hidden', borderRadius: 2, boxShadow: 2 }}>
                                <img
                                    src={`${import.meta.env.VITE_FILE_BASE_URL}${selectedPost.imageFile}`}
                                    alt="post"
                                    style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </Box>
                        )}
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 2, color: darkMode ? '#BB86FC' : 'inherit' }}>
                            {selectedPost.description}
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ backgroundColor: darkMode ? '#1E1E1E' : '#fff' }}>
                        <Button onClick={handleClose} variant="outlined" sx={{ borderRadius: '24px', color: darkMode ? '#BB86FC' : '#b71c1c', borderColor: darkMode ? '#BB86FC' : '#b71c1c' }}>
                            Cancel
                        </Button>
                        {user && (user.id === selectedPost.userId || user.role === 'Admin') && (
                            <Button onClick={handleDeleteConfirmOpen} variant="contained" color="error" sx={{ borderRadius: '24px' }}>
                                Delete
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteConfirmOpen} onClose={handleDeleteConfirmClose} sx={{ backgroundColor: darkMode ? '#1E1E1E' : 'inherit' }}>
                <DialogTitle sx={{ color: darkMode ? '#BB86FC' : '#b71c1c' }}>Delete Post</DialogTitle>
                <DialogContent sx={{ backgroundColor: darkMode ? '#1E1E1E' : 'inherit' }}>
                    <DialogContentText>
                        Are you sure you want to delete this post? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteConfirmClose} variant="outlined" sx={{ color: darkMode ? '#BB86FC' : '#b71c1c', borderColor: darkMode ? '#BB86FC' : '#b71c1c' }}>
                        Cancel
                    </Button>
                    <Button onClick={deletePost} variant="contained" color="error" sx={{ borderRadius: '24px' }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default PostProfile;
