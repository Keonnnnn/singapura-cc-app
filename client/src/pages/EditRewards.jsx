import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, IconButton } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';



function EditRewards() {

    const navigate = useNavigate();
    const [rewardList, setRewardList] = useState([]);
    const [addDialogOpen, setAddDialogOpen] = React.useState(false);
    const [tableData, setTableData] = useState(rewardList);

    const handleAddDialogOpen = () => {
        setAddDialogOpen(true);
    };

    const handleAddDialogClose = () => {
        setAddDialogOpen(false);
    };

    useEffect(() => {
        http.get('/reward').then((res) => {
            console.log(res.data);
            setRewardList(res.data);
        });
    }, []);

    const formik = useFormik({
        initialValues: {
            rewardName: "",
            description: "",
            Points: "",
            Tier: ""
        },
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
            data.Tier = data.Tier.trim();
            http.post("/reward", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/rewards");
                });
        }
    });

    const { id } = useParams();
    const [reward, setReward] = useState({
        rewardName: "",
        description: "",
        Points: "",
        Tier: ""
    });
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = React.useState(false);


    const handleClickOpen = (id) => {
        setOpen(true);
        console.log(id)
    };

    const handleClose = () => {
        setOpen(false);
        setAddDialogOpen(false);
    };

    useEffect(() => {
        http.get(`/reward/${id}`).then((res) => {
            setReward(res.data);
            setLoading(false);
            console.log(res.data);
        });
    }, [id]);
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await http.get(`/reward/${id}`);
    //             setReward(response.data);
    //         } catch (error) {
    //             setError(error.message || "Error fetching reward"); // Set a default message
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     if (id) {
    //         fetchData();
    //     }
    // }, [id]);

    const formikEdit = useFormik({
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
            http.put(`/reward/${formikEdit.values.id}`, data)
                .then((res) => {
                    console.log(res.data);
                });
        }
    });


    const deleteReward = (id) => {
        const updatedData = tableData.filter((item) => item.id !== id);
        setTableData(updatedData);

        // Make API call to delete data
        http.delete(`/reward/${id}`)
            .then((res) => {
                console.log("Data deleted from server:", res.data); // Optional: handle success message
                window.location.reload();
            })
            .catch((error) => {
                console.error("Error deleting data:", error); // Handle errors
            });

    };


    return (
        <Box>
            <Typography variant='h5' sx={{ margin: '-100px 100px 50px 450px' }}>Rewards</Typography>
            <TableContainer component={Paper} sx={{ width: '65%', margin: '50px 450px 0px 450px' }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Reward Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Points</TableCell>
                            <TableCell>Tier</TableCell>
                            <TableCell>Edit/Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rewardList.map((reward) => (
                            <TableRow
                                key={reward.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell>{reward.id}</TableCell>
                                <TableCell component="th" scope="row">
                                    {reward.rewardName}
                                </TableCell>
                                <TableCell>{reward.description}</TableCell>
                                <TableCell>{reward.Points}</TableCell>
                                <TableCell>{reward.Tier}</TableCell>
                                <TableCell>
                                        {reward && (
                                            
                                            <Link to={`/updatereward/${reward.id}`}>
                                                <Button color="primary" sx={{ padding: '4px', backgroundColor: 'blue', color: 'white', margin: '0px 5px 0px 0px' }}>
                                                    Edit
                                                </Button>
                                            </Link>
                                           
                                        )}
                                       
                                    <Button color="primary" sx={{ padding: '4px', backgroundColor: 'red', color: 'white' }} onClick={() => deleteReward(reward.id)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <React.Fragment>
                <Button variant="outlined" onClick={handleAddDialogOpen} sx={{ borderColor: 'red', backgroundColor: 'red', color: 'white', margin: '100px 100px 50px 1390px' }}>
                    Add
                </Button>
                <Dialog
                    open={addDialogOpen}
                    onClose={handleAddDialogClose}

                >
                    <DialogTitle>Add New Reward</DialogTitle>
                    <DialogContent>
                        <Box>
                            <Box component="form" onSubmit={formik.handleSubmit} display="flex" flexWrap="wrap" justifyContent="space-between">
                                <TextField
                                    fullWidth margin="dense" autoComplete="off"
                                    label="Reward Name"
                                    name="rewardName"
                                    sx={{ width: '48%' }}
                                    value={formik.values.rewardName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.rewardName && Boolean(formik.errors.rewardName)}
                                    helperText={formik.touched.rewardName && formik.errors.rewardName}
                                />
                                <TextField
                                    fullWidth margin="dense" autoComplete="off"
                                    label="Description"
                                    name="description"
                                    sx={{ width: '48%' }}
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.description && Boolean(formik.errors.description)}
                                    helperText={formik.touched.description && formik.errors.description}
                                />
                                <TextField
                                    fullWidth margin="dense" autoComplete="off"
                                    label="Points"
                                    name="Points"
                                    sx={{ width: '48%' }}
                                    value={formik.values.Points}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.Points && Boolean(formik.errors.Points)}
                                    helperText={formik.touched.Points && formik.errors.Points}
                                />
                                <TextField
                                    fullWidth margin="dense" autoComplete="off"
                                    label="Tier"
                                    name="Tier"
                                    sx={{ width: '48%' }}
                                    value={formik.values.Tier}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.Tier && Boolean(formik.errors.Tier)}
                                    helperText={formik.touched.Tier && formik.errors.Tier}
                                />
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Box sx={{ mt: 5, borderColor: 'red', backgroundborderColor: 'red', backgroundColor: 'blue', color: 'white', borderRadius: '5px', margin: '40px 10px 10px 400px' }}>
                                        <Button onClick={handleAddDialogClose} sx={{ color: 'white' }}>Cancel</Button>
                                    </Box>
                                    <Box sx={{ mt: 5 }}>
                                        <Button variant="contained" type="submit" sx={{ borderColor: 'red', backgroundColor: 'red', color: 'white' }}>
                                            Add
                                        </Button>
                                    </Box>
                                </div>
                            </Box>
                        </Box>
                    </DialogContent>
                </Dialog>
            </React.Fragment>
        </Box>
    )
}

export default EditRewards
