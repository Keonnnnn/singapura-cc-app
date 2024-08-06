import React, { useEffect, useState, useContext } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import '../claimRewards.css';
import { Paper, Box, Typography, Button } from '@mui/material';
import http from '../http';
import UserContext from '../contexts/UserContext';

function ClaimRewards() {
  const [points, setPoints] = useState(0); // Initial state set to 0
  const [userTier, setUserTier] = useState('');
  const maxPoints = 100000;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user: loggedInUser } = useContext(UserContext);
  const { id } = loggedInUser;
  const [rewardList, setRewardList] = useState([]);
  const [claimedRewards, setClaimedRewards] = useState([]); // NEW: State to track claimed rewards

  const USE_TESTING_POINTS = false; // Toggle this to true for testing points, false for actual points

  const handleClaim = async (rewardId, rewardPoints) => {
    const newPoints = points - rewardPoints;

    try {
      // Update the user's points
      await http.put(`/reward/updatePoints/${id}`, { totalPoints: newPoints });

      // Associate the user with the claimed reward
      await http.post('/reward/claim', { userId: id, rewardId });

      setPoints(newPoints);
      setUser(prevUser => ({
        ...prevUser,
        totalPoints: newPoints
      }));
      setClaimedRewards([...claimedRewards, rewardId]); // NEW: Track claimed rewards
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
    updateMembershipType(newTier); // Update membership type whenever the tier changes
  }, [points]);

  useEffect(() => {
    const fetchPoints = async () => {
      if (localStorage.getItem("accessToken")) {
        try {
          const res = await http.get(`/reward/Membership/${id}`); // Ensure this endpoint matches the backend route
          setUser(res.data.user);
          
          const actualPoints = res.data.user.totalPoints;
          const testPoints = 50001;

          // Use actual points or testing points based on the toggle
          const pointsToUse = USE_TESTING_POINTS ? testPoints : actualPoints;
          setPoints(pointsToUse);

          const initialTier = calculateUserTier(pointsToUse);
          setUserTier(initialTier);
          updateMembershipType(initialTier);
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
      return '#cd7f32'; // Bronze color
    } else if (points <= 80000) {
      return '#c0c0c0'; // Silver color
    } else {
      return '#ffd700'; // Gold color
    }
  };

  const percentage = (points / maxPoints) * 100;

  const getNextLevelInfo = (points) => {
    if (points < 50000) {
      return `${points}... ${50000 - points} more points to reach Silver!`;
    } else if (points < 80000) {
      return ` ${points}... ${80000 - points} more points to reach Gold!`;
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
        console.error(error); // Log error if fetching rewards fails
      }
    };

    getInitialRewards();
  }, []); // Empty dependency array fetches on mount

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
    <UserContext.Provider value={{ user, setUser }}>
      <Box>
        <div>You are currently a {userTier} member</div>
        {user && (
          <>
            <Typography sx={{ marginLeft: 1 }}>{user.firstName} {user.lastName}</Typography>
            <Typography>{user.totalPoints}</Typography>
            <Typography>Membership Type: {user.membershipType}</Typography> {/* Display membership type */}
          </>
        )}
        <div style={{ width: 250, height: 250, margin: '-100px 0px 1000px 800px' }}>
          <CircularProgressbar
            value={percentage}
            text={`${points} points`}
            styles={buildStyles({
              pathColor: getProgressColor(points),
              textColor: '#000',
              trailColor: '#d6d6d6',
              textSize: '12px',
            })}
          />
          <div className="progress-description">
            {getNextLevelInfo(points)}
          </div>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, marginTop: 5 }}>
            {rewardList.filter(reward => reward.Tier === userTier).map((reward) => {
              const isClaimable = canClaimReward(reward.Tier, reward.Points);
              return (
                <Paper key={reward.id} elevation={3} sx={{ padding: 2, width: '600px', textAlign: 'center' }}>
                  <Typography variant="h5">{reward.rewardName} <span style={{ marginLeft: '100px' }}>{reward.description}</span> <span style={{ marginLeft: '100px' }}><Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleClaim(reward.id, reward.Points)} // UPDATED: Pass rewardId and rewardPoints
                    disabled={!isClaimable || claimedRewards.includes(reward.id)} // NEW: Disable button if reward is claimed
                    sx={{
                      backgroundColor: isClaimable ? 'green' : 'grey',
                      '&:hover': { backgroundColor: isClaimable ? 'darkgreen' : 'grey' }
                    }}
                  >
                    Claim
                  </Button></span></Typography>
                  <Typography variant="body1">Points: {reward.Points}</Typography>
                  <Typography variant="body2">Tier: {reward.Tier}</Typography>
                </Paper>
              );
            })}
          </Box>
          <Box sx={{ marginTop: 5 }}>
            <Typography variant="h6">Claimed Rewards:</Typography>
            {claimedRewards.map(rewardId => {
              const reward = rewardList.find(r => r.id === rewardId);
              return (
                <Typography key={rewardId} variant="body1">
                  {reward.rewardName} - {reward.description}
                </Typography>
              );
            })}
          </Box>
        </div>
      </Box>
    </UserContext.Provider>
  );
}

export default ClaimRewards;
