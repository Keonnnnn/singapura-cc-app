import React, { useState } from 'react';
import { Box, Typography, TextField, Button, IconButton, Paper, Tooltip } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PhotoCamera, Close } from '@mui/icons-material';

function AddNote() {
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);

    const formik = useFormik({
        initialValues: {
            title: "",
            description: ""
        },
        validationSchema: yup.object({
            title: yup.string().trim()
                .min(3, 'Title must be at least 3 characters.')
                .max(100, 'Title must be at most 100 characters.')
                .required('Title is required.'),
            description: yup.string().trim()
                .min(3, 'Description must be at least 3 characters.')
                .max(500, 'Description must be at most 500 characters.')
                .required('Description is required.')
        }),
        onSubmit: (data) => {
            if (imageFile) {
                data.imageFile = imageFile;
            }
            data.title = data.title.trim();
            data.description = data.description.trim();
            http.post('/notes', data)
                .then((res) => {
                    console.log(res.data);
                    toast.success('Note created successfully');
                    navigate('/notes');
                })
                .catch((err) => {
                    console.error(err);
                    toast.error('Failed to create note');
                });
        }
    });

    const handleCancel = () => {
        navigate("/notes");
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
                .catch(function (error) {
                    console.error("Failed to upload image:", error);
                    toast.error('Failed to upload image');
                });
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Paper elevation={3} sx={{ p: 3, maxWidth: 600, width: '100%', position: 'relative', borderRadius: '12px' }}>
                <Tooltip title="Close">
                    <IconButton
                        color="secondary"
                        sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.8)', borderRadius: '50%' }}
                        onClick={handleCancel}>
                        <Close />
                    </IconButton>
                </Tooltip>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ flex: 1 }}>
                        Create a Note
                    </Typography>
                </Box>
                <Box component="form" onSubmit={formik.handleSubmit}>
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
                        InputProps={{ style: { borderRadius: '8px' } }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        autoComplete="off"
                        multiline
                        minRows={3}
                        label="What's on your mind?"
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        helperText={formik.touched.description && formik.errors.description}
                        variant="outlined"
                        InputProps={{ style: { borderRadius: '8px' } }}
                    />

                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <Tooltip title="Upload Photo">
                            <IconButton color="primary" component="label" sx={{ borderRadius: '8px' }}>
                                <PhotoCamera />
                                <input hidden accept="image/*" type="file" onChange={onFileChange} />
                            </IconButton>
                        </Tooltip>
                        {imageFile && (
                            <Box sx={{ ml: 2, width: '300px', height: '200px', borderRadius: '8px', overflow: 'hidden' }}>
                                <img
                                    alt="note"
                                    src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </Box>
                        )}
                    </Box>

                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" type="submit" color="secondary" fullWidth sx={{ borderRadius: '24px', '&:hover': { bgcolor: '#313131' } }}>
                            Add
                        </Button>
                    </Box>
                </Box>
                <ToastContainer />
            </Paper>
        </Box>
    );
}

export default AddNote;
