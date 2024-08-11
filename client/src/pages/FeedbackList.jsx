import React, { useEffect, useState, useContext } from "react";
import http from "../http";
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  Divider,
  ListItemAvatar,
  Avatar,
  Box,
  IconButton,
  Tooltip,
  Badge,
} from "@mui/material";
import { Edit, Feedback, ThumbUp } from "@mui/icons-material";
import UserContext from "../contexts/UserContext";
import Sidebar from "../components/Sidebar";

const FeedbackList = () => {
  const { user } = useContext(UserContext);
  const [feedbackList, setFeedbackList] = useState([]);
  const [likedFeedbacks, setLikedFeedbacks] = useState(new Set());
  const [totalLikes, setTotalLikes] = useState(0);

  useEffect(() => {
    http.get("/feedback").then((res) => {
      console.log(res.data);
      setFeedbackList(res.data);
      calculateTotalLikes(res.data);
    });
  }, []);

  const calculateTotalLikes = (feedbacks) => {
    const userFeedbacks = feedbacks.filter(
      (feedback) => feedback.userId === user.id
    );
    const total = userFeedbacks.reduce(
      (acc, feedback) => acc + feedback.likes,
      0
    );
    setTotalLikes(total);
  };

  const handleLike = async (id) => {
    if (likedFeedbacks.has(id)) {
      setLikedFeedbacks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      setFeedbackList(
        feedbackList.map((feedback) =>
          feedback.id === id
            ? { ...feedback, likes: feedback.likes - 1 }
            : feedback
        )
      );
      try {
        await http.put(`/feedback/unlike/${id}`);
      } catch (error) {
        console.error("Failed to unlike feedback:", error);
      }
    } else {
      setLikedFeedbacks((prev) => new Set(prev.add(id)));
      setFeedbackList(
        feedbackList.map((feedback) =>
          feedback.id === id
            ? { ...feedback, likes: feedback.likes + 1 }
            : feedback
        )
      );
      try {
        await http.put(`/feedback/like/${id}`);
      } catch (error) {
        console.error("Failed to like feedback:", error);
      }
    }
    calculateTotalLikes(feedbackList); // Recalculate total likes
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        bgcolor: "background.default",
        display: "flex",
      }}
    >
      {user && user.role != "Customer" ? <Sidebar /> : null}
      <Box
        sx={{
          p: 7.5,
          width: "100%",
          minHeight: "100vh",
          overflowY: "auto",
        }}
      >
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Paper
            elevation={3}
            sx={{ p: 3, borderRadius: "12px", position: "relative" }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <Badge
                badgeContent={feedbackList.length}
                color="primary"
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <Feedback color="action" />
              </Badge>
              <Badge
                badgeContent={totalLikes}
                color="secondary"
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                sx={{ mt: 2 }}
              >
                <ThumbUp color="action" />
              </Badge>
            </Box>
            <Typography
              variant="h4"
              gutterBottom
              align="center"
              sx={{ mb: 4, fontWeight: "bold", color: "#000" }}
            >
              Feedback List
            </Typography>
            {feedbackList.length === 0 ? (
              <Typography align="center" sx={{ color: "#757575" }}>
                No feedback available
              </Typography>
            ) : (
              <List>
                {feedbackList.map((feedback) => (
                  <React.Fragment key={feedback.id}>
                    <ListItem
                      sx={{
                        mb: 2,
                        backgroundColor: "#f5f5f5",
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexGrow: 1,
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: "#b71c1c", color: "#fff" }}>
                            <Box
                              component="a"
                              href={`/feedback/${feedback.id}`}
                              sx={{ textDecoration: "none", color: "#fff" }}
                            >
                              {feedback.userId}
                            </Box>
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: "bold", fontSize: "1rem" }}
                            >
                              {feedback.content}
                            </Typography>
                          }
                          secondary={
                            <Box
                              component="span"
                              sx={{ display: "flex", flexDirection: "column" }}
                            >
                              <Typography variant="body2" color="textSecondary">
                                Rating: {feedback.eventId}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Likes: {feedback.likes}
                              </Typography>
                            </Box>
                          }
                        />
                      </Box>
                      {feedback.imageFile && (
                        <Box
                          sx={{
                            width: 150,
                            height: 100,
                            overflow: "hidden",
                            borderRadius: "8px",
                            ml: 2,
                          }}
                        >
                          <img
                            alt="feedback"
                            src={`${import.meta.env.VITE_FILE_BASE_URL}${
                              feedback.imageFile
                            }`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </Box>
                      )}
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Tooltip title="Like Feedback">
                          <IconButton
                            color={
                              likedFeedbacks.has(feedback.id)
                                ? "error"
                                : "default"
                            }
                            onClick={() => handleLike(feedback.id)}
                          >
                            <ThumbUp />
                          </IconButton>
                        </Tooltip>
                        {(feedback.userId === user.id || user.id === 1) && (
                          <Tooltip title="Edit Feedback">
                            <IconButton
                              color="primary"
                              component="a"
                              href={`/feedback/${feedback.id}`}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default FeedbackList;
