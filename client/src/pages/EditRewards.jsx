import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, IconButton, Input, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Search, Clear } from '@mui/icons-material';

function EditRewards() {
    const navigate = useNavigate();
    const [rewardList, setRewardList] = useState([]);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [search, setSearch] = useState('');
    const { id } = useParams();
    const [reward, setReward] = useState({
        rewardName: "",
        description: "",
        Points: "",
        Tier: ""
    });

    useEffect(() => {
        getRewards();
    }, []);

    useEffect(() => {
        if (id) {
            getRewardById(id);
        }
    }, [id]);

    const getRewards = () => {
        http.get('/reward').then((res) => {
            setRewardList(res.data);
        });
    };

    const getRewardById = (id) => {
        http.get(`/reward/${id}`).then((res) => {
            setReward(res.data);
        });
    };

    const handleAddDialogOpen = () => {
        setAddDialogOpen(true);
    };

    const handleAddDialogClose = () => {
        setAddDialogOpen(false);
    };

    const handleDeleteDialogOpen = (id) => {
        setDeleteDialogOpen(true);
        setDeleteId(id);
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
        setDeleteId(null);
    };

    const confirmDeleteReward = () => {
        deleteReward(deleteId);
        handleDeleteDialogClose();
    };

    const deleteReward = (id) => {
        http.delete(`/reward/${id}`).then((res) => {
            console.log("Data deleted from server:", res.data);
            getRewards();
        }).catch((error) => {
            console.error("Error deleting data:", error);
        });
    };

    const searchRewards = () => {
        http.get(`/reward?search=${search}`).then((res) => {
            setRewardList(res.data);
        });
    };

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const onClickSearch = () => {
        searchRewards();
    };

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchRewards();
        }
    };

    const onClickClear = () => {
        setSearch('');
        getRewards();
    };

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
            http.post("/reward", data).then((res) => {
                console.log(res.data);
                window.location.reload();
            });
        }
    });

    return (
        <Box>
            <Typography variant='h4' sx={{ margin: '10px 0px 50px 0px' }}>Rewards</Typography>
            <Box sx={{ width: '100%'}}>
                <Input value={search} placeholder="Search" onChange={onSearchChange} onKeyDown={onSearchKeyDown} />
                <IconButton color="primary" onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary" onClick={onClickClear}>
                    <Clear />
                </IconButton>
            </Box>
            <TableContainer component={Paper} sx={{ width: '100%', margin: '30px 0px 0px 0px', paddingRight:'-0px'}}>
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
                            <TableRow key={reward.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>{reward.id}</TableCell>
                                <TableCell component="th" scope="row">{reward.rewardName}</TableCell>
                                <TableCell>{reward.description}</TableCell>
                                <TableCell>{reward.Points}</TableCell>
                                <TableCell>{reward.Tier}</TableCell>
                                <TableCell>
                                <Link to={`/admin/update-rewards/${reward.id}`}>
                                        <Button color="primary" sx={{ padding: '4px', margin: '0px 5px 0px 0px', backgroundColor: 'blue', color: 'white', '&:hover': { backgroundColor: 'darkblue' } }}>
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button color="primary" sx={{ padding: '4px', backgroundColor: 'red', color: 'white', '&:hover': { backgroundColor: 'darkred' } }} onClick={() => handleDeleteDialogOpen(reward.id)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <React.Fragment>
                <Button variant="outlined" onClick={handleAddDialogOpen} sx={{ borderColor: 'red', backgroundColor: 'red', color: 'white', margin: '50px 0px 0px 1000px', '&:hover': { backgroundColor: 'darkred' } }}>
                    Add
                </Button>
                <Dialog open={addDialogOpen} onClose={handleAddDialogClose}>
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
                                <FormControl fullWidth margin="dense" sx={{ width: '48%' }}>
                                    <InputLabel id="tier-label">Tier</InputLabel>
                                    <Select
                                        labelId="tier-label"
                                        label="Tier"
                                        name="Tier"
                                        value={formik.values.Tier}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.Tier && Boolean(formik.errors.Tier)}
                                    >
                                        <MenuItem value="Bronze">Bronze</MenuItem>
                                        <MenuItem value="Silver">Silver</MenuItem>
                                        <MenuItem value="Gold">Gold</MenuItem>
                                    </Select>
                                    {formik.touched.Tier && formik.errors.Tier && (
                                        <Typography color="error" variant="caption">{formik.errors.Tier}</Typography>
                                    )}
                                </FormControl>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', margin: '40px 10px 10px 400px' }}>
                                    <Button onClick={handleAddDialogClose} sx={{ mt: 5, backgroundColor: 'blue', color: 'white', borderRadius: '5px', marginRight: '10px', '&:hover': { backgroundColor: 'darkblue' } }}>Cancel</Button>
                                    <Button variant="contained" type="submit" sx={{ mt: 5, backgroundColor: 'red', color: 'white' }}>Add</Button>
                                </Box>
                            </Box>
                        </Box>
                    </DialogContent>
                </Dialog>
                <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
                    <DialogContent>
                        <Typography>Are you sure you want to delete this reward?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDeleteDialogClose} sx={{ backgroundColor: 'blue', color: 'white', '&:hover': { backgroundColor: 'darkblue' } }}>Cancel</Button>
                        <Button onClick={confirmDeleteReward} sx={{ backgroundColor: 'red', color: 'white', '&:hover': { backgroundColor: 'darkred' } }}>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        </Box>
    );
}

export default EditRewards;

