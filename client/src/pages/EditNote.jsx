import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import http from '../http';
import { Box, Typography, TextField, Button, Grid, Paper, IconButton } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { PhotoCamera, Delete } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function EditNote() {
    const navigate = useNavigate();

    const { id } = useParams();

    const [note, setNote] = useState({
        title: "",
        description: ""
    });

    const [loading, setLoading] = useState(true);



    useEffect(() => {
        http.get(`/notes/${id}`).then((res) => {
            setNote(res.data);
            setLoading(false);
            console.log(res.data);
        });
    }, []);

    const formik = useFormik({
        initialValues: note,
        enableReinitialize: true,
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
            data.title = data.title.trim();
            data.description = data.description.trim();
            http.put(`/notes/${id}`, data)
                .then((res) => {
                    console.log(res.data);
                    navigate('/notes');
                })
                .catch ((err) => {
                    console.error(err);
                    toast.error('Failed to update note');
                });
        }
    });


    const [open, setOpen] = useState(false);

    // check for confirmation
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteNote = () => {
        http.delete(`/notes/${id}`)
            .then((res) => {
                console.log(res.data);
                navigate('/notes');
            })
            .catch((err) => {
                console.error(err);
                toast.error('Failed to delete note');
            });
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Paper elevation={3} sx={{ p: 3, maxWidth: 600, width: '100%', borderRadius: '12px' }}>
                <Box Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" sx={{ flex: 1 }}>
                        Edit Note
                    </Typography>
                    <IconButton color="error" onClick={handleOpen}>
                        <Delete />
                    </IconButton>
                </Box>

                

            </Paper>



            <Typography variant="h5" sx={{my: 2}}>Edit Tutorial</Typography>

            {
                !loading && (
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <TextField fullWidth margin="dense" autoComplete="off" label="Title" name="title" value={formik.values.title} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.title && Boolean(formik.errors.title)} helperText={formik.touched.title && formik.errors.title} />

                        <TextField fullWidth margin="dense" autoComplete="off" multiline minRows={4} label="Description" name="description" value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.description && Boolean(formik.errors.description)} helperText={formik.touched.description && formik.errors.description} />

                        <Box sx={{mt: 2}}>
                            <Button variant="contained" type="submit" color="secondary" >Update</Button>

                            <Button variant="contained" color="error" onClick={handleOpen} sx={{ml: 2}}>Delete</Button>
                        </Box>
                    </Box>
                )
            }

        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Delete Note</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete this note?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color='inherit' onClick={handleClose}>Cancel</Button>
                <Button variant="contained" color='error' onClick={deleteNote}>Delete</Button>
            </DialogActions>
            
        </Dialog>
        </Box>

        
    );
}

export default EditNote;