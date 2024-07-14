import React from 'react'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';
import Rewards from './Rewards';


function Sidebar() {
  return (
    <List sx={{ width: 240, backgroundColor: 'red', color:'white'}}>
            <ListItem button component={Link} to="/Rewards">
                <ListItemText primary="View Rewards" />
            </ListItem>
            <ListItem button component={Link} to="/EditRewards">
                <ListItemText primary="Edit Rewards" />
            </ListItem>
        </List>
  )
}

export default Sidebar