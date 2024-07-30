import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Button, Menu, MenuItem, Fade, Avatar, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import http from '../http';
import UserContext from '../contexts/UserContext';

function Membership() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (localStorage.getItem('accessToken')) {
        try {
          const res = await http.get('/user/auth');
          setUser(res.data.user);
          console.log("Fetched User: ", res.data.user);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchUser();
  }, []);


  const getInitials = (firstName) => {
    if (!firstName) return '';
    return firstName.charAt(0).toUpperCase();
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClaimRewards = () => {
    navigate('/ClaimRewards');
  };
  const handleSpinTheWheel = () => {
    navigate('/spin');
  };


  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Box>
        <Container sx={{ backgroundColor: 'lightgray', width: '250px', height: '600px', marginLeft: '30px', borderRadius: '10px', marginTop: '100px' }}>
          <AccountCircleIcon sx={{ fontSize: '200px' }} />
          {user && (
            <>
              <Typography sx={{ marginLeft: 1 }}>{user.firstName} {user.lastName}</Typography>
            </>
          )}
          <div>
            <Button
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              Membership
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={handleClaimRewards}>My Rewards</MenuItem>
              <MenuItem onClick={handleSpinTheWheel}>Spin The Wheel</MenuItem>
            </Menu>
          </div>
        </Container>
      </Box>
    </UserContext.Provider>
  )
}

export default Membership;