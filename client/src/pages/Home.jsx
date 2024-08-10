import React from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import backgroundImage from '../assets/backgroundImage.jpg';
import singaImage from '../assets/singaLion.png'; 

function Home() {
  return (
    <div>
      {/* Welcome Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={3} alignItems="center">
          {/* Image Section */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: { xs: 220, md: 400 },
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 2,
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)', 
              }}
            />
          </Grid>

          {/* Text Section */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                color: '#e2160f',
              }}
            >
              Welcome to Singapura Community Club!
            </Typography>

            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{ fontStyle: 'italic', color: '#333' }}
            >
              Where empowering Singaporeans through vibrant community connections is at the heart of everything we do.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mt: 2,
                lineHeight: 1.7,
                color: '#555',
              }}
            >
              At Singapura Community Club, we bring Singaporeans together to connect, learn, and grow. Our vibrant community is built on shared values of sustainability and togetherness.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mt: 2,
                lineHeight: 1.7,
                color: '#555',
              }}
            >
              Join us to make a difference, forge new friendships, and contribute to a greener future.
            </Typography>

            
          </Grid>
        </Grid>
      </Container>

      {/* Meet Our Mascot Section */}
      <Box sx={{ backgroundColor: '#f9f9f9', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: '#e2160f',
              textAlign: 'center',
              mb: 3,
            }}
          >
            Meet Our Mascot: Singa the Lion
          </Typography>
          <Grid container spacing={3} alignItems="center">
            {/* Singa Image */}
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  height: { xs: 180, md: 280 }, // Adjusted height to make Singa's image smaller
                  backgroundImage: `url(${singaImage})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  borderRadius: 2,
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              />
            </Grid>

            {/* Singa Description */}
            <Grid item xs={12} md={7}>
              <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.7 }}>
                Singa the Lion, our beloved mascot, has been a symbol of kindness and community spirit in Singapore since 1982. Originally created for the National Courtesy Campaign, Singa encourages everyone to be considerate and caring. At Singapura Community Club, Singa embodies the warmth and togetherness that we strive to promote every day. 
              </Typography>

              <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.7, mt: 2 }}>
                Come meet Singa and be inspired to spread kindness and build a more connected community!
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  );
}

export default Home;
