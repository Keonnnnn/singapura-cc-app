import React, { useEffect, useState, useContext } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Paper, Box, Typography, Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import http from '../http';
import UserContext from '../contexts/UserContext';
import UserSidebar from "../components/UserSidebar";

function ClaimRewards() {
  const [points, setPoints] = useState(0);
  const [userTier, setUserTier] = useState('');
  const maxPoints = 100000;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user: loggedInUser } = useContext(UserContext);
  const { id } = loggedInUser;
  const [rewardList, setRewardList] = useState([]);
  const [claimedRewards, setClaimedRewards] = useState([]);

  const USE_TESTING_POINTS = false;

  const handleClaim = async (rewardId, rewardPoints) => {
    const newPoints = points - rewardPoints;

    try {
      await http.put(`/reward/updatePoints/${id}`, { totalPoints: newPoints });
      const claimResponse = await http.post('/reward/claim', { userId: id, rewardId });

      if (claimResponse.status === 409) {
        console.warn('Reward already claimed');
        return;
      }

      setPoints(newPoints);
      setUser(prevUser => ({
        ...prevUser,
        totalPoints: newPoints
      }));
      setClaimedRewards([...claimedRewards, rewardId]);
    } catch (error) {
      console.error('Error claiming reward:', error);
    }
  };

  const canClaimReward = (rewardTier, rewardPoints) => {
    return userTier === rewardTier && points >= rewardPoints;
  };

  const calculateUserTier = (points) => {
    if (points <= 50000) {
      return 'Bronze';
    } else if (points <= 80000) {
      return 'Silver';
    } else {
      return 'Gold';
    }
  };

  useEffect(() => {
    const newTier = calculateUserTier(points);
    setUserTier(newTier);
    updateMembershipType(newTier);
  }, [points]);

  useEffect(() => {
    const fetchPoints = async () => {
      if (localStorage.getItem("accessToken")) {
        try {
          const res = await http.get(`/reward/Membership/${id}`);
          const claimedRes = await http.get(`/reward/claimed/${id}`);
          setUser(res.data.user);

          const actualPoints = res.data.user.totalPoints;
          const testPoints = 80001;
          const pointsToUse = USE_TESTING_POINTS ? testPoints : actualPoints;
          setPoints(pointsToUse);

          const initialTier = calculateUserTier(pointsToUse);
          setUserTier(initialTier);
          updateMembershipType(initialTier);
          setClaimedRewards(claimedRes.data.map(reward => reward.rewardId));
        } catch (error) {
          console.error(error);
        }
      }
      setLoading(false);
    };
    fetchPoints();
  }, [id]);

  const getProgressColor = (points) => {
    if (points <= 50000) {
      return '#cd7f32';
    } else if (points <= 80000) {
      return '#c0c0c0';
    } else {
      return '#ffd700';
    }
  };

  const percentage = (points / maxPoints) * 100;

  const getNextLevelInfo = (points) => {
    if (points < 50000) {
      return `${points}... ${50000 - points} more points to reach Silver!`;
    } else if (points < 80000) {
      return `${points}... ${80000 - points} more points to reach Gold!`;
    } else {
      return `You are at Gold level.`;
    }
  };

  useEffect(() => {
    const getInitialRewards = async () => {
      try {
        const response = await http.get('/reward');
        setRewardList(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    getInitialRewards();
  }, []);

  const updateMembershipType = async (tier) => {
    try {
      await http.put(`/reward/updateMembershipType/${id}`, { membershipType: tier });
      setUser(prevUser => ({
        ...prevUser,
        membershipType: tier
      }));
    } catch (error) {
      console.error('Error updating membership type:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'center', md: 'flex-start' }, justifyContent: 'center', gap: 5, padding: 2, backgroundColor: '#f7f9fc' }}>
      <UserSidebar />
      <UserContext.Provider value={{ user, setUser }}>
        <Paper
          elevation={4}
          sx={{
            p: 4,
            maxWidth: 900,
            width: '100%',
            minWidth: 0,
            borderRadius: '16px',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Box>
              <CircularProgressbar
                value={percentage}
                text={`${points} points`}
                styles={buildStyles({
                  pathColor: getProgressColor(points),
                  textColor: '#333',
                  trailColor: '#d6d6d6',
                  textSize: '14px',
                })}
              />
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#333',
              }}
            >
              {getNextLevelInfo(points)}
            </Typography>
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', mb: 3, textAlign: 'center' }}>
            Available Rewards
          </Typography>
  
          <Grid container spacing={3}>
            {rewardList
              .filter(reward => reward.Tier === userTier)
              .filter(reward => !claimedRewards.includes(reward.id))
              .map((reward) => {
                const isClaimable = canClaimReward(reward.Tier, reward.Points);
                return (
                  <Grid item xs={12} sm={6} key={reward.id}>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        textAlign: 'center',
                        backgroundColor: isClaimable ? '#e0f7fa' : '#f5f5f5',
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
                        },
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {reward.rewardName}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {reward.description}
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => handleClaim(reward.id, reward.Points)}
                        disabled={!isClaimable}
                        sx={{
                          width: '100%',
                          backgroundColor: isClaimable ? '#00796b' : '#bdbdbd',
                          color: '#fff',
                          '&:hover': { backgroundColor: isClaimable ? '#004d40' : '#bdbdbd' },
                        }}
                      >
                        Claim
                      </Button>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Points: {reward.Points}
                      </Typography>
                      <Typography variant="body2">Tier: {reward.Tier}</Typography>
                    </Paper>
                  </Grid>
                );
              })}
          </Grid>

          <Typography variant="h5" sx={{ fontWeight: 700, color: '#333', mt: 5, mb: 2, textAlign: 'center' }}>
            Claimed Rewards
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            {claimedRewards.length > 0 ? (
              claimedRewards.map(rewardId => {
                const reward = rewardList.find(r => r.id === rewardId);
                return (
                  <Typography key={rewardId} variant="body1">
                    {reward.rewardName} - {reward.description}
                  </Typography>
                );
              })
            ) : (
              <Typography variant="body1" color="textSecondary">
                You haven't claimed any rewards yet.
              </Typography>
            )}
          </Box>
  
          <Box sx={{ mt: 5, textAlign: 'center' }}>
            <Button
              variant="contained"
              color="secondary"
              component={Link}
              to="/Spin"
              sx={{
                backgroundColor: '#ff4081',
                color: '#fff',
                padding: '10px 20px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                borderRadius: '50px',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                '&:hover': { backgroundColor: '#ff79b0' },
              }}
            >
              Spin the Wheel
            </Button>
          </Box>
        </Paper>
      </UserContext.Provider>
    </Box>
  );
}

export default ClaimRewards;
