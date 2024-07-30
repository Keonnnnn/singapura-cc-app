import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Avatar, List, ListItem, ListItemAvatar, ListItemText, Card, CardContent, Divider, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { ArrowBack, Edit, Delete, Save, Clear } from '@mui/icons-material';
import UserContext from '../contexts/UserContext';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global'; // Import the global constants

function Comments() {
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
        }).catch(err => {
            console.error('Error fetching comments:', err);
        });
    };

    useEffect(() => {
        fetchPost();
        fetchComments();
    }, [postId]);

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        http.post('/comment', { content: newComment, postId }).then(() => {
            setNewComment('');
            fetchComments();
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
        <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton onClick={() => navigate('/posts')} sx={{ mr: 2 }}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="h6">Connect</Typography>
            </Box>
            <Box sx={{ boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)', borderRadius: 2, padding: 2, backgroundColor: '#fff' }}>
                <Card sx={{ borderRadius: 2, border: '1px solid #ddd', backgroundColor: 'white' }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
                                {post.user?.firstName.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                    {post.user?.username}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {dayjs(post.createdAt).format(global.datetimeFormat)}
                                </Typography>
                            </Box>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                            {post.title}
                        </Typography>
                        {post.imageFile && (
                            <Box sx={{ position: 'relative', width: '100%', height: 0, paddingBottom: '56.25%', mb: 2, overflow: 'hidden', borderRadius: 2, boxShadow: 2 }}>
                                <img
                                    src={`${import.meta.env.VITE_FILE_BASE_URL}${post.imageFile}`}
                                    alt="post"
                                    style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </Box>
                        )}
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
                            {post.description}
                        </Typography>

                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Comments ({comments.length})
                        </Typography>
                        {user && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Write a comment..."
                                    sx={{ mr: 2 }}
                                />
                                <Button variant="contained" color="primary" onClick={handleAddComment}>
                                    Comment
                                </Button>
                            </Box>
                        )}
                        <List>
                            {comments.map((comment) => (
                                <ListItem key={comment.id} alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar sx={{ width: 40, height: 40 }}>
                                            {comment.user.firstName.charAt(0).toUpperCase()}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body2" color="textPrimary">
                                                {comment.user.username}
                                            </Typography>
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
                                                        sx={{ mb: 1 }}
                                                    />
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <IconButton color="primary" onClick={() => handleSaveEditComment(comment.id)}>
                                                            <Save />
                                                        </IconButton>
                                                        <IconButton color="secondary" onClick={handleCancelEditComment}>
                                                            <Clear />
                                                        </IconButton>
                                                    </Box>
                                                </>
                                            ) : (
                                                <>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {dayjs(comment.createdAt).format(global.datetimeFormat)}
                                                    </Typography>
                                                    <Typography variant="body1">{comment.content}</Typography>
                                                    {user && user.id === comment.userId && (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                            <IconButton color="primary" onClick={() => handleEditComment(comment.id)}>
                                                                <Edit />
                                                            </IconButton>
                                                            <IconButton color="secondary" onClick={() => handleOpen(comment.id)}>
                                                                <Delete />
                                                            </IconButton>
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

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Delete Comment</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this comment?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="contained" color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteComment} variant="contained" color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Comments;
