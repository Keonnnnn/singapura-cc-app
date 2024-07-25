import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { PhotoCamera, Delete, Close } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import http from '../http';

function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState({
        title: "",
        description: ""
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        http.get(`/post/${id}`)
            .then((res) => {
                setPost(res.data);
                setImageFile(res.data.imageFile);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch post:", error);
                toast.error('Failed to fetch post');
            });
    }, [id]);

    const formik = useFormik({
        initialValues: post,
        enableReinitialize: true,
        validationSchema: yup.object({
            title: yup.string().trim()
                .min(3, 'Title must be at least 3 characters')
                .max(100, 'Title must be at most 100 characters')
                .required('Title is required'),
            description: yup.string().trim()
                .min(3, 'Description must be at least 3 characters')
                .max(500, 'Description must be at most 500 characters')
                .required('Description is required')
        }),
        onSubmit: (data) => {
            if (imageFile) {
                data.imageFile = imageFile;
            }
            data.title = data.title.trim();
            data.description = data.description.trim();
            http.put(`/post/${id}`, data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/posts");
                })
                .catch((error) => {
                    console.error("Failed to update post:", error);
                    toast.error('Failed to update post');
                });
        }
    });

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deletePost = () => {
        http.delete(`/post/${id}`)
            .then((res) => {
                console.log(res.data);
                navigate("/posts");
            })
            .catch((error) => {
                console.error("Failed to delete post:", error);
                toast.error('Failed to delete post');
            });
    };

    const onFileChange = (e) => {
        let file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                toast.error('Maximum file size is 1MB');
                return;
            }

            let formData = new FormData();
            formData.append('file', file);
            http.post('/file/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((res) => {
                    setImageFile(res.data.filename);
                })
                .catch((error) => {
                    console.error("Failed to upload image:", error);
                    toast.error('Failed to upload image');
                });
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Paper elevation={3} sx={{ p: 3, maxWidth: 600, width: '100%', borderRadius: '12px', position: 'relative' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" sx={{ flex: 1 }}>
                        Edit Post
                    </Typography>
                    <IconButton color="default" onClick={() => navigate(-1)} sx={{ position: 'absolute', top: 16, right: 16 }}>
                        <Close />
                    </IconButton>
                </Box>
                {!loading && (
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Title"
                            name="title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={formik.touched.title && formik.errors.title}
                            variant="outlined"
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            multiline
                            minRows={3}
                            label="Description"
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                            variant="outlined"
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                            <IconButton color="primary" component="label" sx={{ borderRadius: '8px' }}>
                                <PhotoCamera />
                                <input hidden accept="image/*" type="file" onChange={onFileChange} />
                            </IconButton>
                            {imageFile && (
                                <Box sx={{ ml: 2, width: '100%', height: 'auto' }}>
                                    <img
                                        alt="post"
                                        src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}
                                        style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                                    />
                                </Box>
                            )}
                        </Box>
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                            <Button variant="contained" type="submit" sx={{ borderRadius: '24px', bgcolor: '#1976d2', color: '#ffffff' }}>
                                Update
                            </Button>
                            <IconButton color="error" onClick={handleOpen} sx={{ borderRadius: '8px' }}>
                                <Delete />
                            </IconButton>
                        </Box>
                    </Box>
                )}

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Delete Post</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this post?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} variant="contained" color="inherit">
                            Cancel
                        </Button>
                        <Button onClick={deletePost} variant="contained" color="error">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                <ToastContainer />
            </Paper>
        </Box>
    );
}

export default EditPost;
