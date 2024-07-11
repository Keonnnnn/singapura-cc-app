import React, { useEffect, useState } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, IconButton, Typography, Box, Tooltip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import http from '../http';
import { Link } from 'react-router-dom';
import { Visibility, Edit, Delete } from '@mui/icons-material'; 
import { ToastContainer, toast } from 'react-toastify';

function ViewUsers() {
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await http.get('/user');
                setUsers(response.data); 
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    
    const [open, setOpen] = useState(false);

    const handleDelete = (id) => {
        setUserId(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteUser = () => {
        if (userId) {
            http.delete(`/user/${userId}`)
                .then((res) => {
                    setUsers(users.filter(user => user.id !== userId));
                    toast.success('User deleted successfully');
                    setOpen(false);
                })
                .catch((error) => {
                    console.error('Error deleting user:', error);
                    toast.error('Failed to delete user');
                });
        }
    };

    // Handle loading state
    if (users.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>User Overview</Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>User ID</strong></TableCell>
                            <TableCell><strong>First Name</strong></TableCell>
                            <TableCell><strong>Last Name</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Role</strong></TableCell>
                            <TableCell><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.firstName}</TableCell>
                                <TableCell>{user.lastName}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <Link to={`/users/${user.id}/view`}>
                                        <Tooltip title="View Details">
                                            <IconButton color="secondary" sx={{ padding: '4px' }}>
                                                <Visibility />
                                            </IconButton>
                                        </Tooltip>
                                    </Link>
                                    <Link to={`/users/${user.id}/edit`} >
                                        <Tooltip title="Edit User">
                                            <IconButton color="secondary" sx={{ padding: '4px' }}>
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                    </Link>
                                    <Tooltip title="Delete User">
                                        <IconButton color="error" sx={{ padding: '4px', visibility: user.id === 1 ? 'hidden' : 'visible' }} onClick={() => handleDelete(user.id)}>
                                            <Delete />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Delete user</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this user?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color='inherit' onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" color='error' onClick={deleteUser}>Delete</Button>
                </DialogActions>
            </Dialog>

            
            <ToastContainer />
        </Box>
    );
}

export default ViewUsers;
