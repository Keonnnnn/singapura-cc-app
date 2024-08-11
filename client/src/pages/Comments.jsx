import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Box, Typography, TextField, Button, Avatar, List, ListItem, ListItemAvatar, ListItemText, Card, CardContent, Divider, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Tooltip, Slide } from '@mui/material';
import { ArrowBack, Edit, Delete, Save, Clear } from '@mui/icons-material';
import UserContext from '../contexts/UserContext';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';

function Comments({ darkMode }) {
    const { postId } = useParams();
    const { user } = useContext(UserContext);
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editingComment, setEditingComment] = useState(null);
    const [editCommentText, setEditCommentText] = useState('');
    const [open, setOpen] = useState(false);
    const [selectedCommentId, setSelectedCommentId] = useState(null);
    const navigate = useNavigate();

    const fetchPost = () => {
        http.get(`/post/${postId}`).then((res) => {
            setPost(res.data);
        }).catch(err => {
            console.error('Error fetching post:', err);
        });
    };

    const fetchComments = () => {
        http.get(`/comment/post/${postId}`).then((res) => {
            setComments(res.data);
            console.log(res.data);
        }).catch(err => {
            console.error('Error fetching comments:', err);
        });
    };

    useEffect(() => {
        fetchPost();
        fetchComments();
    }, []);

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        http.post('/comment', { content: newComment, postId }).then((res) => {
            setNewComment('');
            fetchComments();
            console.log(res.data);
        }).catch(err => {
            console.error('Error adding comment:', err);
        });
    };

    const handleEditComment = (commentId) => {
        const comment = comments.find(comment => comment.id === commentId);
        setEditingComment(commentId);
        setEditCommentText(comment.content);
    };

    const handleSaveEditComment = (commentId) => {
        http.put(`/comment/${commentId}`, { content: editCommentText }).then(() => {
            setEditingComment(null);
            setEditCommentText('');
            fetchComments();
        }).catch(err => {
            console.error('Error updating comment:', err);
        });
    };

    const handleCancelEditComment = () => {
        setEditingComment(null);
        setEditCommentText('');
    };

    const handleOpen = (commentId) => {
        setSelectedCommentId(commentId);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedCommentId(null);
    };

    const handleDeleteComment = () => {
        if (selectedCommentId) {
            http.delete(`/comment/${selectedCommentId}`).then(() => {
                fetchComments();
                handleClose();
            }).catch(err => {
                console.error('Error deleting comment:', err);
            });
        }
    };

    if (!post) return <div>Loading...</div>;

    return (
        <Box sx={{ padding: 3, backgroundColor: darkMode ? '#121212' : '#fff', color: darkMode ? '#f0e6ff' : '#000' }}>
            <Slide direction="up" in={true} mountOnEnter unmountOnExit>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Tooltip title="Back to Posts" arrow>
                        <IconButton onClick={() => navigate('/posts')} sx={{ mr: 2, color: darkMode ? '#f0e6ff' : '#000' }}>
                            <ArrowBack />
                        </IconButton>
                    </Tooltip>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: darkMode ? '#BB86FC' : '#000' }}>Connect</Typography>
                </Box>
            </Slide>
            <Slide direction="up" in={true} mountOnEnter unmountOnExit>
                <Box sx={{ boxShadow: 4, borderRadius: 3, padding: 3, backgroundColor: darkMode ? '#1e1e1e' : '#fff', color: darkMode ? '#f0e6ff' : '#000', border: darkMode ? '1px solid #333' : '1px solid #ddd' }}>
                    <Card sx={{ borderRadius: 3, border: darkMode ? '1px solid #333' : '1px solid #ddd', backgroundColor: darkMode ? '#1e1e1e' : 'white', mb: 3, boxShadow: darkMode ? '0px 0px 15px rgba(187, 134, 252, 0.5)' : '0px 0px 10px rgba(0,0,0,0.1)' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Link to={`/profile/${post.userId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: darkMode ? '#BB86FC' : '#1976d2' }}>
                                        {post.user?.firstName.charAt(0).toUpperCase()}
                                    </Avatar>
                                </Link>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Link to={`/profile/${post.userId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: darkMode ? '#BB86FC' : '#000' }}>
                                            {post.user?.username}
                                        </Typography>
                                    </Link>
                                    <Typography variant="body2" color={darkMode ? '#BB86FC' : 'textSecondary'}>
                                        {dayjs(post.createdAt).format(global.datetimeFormat)}
                                    </Typography>
                                </Box>
                            </Box>
                            <Divider sx={{ mb: 3, backgroundColor: darkMode ? '#333333' : '#ddd' }} />
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: darkMode ? '#BB86FC' : '#000' }}>
                                {post.title}
                            </Typography>
                            {post.imageFile && (
                                <Box sx={{ position: 'relative', width: '100%', height: 0, paddingBottom: '56.25%', mb: 3, overflow: 'hidden', borderRadius: 3, boxShadow: 2 }}>
                                    <img
                                        src={`${import.meta.env.VITE_FILE_BASE_URL}${post.imageFile}`}
                                        alt="post"
                                        style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px', border: darkMode ? '2px solid #333333' : '2px solid #ddd' }}
                                    />
                                </Box>
                            )}
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 3, color: darkMode ? '#f0e6ff' : '#000' }}>
                                {post.description}
                            </Typography>

                            <Divider sx={{ my: 3, backgroundColor: darkMode ? '#333333' : '#ddd' }} />
                            <Typography variant="h6" sx={{ mb: 3, color: darkMode ? '#BB86FC' : '#000' }}>
                                Comments ({comments.length})
                            </Typography>
                            {user && (
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Write a comment..."
                                        sx={{ mr: 2, borderRadius: '12px', backgroundColor: darkMode ? '#444' : '#fff', color: darkMode ? '#f0e6ff' : '#000', boxShadow: darkMode ? '0px 0px 5px rgba(187, 134, 252, 0.5)' : 'none' }}
                                        InputProps={{
                                            style: {
                                                color: darkMode ? '#f0e6ff' : '#000',
                                            },
                                        }}
                                    />
                                    <Button variant="contained" color="primary" onClick={handleAddComment} sx={{ borderRadius: '24px', fontWeight: 'bold', backgroundColor: '#D32F2F', '&:hover': { backgroundColor: '#b71c1c' } }}>
                                        Comment
                                    </Button>
                                </Box>
                            )}
                            <List>
                                {comments.map((comment) => (
                                    <ListItem key={comment.id} alignItems="flex-start" sx={{ mb: 2 }}>
                                        <ListItemAvatar>
                                            <Link to={`/profile/${comment.userId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                <Avatar sx={{ width: 40, height: 40, bgcolor: darkMode ? '#BB86FC' : '#1976d2' }}>
                                                    {comment.user.firstName.charAt(0).toUpperCase()}
                                                </Avatar>
                                            </Link>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Link to={`/profile/${comment.userId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                    <Typography variant="body2" color={darkMode ? '#BB86FC' : '#000'}>
                                                        {comment.user.username}
                                                    </Typography>
                                                </Link>
                                            }
                                            secondary={
                                                editingComment === comment.id ? (
                                                    <>
                                                        <TextField
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            value={editCommentText}
                                                            onChange={(e) => setEditCommentText(e.target.value)}
                                                            sx={{ mb: 1, borderRadius: '12px', backgroundColor: darkMode ? '#444' : '#fff', color: darkMode ? '#f0e6ff' : '#000', boxShadow: darkMode ? '0px 0px 5px rgba(187, 134, 252, 0.5)' : 'none' }}
                                                            InputProps={{
                                                                style: {
                                                                    color: darkMode ? '#f0e6ff' : '#000',
                                                                },
                                                            }}
                                                        />
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Tooltip title="Save" arrow>
                                                                <IconButton color="primary" onClick={() => handleSaveEditComment(comment.id)} sx={{ mr: 1 }}>
                                                                    <Save />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Cancel" arrow>
                                                                <IconButton color="secondary" onClick={handleCancelEditComment}>
                                                                    <Clear />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Typography variant="body2" color={darkMode ? '#BB86FC' : 'textSecondary'}>
                                                            {dayjs(comment.createdAt).format(global.datetimeFormat)}
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ color: darkMode ? '#f0e6ff' : '#000' }}>{comment.content}</Typography>
                                                        {user && user.id === comment.userId && (
                                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                                <Tooltip title="Edit" arrow>
                                                                    <IconButton color="primary" onClick={() => handleEditComment(comment.id)} sx={{ mr: 1, color: darkMode ? '#E53935' : '#D32F2F' }}>
                                                                        <Edit />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title="Delete" arrow>
                                                                    <IconButton color="error" onClick={() => handleOpen(comment.id)} sx={{ color: darkMode ? '#E53935' : '#E53935' }}>
                                                                        <Delete />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Box>
                                                        )}
                                                    </>
                                                )
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Box>
            </Slide>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{ color: darkMode ? '#BB86FC' : '#b71c1c', backgroundColor: darkMode ? '#1E1E1E' : '#ffffff' }}>
                    Delete Comment
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: darkMode ? '#1E1E1E' : '#ffffff' }}>
                    <DialogContentText sx={{ color: darkMode ? '#BB86FC' : '#b71c1c' }}>
                        Are you sure you want to delete this comment? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ backgroundColor: darkMode ? '#1E1E1E' : '#ffffff' }}>
                    <Button onClick={handleClose} variant="outlined" sx={{ color: darkMode ? '#BB86FC' : '#b71c1c', borderColor: darkMode ? '#BB86FC' : '#b71c1c' }}>
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteComment} variant="contained" color="error" sx={{ borderRadius: '24px', backgroundColor: darkMode ? '#E53935' : '#b71c1c', '&:hover': { backgroundColor: darkMode ? '#D32F2F' : '#8e0000' } }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Comments;
