import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Card, CardContent, Button, IconButton, Avatar, Divider, TextField,
    MenuItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import { Edit, ThumbUp, Comment, Delete, ThumbUpAltOutlined } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';

function Posts({ darkMode }) {
    const [postList, setPostList] = useState([]);
    const { user } = useContext(UserContext);
    const [filter, setFilter] = useState('all');
    const [userColors, setUserColors] = useState({});
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);

    const getPosts = (filter = 'all') => {
        http.get(`/post?filter=${filter}`).then((res) => {
            setPostList(res.data);
        }).catch(err => {
            console.error("Error fetching posts:", err);
        });
    };

  useEffect(() => {
    getPosts();
  }, []);

  const handleFilterChange = (event) => {
    const newFilter = event.target.value;
    setFilter(newFilter);
    getPosts(newFilter);
  };

    const getRandomColor = () => {
        const colors = ['#7D3C98', '#8E44AD', '#9B59B6', '#5B2C6F', '#6C3483', '#BB8FCE', '#C39BD3', '#AF7AC5', '#8E44AD', '#9C27B0', '#7B1FA2'];
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    };

  const getUserColor = (userId) => {
    if (userColors[userId]) {
      return userColors[userId];
    } else {
      const color = getRandomColor();
      setUserColors((prevState) => ({
        ...prevState,
        [userId]: color,
      }));
      return color;
    }
  };

    const likePost = (postId) => {
        http.post(`/like/${postId}/like`).then(() => {
            getPosts(filter);
        }).catch(err => {
            console.error("Error liking post:", err);
        });
    };

    const unlikePost = (postId) => {
        http.post(`/like/${postId}/unlike`).then(() => {
            getPosts(filter);
        }).catch(err => {
            console.error("Error unliking post:", err);
        });
    };

  const handleOpen = (postId) => {
    setSelectedPostId(postId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPostId(null);
  };

    const handleDeletePost = () => {
        if (selectedPostId) {
            http.delete(`/post/${selectedPostId}`).then(() => {
                getPosts(filter);
                handleClose();
            }).catch(err => {
                console.error("Error deleting post:", err);
            });
        }
    };

    return (
        <Box sx={{ display: 'flex', backgroundColor: darkMode ? '#121212' : '#f5f5f5', minHeight: '100vh', borderRadius: 2, boxShadow: 3, mt: darkMode ? 0 : 2, pt: darkMode ? 0 : 2, color: darkMode ? '#f0e6ff' : '#000' }}>
            <Box sx={{ 
                width: 300, 
                padding: 3, 
                backgroundColor: darkMode ? '#1c1c1c' : '#ffffff', 
                borderRight: darkMode ? '1px solid #282828' : '1px solid #ddd', 
                minHeight: '100vh', 
                boxShadow: 3, 
                borderRadius: 2, 
                position: 'sticky',
                top: 0,
                height: '100vh',
                mb: 4, 
            }}>
                <Typography variant="h6" sx={{ mb: 3, fontSize: '1.5rem', fontWeight: 'bold', fontStyle: 'italic', color: darkMode ? '#D32F2F' : '#000' }}>
                    Connect
                </Typography>
                {user && (
                    <Link to="/createpost">
                        <Button 
                            variant='contained' 
                            fullWidth 
                            sx={{ 
                                mb: 2, 
                                backgroundColor: '#D32F2F', 
                                '&:hover': { backgroundColor: '#b71c1c' }, 
                                borderRadius: '20px', 
                                color: '#fff',
                                fontSize: '1.1rem',
                                boxShadow: darkMode ? '0px 0px 10px rgba(211, 47, 47, 0.5)' : 'none'
                            }}
                        >
                            Post
                        </Button>
                    </Link>
                )}
                {user && (
                    <Card sx={{ 
                        mb: 3, 
                        boxShadow: 2, 
                        borderRadius: 3, 
                        background: darkMode ? 'linear-gradient(135deg, #1f1f1f, #2b2b2b)' : '#ffffff', 
                        color: darkMode ? '#f0e6ff' : '#000',
                        padding: '16px',
                        border: darkMode ? '1px solid #282828' : '1px solid #ddd',
                        boxShadow: darkMode ? '0px 0px 15px rgba(187, 134, 252, 0.5)' : '0px 0px 10px rgba(0,0,0,0.1)'
                    }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                                component={Link}
                                to={`/profile/${user.id}`}
                                sx={{ bgcolor: getUserColor(user.id), mr: 2, textDecoration: 'none', width: 56, height: 56 }}
                            >
                                {user.firstName.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box
                                component={Link}
                                to={`/profile/${user.id}`}
                                sx={{ flexGrow: 1, textDecoration: 'none', color: darkMode ? '#BB86FC' : 'inherit' }}
                            >
                                <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                                    {user.firstName} {user.lastName}
                                </Typography>
                                <Typography variant="body2" color={darkMode ? '#BB86FC' : 'textSecondary'}>
                                    @{user.username}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                )}
                <Divider sx={{ backgroundColor: darkMode ? '#333333' : '#ddd' }} />
                <Box sx={{ mt: 3 }}>
                    <TextField
                        select
                        fullWidth
                        variant="outlined"
                        label="Filter by"
                        size="small"
                        value={filter}
                        onChange={handleFilterChange}
                        sx={{ 
                            borderRadius: 2, 
                            backgroundColor: darkMode ? '#1e1e1e' : '#fff', 
                            color: darkMode ? '#f0e6ff' : '#000',
                            boxShadow: darkMode ? '0px 0px 5px rgba(187, 134, 252, 0.5)' : 'none'
                        }}
                        InputLabelProps={{
                            style: {
                                color: darkMode ? '#BB86FC' : '#000',
                            },
                        }}
                        InputProps={{
                            style: {
                                color: darkMode ? '#f0e6ff' : '#000',
                            },
                        }}
                    >
                        <MenuItem value="all">
                            <ListItemText primary="All Posts" />
                        </MenuItem>
                        <MenuItem value="following">
                            <ListItemText primary="Following" />
                        </MenuItem>
                    </TextField>
                </Box>
            </Box>

            <Box sx={{ flexGrow: 1, padding: 3, marginLeft: 3 }}>
                <Typography variant="h5" sx={{ mb: 3, color: darkMode ? '#BB86FC' : '#000' }}>
                    Latest Events
                </Typography>
                {postList.map((post) => (
                    <Card key={post.id} sx={{ mb: 3, boxShadow: 3, borderRadius: 2, padding: 2, border: darkMode ? '1px solid #333333' : '1px solid #ddd', backgroundColor: darkMode ? '#1e1e1e' : '#ffffff', color: darkMode ? '#f0e6ff' : '#000', '&:hover': { boxShadow: darkMode ? '0px 0px 10px rgba(187, 134, 252, 0.5)' : '0px 0px 10px rgba(0,0,0,0.2)' } }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar
                                    component={Link}
                                    to={`/profile/${post.userId}`}
                                    sx={{ bgcolor: getUserColor(post.userId), mr: 2, textDecoration: 'none' }}
                                >
                                    {post.user?.firstName.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography
                                        component={Link}
                                        to={`/profile/${post.userId}`}
                                        variant="subtitle1"
                                        sx={{ fontWeight: 'bold', textDecoration: 'none', color: darkMode ? '#BB86FC' : 'inherit' }}
                                    >
                                        {post.user?.username}
                                    </Typography>
                                    <Typography variant="body2" color={darkMode ? '#BB86FC' : 'textSecondary'}>
                                        {dayjs(post.createdAt).format(global.datetimeFormat)}
                                    </Typography>
                                </Box>
                                {user && (user.id === post.userId || user.role === 'Admin') && (
                                    <>
                                        <Link to={`/editpost/${post.id}`}>
                                            <IconButton sx={{ padding: '4px', color: darkMode ? '#D32F2F' : '#D32F2F' }}>
                                                <Edit />
                                            </IconButton>
                                        </Link>
                                        <IconButton sx={{ padding: '4px', color: darkMode ? '#E53935' : '#E53935' }} onClick={() => handleOpen(post.id)}>
                                            <Delete />
                                        </IconButton>
                                    </>
                                )}
                            </Box>
                            <Divider sx={{ mb: 2, backgroundColor: darkMode ? '#333333' : '#ddd' }} />
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: darkMode ? '#BB86FC' : 'inherit' }}>
                                {post.title}
                            </Typography>
                            {post.imageFile && (
                                <Box sx={{ position: 'relative', width: '100%', height: 0, paddingBottom: '56.25%', mb: 2, overflow: 'hidden', borderRadius: 2, boxShadow: 2 }}>
                                    <img
                                        src={`${import.meta.env.VITE_FILE_BASE_URL}${post.imageFile}`}
                                        alt="post"
                                        style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px', border: darkMode ? '2px solid #333333' : '2px solid #ddd' }}
                                    />
                                </Box>
                            )}
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 2, color: darkMode ? '#f0e6ff' : '#000' }}>
                                {post.description}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <IconButton
                                        sx={{ padding: '4px', mr: 1, color: darkMode ? '#BB86FC' : '#E53935' }}
                                        onClick={() => post.Likes.some(like => like.userId === user.id) ? unlikePost(post.id) : likePost(post.id)}
                                    >
                                        {post.Likes.some(like => like.userId === user.id)
                                            ? <ThumbUp /> : <ThumbUpAltOutlined />}
                                    </IconButton>
                                    <Typography variant="body2">
                                        {post.Likes.length || 0} Likes
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <IconButton sx={{ padding: '4px', mr: 1, color: darkMode ? '#BB86FC' : '#E53935' }} onClick={() => navigate(`/comments/${post.id}`)}>
                                        <Comment />
                                    </IconButton>
                                    <Typography variant="body2">
                                        {post.Comments?.length || 0} Comments
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{ color: darkMode ? '#BB86FC' : 'inherit' }}>Delete Post</DialogTitle>
                <DialogContent sx={{ backgroundColor: darkMode ? '#1c1c1c' : 'inherit', color: darkMode ? '#f0e6ff' : '#000' }}>
                    <DialogContentText>
                        Are you sure you want to delete this post?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="contained" sx={{ color: darkMode ? '#BB86FC' : 'inherit' }}>
                        Cancel
                    </Button>
                    <Button onClick={handleDeletePost} variant="contained" sx={{ backgroundColor: darkMode ? '#E53935' : '#f44336', color: '#fff' }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Posts;
