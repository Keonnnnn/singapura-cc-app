import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import '../claimRewards.css';
import { Paper, Box, Typography, Button } from '@mui/material';
import http from '../http';

function ClaimRewards() {
  const [points, setPoints] = useState(70000); // Example points, replace with dynamic value
  const [userTier, setUserTier] = useState('');
  const maxPoints = 100000;

  const handleClaim = (rewardPoints) => {
    setPoints(points - rewardPoints);
  }

  const canClaimReward = (rewardTier, rewardPoints) => {
    return userTier === rewardTier && points >= rewardPoints;
  }

  useEffect(() => {
    const calculateUserTier = (points) => {
      if (points <= 50000) {
        return 'Bronze';
      } else if (points <= 80000) {
        return 'Silver';
      } else {
        return 'Gold';
      }
    };

    setUserTier(calculateUserTier(points));
  }, [points]);

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

  const [rewardList, setRewardList] = useState([]);


  useEffect(() => {
    const getInitialRewards = async () => {
      const response = await http.get('/reward');
      setRewardList(response.data);
    };

    getInitialRewards();
  }, []); // Empty dependency array fetches on mount



  return (
    <Box>
      <div>You are currently a {userTier} member</div>
      <div style={{ width: 250, height: 250, margin: '-100px 0px 1000px 800px', }}>
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
                  onClick={() => handleClaim(reward.Points)}
                  disabled={!isClaimable}
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
      </div>
    </Box>
  );
}

export default ClaimRewards;
