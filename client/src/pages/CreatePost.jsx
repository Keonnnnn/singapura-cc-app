import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, IconButton, Paper, Avatar, Tooltip, Slide } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../contexts/UserContext';
import { PhotoCamera, Close } from '@mui/icons-material';

function CreatePost() {
    const navigate = useNavigate();
    const { user, darkMode } = useContext(UserContext);
    const [imageFile, setImageFile] = useState(null);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
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
      if (!imageFile) {
        toast.error("Image is required to create a post");
        return;
      }

      const formData = new FormData();
      formData.append("title", data.title.trim());
      formData.append("description", data.description.trim());
      formData.append("imageFile", imageFile);

      http
        .post("/post", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          toast.success("Post created successfully");
          navigate("/posts");
        })
        .catch((err) => {
          toast.error("Failed to create post");
          console.error(err);
        });
    },
  });

  const onFileChange = (e) => {
    let file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error("Maximum file size is 1MB");
        return;
      }
      setImageFile(file);
    }
  };

  const handleCancel = () => {
    navigate("/posts");
  };

  const getInitials = (name) => {
    if (!name) return "";
    const words = name.split(" ");
    return words
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  };

    const getRandomColor = () => {
        const colors = darkMode
            ? ['#BB86FC', '#8E44AD', '#C39BD3', '#7B1FA2', '#9C27B0']
            : ['#7D3C98', '#8E44AD', '#9B59B6', '#5B2C6F', '#6C3483'];
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    };

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
                border: `2px solid ${darkMode ? 'rgba(187, 134, 252, 0.3)' : 'rgba(187, 134, 252, 0.3)'}`, // Faint purple border
                borderRadius: '16px',
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
                        onClick={handleCancel}
                    >
                        <Close sx={{ fontSize: 28 }} />
                    </IconButton>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Avatar 
                            sx={{ 
                                bgcolor: getRandomColor(), 
                                width: 56, 
                                height: 56, 
                                fontSize: '1.5rem', 
                                fontWeight: 'bold' 
                            }}
                        >
                            {getInitials(user?.firstName)}
                        </Avatar>
                        <Typography variant="h5" sx={{ ml: 2, fontWeight: 'bold', color: darkMode ? '#BB86FC' : '#000' }}>
                            Create a Post
                        </Typography>
                    </Box>
                    <Box 
                        component="form" 
                        onSubmit={formik.handleSubmit}
                        sx={{ 
                            padding: 2, 
                            borderRadius: '12px', 
                            border: `2px solid ${darkMode ? 'rgba(187, 134, 252, 0.3)' : 'rgba(187, 134, 252, 0.3)'}`, 
                            backgroundColor: darkMode ? '#2c2c2c' : '#fff',
                            boxShadow: darkMode ? '0 0 8px rgba(187, 134, 252, 0.3)' : '0 0 8px rgba(187, 134, 252, 0.3)'
                        }}
                    >
                        <TextField
                            fullWidth
                            margin="normal"
                            autoComplete="off"
                            label="Title"
                            name="title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={formik.touched.title && formik.errors.title}
                            variant="outlined"
                            sx={{ 
                                mb: 2, 
                                backgroundColor: darkMode ? '#333' : '#fff',
                                color: darkMode ? '#f0e6ff' : '#000',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: darkMode ? 'rgba(187, 134, 252, 0.3)' : 'rgba(187, 134, 252, 0.3)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: darkMode ? 'rgba(187, 134, 252, 0.3)' : 'rgba(187, 134, 252, 0.3)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: darkMode ? 'rgba(187, 134, 252, 0.3)' : 'rgba(187, 134, 252, 0.3)',
                                    },
                                }
                            }}
                            InputLabelProps={{
                                style: {
                                    color: darkMode ? '#BB86FC' : '#000',
                                },
                            }}
                            InputProps={{
                                style: {
                                    borderRadius: '12px',
                                    color: darkMode ? '#f0e6ff' : '#000',
                                },
                            }}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            autoComplete="off"
                            multiline
                            minRows={4}
                            label="What's on your mind?"
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                            variant="outlined"
                            sx={{ 
                                mb: 2, 
                                backgroundColor: darkMode ? '#333' : '#fff',
                                color: darkMode ? '#f0e6ff' : '#000',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: darkMode ? 'rgba(187, 134, 252, 0.3)' : 'rgba(187, 134, 252, 0.3)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: darkMode ? 'rgba(187, 134, 252, 0.3)' : 'rgba(187, 134, 252, 0.3)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: darkMode ? 'rgba(187, 134, 252, 0.3)' : 'rgba(187, 134, 252, 0.3)',
                                    },
                                }
                            }}
                            InputLabelProps={{
                                style: {
                                    color: darkMode ? '#BB86FC' : '#000',
                                },
                            }}
                            InputProps={{
                                style: {
                                    borderRadius: '12px',
                                    color: darkMode ? '#f0e6ff' : '#000',
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
                                        src={URL.createObjectURL(imageFile)}
                                        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                    />
                                </Box>
                            )}
                        </Box>
                        <Button
                            variant="contained"
                            type="submit"
                            fullWidth
                            sx={{
                                mt: 4,
                                borderRadius: '24px',
                                bgcolor: darkMode ? '#BB86FC' : '#D32F2F',
                                color: '#fff',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                p: 1.5,
                                '&:hover': { bgcolor: darkMode ? '#9C27B0' : '#b71c1c' }
                            }}
                        >
                            Post
                        </Button>
                    </Box>
                </Paper>
            </Slide>
        </Box>
    );
}

export default CreatePost;
