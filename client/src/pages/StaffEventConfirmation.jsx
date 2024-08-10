import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  Grid,
} from "@mui/material";
import http from "../http";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function StaffEventConfirmation() {
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http
      .get(`/events/${eventId}/registrations`)
      .then((res) => {
        setRegistrations(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch registrations", err);
        toast.error("Failed to fetch registrations");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [eventId]);

  const markAsPresent = (userId) => {
    http
      .post(
        `/events/${eventId}/mark-present`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure token is sent with the request
          },
        }
      )
      .then((res) => {
        toast.success(res.data.message);
        setRegistrations(
          registrations.map((reg) =>
            reg.userId === userId ? { ...reg, present: true } : reg
          )
        );
      })
      .catch((err) => {
        console.error("Failed to mark user as present", err);
        if (err.response && err.response.data && err.response.data.error) {
          toast.error(err.response.data.error);
        } else {
          toast.error(
            "An error occurred while marking user as present. Please try again."
          );
        }
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container component={Paper} sx={{ p: 4, mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
        Event Registrations
      </Typography>
      <List>
        {registrations.map((registration) => (
          <ListItem
            key={registration.userId}
            sx={{ mb: 2, borderBottom: "1px solid #ddd" }}
          >
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={8}>
                <ListItemText
                  primary={
                    <Typography variant="h6">{registration.name}</Typography>
                  }
                  secondary={
                    <Typography variant="body2">
                      {registration.email}
                    </Typography>
                  }
                />
                <Typography
                  variant="body2"
                  color={registration.present ? "green" : "red"}
                >
                  {registration.present ? "Present" : "Absent"}
                </Typography>
              </Grid>
              <Grid item xs={4} textAlign="right">
                {!registration.present && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => markAsPresent(registration.userId)}
                  >
                    Mark as Present
                  </Button>
                )}
              </Grid>
            </Grid>
          </ListItem>
        ))}
      </List>
      <Box textAlign="center" sx={{ mt: 4 }}>
        <Button variant="outlined" onClick={() => navigate("/events")}>
          Back to Events
        </Button>
      </Box>
    </Container>
  );
}

export default StaffEventConfirmation;
