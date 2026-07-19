import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Chip,
  Button,
} from "@mui/material";
import http from "../http";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserSidebar from "../components/UserSidebar";
import { useNavigate } from "react-router-dom";

function UserRegistrationHistory() {
  const [registrations, setRegistrations] = useState([]);
  const token = localStorage.getItem("accessToken");
  const userId = token ? JSON.parse(atob(token.split(".")[1])).id : null;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await http.get(
          `/events/user/${userId}/registrations`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRegistrations(response.data);
      } catch (error) {
        toast.error("Failed to fetch registration history");
        console.error("Failed to fetch registrations:", error);
      }
    };

    fetchRegistrations();
  }, [token, userId]);

    return (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'center', md: 'flex-start' }, justifyContent: 'center', mt: 4, gap: 5 }}>
            <UserSidebar />
            <Paper elevation={3} sx={{ p: 3, borderRadius: '12px', minHeight: '400px',maxWidth: 800,
            width: "100%", minWidth: 0 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', color: '#e2160f', mb: 4 }}>
                    My Event Registration History
                </Typography>

        {registrations.length === 0 ? (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: "center", mt: 5 }}
          >
            Looks like you haven&apos;t registered for any events yet...
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {registrations.map((registration, index) => (
              <Grid item xs={12} key={index}>
                <Card
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    borderRadius: 2,
                  }}
                >
                  <Box
                    component="img"
                    src={`${import.meta.env.VITE_FILE_BASE_URL}${
                      registration.Event.imageFile
                    }`}
                    alt={registration.Event.name}
                    sx={{ width: 240, height: 200, mr: 2, borderRadius: 1 }}
                  />
                  <Box sx={{ flexGrow: 1, position: "relative" }}>
                    <CardContent sx={{ p: 0 }}>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {dayjs(registration.Event.date).format("DD MMM")}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {dayjs(registration.Event.startTime, "HH:mm").format(
                          "hh:mm A"
                        )}{" "}
                        -{" "}
                        {dayjs(registration.Event.endTime, "HH:mm").format(
                          "hh:mm A"
                        )}
                      </Typography>
                      <Chip
                        label={registration.Event.type}
                        sx={{
                          mt: 1,
                          mb: 1,
                          bgcolor: "primary.light",
                          color: "white",
                        }}
                      />
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{ fontWeight: "bold", mb: 1 }}
                      >
                        {registration.Event.name}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {registration.Event.description}
                      </Typography>
                      <Typography
                        variant="body2"
                        color={registration.present ? "green" : "red"}
                      >
                        {registration.present ? "Attended" : "Did not attend"}
                      </Typography>
                      {registration.present && (
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ mt: 2 }}
                          onClick={() => navigate(`/feedbackform`)}
                        >
                          Leave Feedback
                        </Button>
                      )}
                    </CardContent>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Box>
  );
}

export default UserRegistrationHistory;
