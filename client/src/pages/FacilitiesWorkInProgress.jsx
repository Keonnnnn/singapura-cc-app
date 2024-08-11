import React from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  Grid,
  CircularProgress,
  Paper,
} from "@mui/material";
import { Construction, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const FacilitiesWorkInProgress = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f4f4f9",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: 6,
            borderRadius: "20px",
            textAlign: "center",
            backgroundColor: "#ffffff",
          }}
        >
          <Grid
            container
            spacing={3}
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item>
              <CircularProgress size={90} />
            </Grid>
            <Grid item>
              <Typography
                variant="h4"
                color="primary"
                sx={{ fontWeight: "bold" }}
              >
                Facilities Page
              </Typography>
              <Typography
                variant="h6"
                color="secondary"
                sx={{ mt: 2, fontWeight: "bold" }}
              >
                Work in Progress
              </Typography>
              <Typography
                variant="body1"
                color="textSecondary"
                sx={{ mt: 2, mb: 4 }}
              >
                We’re working hard to bring you a great experience. Stay tuned!
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<ArrowBack />}
                sx={{
                  mt: 3,
                  borderRadius: "8px",
                  textTransform: "none",
                  px: 4,
                  py: 1,
                  fontSize: "16px",
                }}
                onClick={handleBackClick}
              >
                Go Back
              </Button>
            </Grid>
          </Grid>
          <Box mt={5}>
            <Construction fontSize="large" color="action" />
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ mt: 1, fontWeight: "bold" }}
            >
              Under Construction
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default FacilitiesWorkInProgress;
