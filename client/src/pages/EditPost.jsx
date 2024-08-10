import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, TextField, Button, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Tooltip, Slide } from '@mui/material';
import { PhotoCamera, Delete, Close } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import http from '../http';
import UserContext from '../contexts/UserContext';

function EditPost({ darkMode }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(UserContext);

  const [post, setPost] = useState({
    title: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

    const redirectTo = location.state?.redirectTo || "/posts";

  useEffect(() => {
    http
      .get(`/post/${id}`)
      .then((res) => {
        setPost(res.data);
        setImageFile(res.data.imageFile);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch post:", error);
        toast.error("Failed to fetch post");
      });
  }, [id]);

  const formik = useFormik({
    initialValues: post,
    enableReinitialize: true,
    validationSchema: yup.object({
      title: yup
        .string()
        .trim()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must be at most 100 characters")
        .required("Title is required"),
      description: yup
        .string()
        .trim()
        .min(3, "Description must be at least 3 characters")
        .max(500, "Description must be at most 500 characters")
        .required("Description is required"),
    }),
    onSubmit: (data) => {
      if (imageFile) {
        data.imageFile = imageFile;
      }
      data.title = data.title.trim();
      data.description = data.description.trim();
      http
        .put(`/post/${id}`, data)
        .then((res) => {
          console.log(res.data);
          navigate(redirectTo);
        })
        .catch((error) => {
          console.error("Failed to update post:", error);
          toast.error("Failed to update post");
        });
    },
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deletePost = () => {
    http
      .delete(`/post/${id}`)
      .then((res) => {
        console.log(res.data);
        navigate(redirectTo);
      })
      .catch((error) => {
        console.error("Failed to delete post:", error);
        toast.error("Failed to delete post");
      });
  };

  const onFileChange = (e) => {
    let file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error("Maximum file size is 1MB");
        return;
      }

      let formData = new FormData();
      formData.append("file", file);
      http
        .post("/file/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          setImageFile(res.data.filename);
        })
        .catch((error) => {
          console.error("Failed to upload image:", error);
          toast.error("Failed to upload image");
        });
    }
  };

    const isAuthorized = user && (user.id === post.userId || user.role === 'Admin');

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: darkMode ? 0 : 5,
                px: 2,
                mb: darkMode ? 0 : 6,
                backgroundColor: darkMode ? '#121212' : '#f5f5f5',
                padding: 4,
                minHeight: '100vh'
            }}
        >
            <Slide direction="up" in={true} mountOnEnter unmountOnExit>
                <Paper
                    elevation={4}
                    sx={{
                        p: 4,
                        maxWidth: 600,
                        width: '100%',
                        position: 'relative',
                        borderRadius: '16px',
                        backgroundColor: darkMode ? '#1c1c1c' : '#ffffff',
                        color: darkMode ? '#f0e6ff' : '#000',
                        border: `2px solid ${darkMode ? 'rgba(187, 134, 252, 0.3)' : 'rgba(187, 134, 252, 0.3)'}`, // Very faint purple border
                        boxShadow: darkMode ? '0px 4px 20px rgba(187, 134, 252, 0.3)' : '3px 3px 10px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    <IconButton
                        color="secondary"
                        sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            bgcolor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                            borderRadius: '50%',
                            width: 48,
                            height: 48,
                            color: darkMode ? '#BB86FC' : '#D32F2F',
                            '&:hover': {
                                bgcolor: darkMode ? '#BB86FC' : '#D32F2F',
                                color: '#fff',
                            },
                            boxShadow: 2,
                        }}
                        onClick={() => navigate(-1)}
                    >
                        <Close sx={{ fontSize: 28 }} />
                    </IconButton>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" sx={{ flex: 1, fontWeight: 'bold', color: darkMode ? '#BB86FC' : '#000' }}>
                            Edit Post
                        </Typography>
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
                                InputProps={{
                                    style: { 
                                        borderRadius: '12px',
                                        color: darkMode ? '#f0e6ff' : '#000', 
                                        backgroundColor: darkMode ? '#1e1e1e' : '#fff',
                                        borderColor: darkMode ? 'rgba(187, 134, 252, 0.3)' : 'rgba(187, 134, 252, 0.3)' // Very faint purple border
                                    }
                                }}
                                sx={{
                                    mb: 2,
                                    backgroundColor: darkMode ? '#1e1e1e' : '#fff',
                                    color: darkMode ? '#f0e6ff' : '#000',
                                    '& .MuiInputBase-input': {
                                        color: darkMode ? '#f0e6ff' : '#000',
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: darkMode ? 'rgba(187, 134, 252, 0.3)' : 'rgba(187, 134, 252, 0.3)', // Very faint purple border
                                        },
                                        '&:hover fieldset': {
                                            borderColor: darkMode ? 'rgba(187, 134, 252, 0.3)' : 'rgba(187, 134, 252, 0.3)', // Very faint purple border
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: darkMode ? 'rgba(187, 134, 252, 0.3)' : 'rgba(187, 134, 252, 0.3)', // Very faint purple border
                                        },
                                    }
                                }}
                                InputLabelProps={{
                                    style: {
                                        color: darkMode ? '#BB86FC' : '#000',
                                    },
                                }}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                multiline
                                minRows={4}
                                label="Description"
                                name="description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.description && Boolean(formik.errors.description)}
                                helperText={formik.touched.description && formik.errors.description}
                                variant="outlined"
                                InputProps={{
                                    style: { 
                                        borderRadius: '12px',
                                        color: darkMode ? '#f0e6ff' : '#000', 
                                        backgroundColor: darkMode ? '#1e1e1e' : '#fff',
                                        borderColor: darkMode ? 'rgba(187, 134, 252, 0.3)' : 'rgba(187, 134, 252, 0.3)' // Very faint purple border
                                    }
                                }}
                                sx={{
                                    mb: 2,
                                    backgroundColor: darkMode ? '#1e1e1e' : '#fff',
                                    color: darkMode ? '#f0e6ff' : '#000',
                                    '& .MuiInputBase-input': {
                                        color: darkMode ? '#f0e6ff' : '#000',
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: darkMode ? 'rgba(187, 134, 252, 0.3)' : 'rgba(187, 134, 252, 0.3)', // Very faint purple border
                                        },
                                        '&:hover fieldset': {
                                            borderColor: darkMode ? 'rgba(187, 134, 252, 0.3)' : 'rgba(187, 134, 252, 0.3)', // Very faint purple border
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: darkMode ? 'rgba(187, 134, 252, 0.3)' : 'rgba(187, 134, 252, 0.3)', // Very faint purple border
                                        },
                                    }
                                }}
                                InputLabelProps={{
                                    style: {
                                        color: darkMode ? '#BB86FC' : '#000',
                                    },
                                }}
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
                                <Tooltip title="Upload Image" arrow>
                                    <IconButton color="primary" component="label" sx={{ borderRadius: '12px', p: 2 }}>
                                        <PhotoCamera />
                                        <input hidden accept="image/*" type="file" onChange={onFileChange} />
                                    </IconButton>
                                </Tooltip>
                                {imageFile && (
                                    <Box sx={{ ml: 3, width: '100%', maxWidth: '320px', borderRadius: '12px', overflow: 'hidden' }}>
                                        <img
                                            alt="preview"
                                            src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}
                                            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                        />
                                    </Box>
                                )}
                            </Box>
                            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    sx={{
                                        borderRadius: '24px',
                                        bgcolor: darkMode ? '#D32F2F' : '#D32F2F',  // Red in both dark and light mode
                                        color: '#ffffff',
                                        fontWeight: 'bold',
                                        '&:hover': { 
                                            bgcolor: darkMode ? '#b71c1c' : '#b71c1c'  // Darker red on hover in both modes
                                        }
                                    }}
                                >
                                    Update
                                </Button>
                                {isAuthorized && (
                                    <Tooltip title="Delete Post" arrow>
                                        <IconButton color="error" onClick={handleOpen} sx={{ borderRadius: '12px', p: 2 }}>
                                            <Delete />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </Box>
                        </Box>
                    )}

                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>Delete Post</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to delete this post? This action cannot be undone.
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
                </Paper>
            </Slide>
        </Box>
    );
}

export default EditPost;
