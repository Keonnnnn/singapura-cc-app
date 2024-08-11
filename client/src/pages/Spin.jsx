import React, { useState, useEffect, useContext } from 'react';
import http from "../http";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Paper } from '@mui/material';
import { Wheel } from 'react-custom-roulette';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import '../spin.css';
import UserContext from '../contexts/UserContext';
import UserSidebar from '../components/UserSidebar';

function Spin() {
  const [userPoints, setUserPoints] = useState(60000);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [spinsLeft, setSpinsLeft] = useState(0);
  const [openReward, setOpenReward] = useState(false);
  const [wonOption, setWonOption] = useState('');
  const [rewardList, setRewardList] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
  }, [id]);

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
      setSpinsLeft(newSpins);

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

  const handleCloseReward = () => {
    setOpenReward(false);
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

  const filteredRewards = rewardList.filter(reward => reward.Tier !== user?.membershipType);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2, backgroundColor: '#f7f9fc' }}>
      <UserSidebar />
      <Paper
        elevation={4}
        sx={{
          marginLeft: '10px',
          p: 4,
          maxWidth: 900,
          width: '100%',
          minHeight: '500px',  // Ensure enough height to contain the wheel and spin count
          borderRadius: '16px',
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2, color: '#333', textAlign: 'center' }}>
          Spin the Wheel
        </Typography>
        <Typography sx={{ marginBottom: 1, color: '#333', textAlign: 'center' }}>
          You are currently a {user?.membershipType} member
        </Typography>
        <Typography sx={{ marginBottom: 4, color: '#333', textAlign: 'center' }}>
          1 Spin = 500 points
          <Button
            id="buybtn"
            onClick={handleBuySpin}
            sx={{
              marginLeft: 2,
              backgroundColor: '#df3428',
              color: '#ffffff',
              padding: '5px 10px',
              fontSize: '0.875rem',
              borderRadius: '50px',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
              '&:hover': { backgroundColor: '#ff6f61' },
            }}
          >
            Buy a Spin
          </Button>
        </Typography>
        <Box className="wheel-container" sx={{ display: 'flex', justifyContent: 'center', position: 'relative', marginBottom: 4 }}>
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={filteredRewards.map(reward => ({ option: reward.rewardName, style: { backgroundColor: 'lightgray' } }))}
            backgroundColors={['#3e3e3e', '#df3428']}
            textColors={['#ffffff']}
            onStopSpinning={() => {
              setMustSpin(false);
              const wonOption = filteredRewards[prizeNumber].rewardName;
              setWonOption(wonOption);
              setOpenReward(true);
            }}
          />
          <Button
            className="spinbtn"
            onClick={handleSpinClick}
            disabled={mustSpin || spinsLeft <= 0}
            sx={{
              position: 'absolute',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#df3428',
              color: '#ffffff',
              padding: '20px 15px',
              borderRadius: '50%',
              zIndex: 10,
              '&:hover': {
                backgroundColor: '#b71c1c', // Dark red color on hover
              },
            }}
          >
            <PlayArrowIcon />
          </Button>
        </Box>
        <Typography id="spincnt" sx={{ textAlign: 'center', marginTop: 2, fontWeight: 'bold', color: '#333'}}>
          {spinsLeft} Spins left
        </Typography>
        <Dialog
          open={openReward}
          onClose={handleCloseReward}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Congratulations!</DialogTitle>
          <DialogContent>
            <p>{`You won ${wonOption}`}</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseReward} color="primary" autoFocus>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
}

export default Spin;