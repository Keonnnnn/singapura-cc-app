import React, { useState, useEffect, useContext } from 'react';
import http from "../http";
import { useNavigate } from 'react-router-dom';
import { Box, Container, Button, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Wheel } from 'react-custom-roulette';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import '../spin.css';
import UserContext from '../contexts/UserContext';
import UserSidebar from '../components/UserSidebar';

function Spin() {
  const [userPoints, setUserPoints] = useState(60000); // example starting points
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [spinsLeft, setSpinsLeft] = useState(0);
  const [openReward, setOpenReward] = useState(false);
  const [wonOption, setWonOption] = useState('');
  const [rewardList, setRewardList] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { user: loggedInUser } = useContext(UserContext);
  const { id } = loggedInUser;

  useEffect(() => {
    const getInitialData = async () => {
      try {
        const rewardResponse = await http.get("/reward");
        setRewardList(rewardResponse.data);

        const userResponse = await http.get(`/reward/Membership/${id}`);
        setUser(userResponse.data.user);
        setUserPoints(userResponse.data.user.totalPoints);
        setSpinsLeft(userResponse.data.user.spinsLeft);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
      setLoading(false);
    };

    getInitialData();
  }, [id]); // Empty dependency array fetches on mount

  const handleCloseReward = () => {
    setOpenReward(false);
  };

  const handleSpinClick = async () => {
    if (spinsLeft > 0 && !mustSpin && filteredRewards.length > 0) {
      setSpinsLeft(spinsLeft - 1);
      const newPrizeNumber = Math.floor(Math.random() * filteredRewards.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);

      try {
        await http.put(`/reward/updatePoints/${id}`, { spinsLeft: spinsLeft - 1 });
      } catch (error) {
        console.error('Error updating spins:', error);
      }
    } else if (mustSpin) {
      alert('The wheel is still spinning.');
    } else {
      alert('You have no spins left. Buy more to spin.');
    }
  };

  const handleBuySpin = async () => {
    if (userPoints >= 500) {
      const newPoints = userPoints - 500;
      const newSpins = spinsLeft + 1;
      setUserPoints(newPoints);
      setSpinsLeft(newSpins); // Increase spins left by 1

      try {
        await http.put(`/reward/updatePoints/${id}`, { totalPoints: newPoints, spinsLeft: newSpins });
        setUser(prevUser => ({
          ...prevUser,
          totalPoints: newPoints,
          spinsLeft: newSpins
        }));
      } catch (error) {
        console.error('Error updating points or spins:', error);
      }
    } else {
      alert("You don't have enough points to buy a spin.");
    }
  };

  const handleIncrementCounter = async (rewardId) => {
    try {
      const response = await http.post('/reward/incrementCounter', { userId: id, rewardId });

      if (response.status === 200 || response.status === 201) {
        console.log('Reward counter incremented successfully');
      } else {
        console.error('Failed to increment reward counter:', response);
      }
    } catch (error) {
      console.error('Error incrementing reward counter:', error);
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
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

  const renderOption = (option) => {
    const reward = rewardList.find(r => r.rewardName === option.option);
    if (reward) {
      return (
        <Box className="wheel-content">
          <span style={{ fontSize: '20px' }}>{reward.rewardName}</span>
        </Box>
      );
    }
    return <span style={{ fontSize: '20px' }}>{option.option}</span>;
  };

  useEffect(() => {
    if (wonOption) {
      const wonReward = filteredRewards[prizeNumber];
      handleIncrementCounter(wonReward.id);
      setOpenReward(true);
      setWonOption(wonReward.rewardName);
    }
  }, [wonOption]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Filter rewards based on the user's tier
  const filteredRewards = rewardList.filter(reward => reward.Tier !== user?.membershipType);

  return (
    <Box sx={{marginTop:"100px"}}>
      <UserSidebar/>
      <div className="spin-container">
        <h3 id='textpos'>You are currently a {user?.membershipType} member</h3>
        <div className="header-container">
          <p id='textpos'>Buy spins, 1 Spin = 500 points</p>
          <button id='buybtn' onClick={handleBuySpin}>buy</button>
        </div>
        <div className="wheel-wrapper">
          <div className="wheel-container">
            {filteredRewards.length > 0 ? (
              <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                data={filteredRewards.map(reward => ({ option: reward.rewardName, style: { backgroundColor: 'lightgray' } }))}
                backgroundColors={['#3e3e3e', '#df3428']}
                textColors={['#ffffff']}
                renderOptionContent={renderOption} // Pass the function directly
                onStopSpinning={() => {
                  setMustSpin(false);
                  const wonOption = filteredRewards[prizeNumber].rewardName;
                  setWonOption(wonOption); // Adjusting wonOption based on the actual option type
                  setOpenReward(true);
                }}
              />
            ) : (
              <p>No rewards available for your tier.</p>
            )}
            <button className='spinbtn' onClick={handleSpinClick} disabled={mustSpin || spinsLeft <= 0}>
              <PlayArrowIcon />
            </button>
          </div>
          <h1 id='spincnt'>{spinsLeft} Spins left</h1>
        </div>
      </div>
      <Dialog
        open={openReward}
        onClose={handleCloseReward}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Congratulations!</DialogTitle>
        <DialogContent>
          <p>{`You won ${wonOption}`}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReward} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Spin;
