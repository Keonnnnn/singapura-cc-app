import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import http from '../http';
import { Box, Typography, TextField, Button, Card, CardContent, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

function updateReward() {

    const handleCancel = () => {
        navigate('/editrewards'); // Replace '/editrewards' with the correct path
    };

    const navigate = useNavigate();
    const { id } = useParams();
    const [reward, setReward] = useState({
        rewardName: "",
        description: "",
        Points: "",
        Tier: ""
    });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        http.get(`/reward/${id}`).then((res) => {
            setReward(res.data);
            setLoading(false);
        });
    }, []);
    const formik = useFormik({
        initialValues: reward,
        enableReinitialize: true,
        validationSchema: yup.object({
            rewardName: yup.string().trim().min(3, 'At least 3 characters').max(100, 'At most 100 characters').required('Reward name is needed'),
            description: yup.string().trim().min(3, 'At least 3 characters').max(500, 'At most 500 characters').required('Description is required'),
            Points: yup.number().min(100, 'Minimum points 1000').max(100000, 'Maximum points 100,000').integer().required('Points is required'),
            Tier: yup.string().trim().min(3, 'At least 3 characters').max(100, 'At most 100 characters').required('Tier is required')
        }),
        onSubmit: (data) => {
            data.rewardName = data.rewardName.trim();
            data.description = data.description.trim();
            data.Points = data.Points;
            data.description = data.description.trim();
            data.description = data.Tier.trim();
            http.put(`/reward/${id}`, data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/rewards");
                });
        }
    });
    return (
        <Box>
            <Card sx={{ borderColor: 'black', backgroundColor: 'white', color: 'black', margin: '100px 200px 100px 200px'}}>
                <CardContent>
                    <Typography variant="h5" sx={{ my: 2 }}>
                        Edit Reward
                    </Typography>
                    {
                        !loading && (
                            <Box component="form" onSubmit={formik.handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth margin="dense" autoComplete="off"
                                            multiline minRows={1}
                                            label="Reward Name"
                                            name="rewardName"
                                            value={formik.values.rewardName}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.rewardName && Boolean(formik.errors.rewardName)}
                                            helperText={formik.touched.rewardName && formik.errors.rewardName}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth margin="dense" autoComplete="off"
                                            multiline minRows={1}
                                            label="Description"
                                            name="description"
                                            value={formik.values.description}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.description && Boolean(formik.errors.description)}
                                            helperText={formik.touched.description && formik.errors.description}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth margin="dense" autoComplete="off"
                                            multiline minRows={1}
                                            label="Points"
                                            name="Points"
                                            value={formik.values.Points}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.Points && Boolean(formik.errors.Points)}
                                            helperText={formik.touched.Points && formik.errors.Points}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth margin="dense" autoComplete="off"
                                            multiline minRows={1}
                                            label="Tier"
                                            name="Tier"
                                            value={formik.values.Tier}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.Tier && Boolean(formik.errors.Tier)}
                                            helperText={formik.touched.Tier && formik.errors.Tier}
                                        />
                                    </Grid>
                                </Grid>
                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end'}}>
                                    <Button variant="contained" onClick={handleCancel} sx={{ backgroundColor: 'blue', margin:' 0px 5px 0px 0px'}}>Cancel</Button>
                                    <Button variant="contained" type="submit" sx={{ backgroundColor: 'red' }}>Update</Button>
                                </Box>
                            </Box>

                        )
                    }
                </CardContent>
            </Card>
        </Box >
    )
}

export default updateReward