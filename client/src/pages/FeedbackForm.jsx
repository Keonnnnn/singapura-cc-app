import React, { useState, useContext } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Typography,
  Slider,
  Box,
  Paper,
  Avatar,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserContext from "../contexts/UserContext";
import Sidebar from "../components/Sidebar";

const FeedbackForm = () => {
  const [eventId, setEventId] = useState(5);
  const [content, setContent] = useState("");
  const [contentError, setContentError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const { user } = useContext(UserContext);

  const onFileChange = (e) => {
    let file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error("Maximum file size is 1MB");
        return;
      }
      let formData = new FormData();
      formData.append("file", file);

      axios
        .post("http://localhost:3001/feedback/file/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          setImageFile(res.data.filename);
        })
        .catch((error) => {
          console.log(error.response);
          toast.error("Failed to upload file");
        });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content) setContentError("Please fill in this field");

    if (!content || contentError) {
      return;
    }

    const feedbackData = {
      userId: user.id,
      eventId,
      content,
      imageFile,
    };

    try {
      const response = await axios.post(
        "http://localhost:3001/feedback",
        feedbackData
      );
      if (response.status === 201) {
        setEventId(5);
        setContent("");
        setImageFile(null);
        toast.success("Feedback submitted successfully");
      } else {
        toast.error("Failed to submit feedback");
      }
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      toast.error("Failed to submit feedback");
    }
  };

  const handleContentChange = (e) => {
    const value = e.target.value;
    setContent(value);
    if (value) {
      setContentError("");
    } else {
      setContentError("Please fill in this field");
    }
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
        <Container
          maxWidth="sm"
          sx={{
            mt: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: "16px",
              width: "100%",
              backgroundColor: "#f7f7f7",
            }}
          >
            <Avatar
              sx={{
                bgcolor: "#b71c1c",
                color: "#fff",
                width: 56,
                height: 56,
                mb: 2,
                alignSelf: "center",
              }}
            >
              {user.firstName.charAt(0)}
            </Avatar>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ textAlign: "center", fontWeight: "bold", color: "#333" }}
            >
              Submit Your Feedback
            </Typography>
            <form onSubmit={handleSubmit}>
              <Box
                sx={{
                  backgroundColor: "#fff",
                  p: 3,
                  borderRadius: "8px",
                  mb: 3,
                }}
              >
                <Typography gutterBottom variant="subtitle1">
                  Rate the Event (1 to 10)
                </Typography>
                <Slider
                  value={eventId}
                  onChange={(e, value) => setEventId(value)}
                  aria-labelledby="rating-slider"
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={1}
                  max={10}
                  sx={{ color: "#b71c1c" }}
                />
              </Box>
              <Box
                sx={{
                  backgroundColor: "#fff",
                  p: 3,
                  borderRadius: "8px",
                  mb: 3,
                }}
              >
                <Typography gutterBottom variant="subtitle1">
                  Your Feedback
                </Typography>
                <TextField
                  value={content}
                  onChange={handleContentChange}
                  fullWidth
                  required
                  multiline
                  rows={4}
                  error={!!contentError}
                  helperText={contentError}
                  sx={{ backgroundColor: "#fff", borderRadius: "4px" }}
                />
              </Box>
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{
                  mb: 2,
                  py: 1.5,
                  borderRadius: "24px",
                  backgroundColor: "#b71c1c",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Upload Image
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={onFileChange}
                />
              </Button>
              {imageFile && (
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <img
                    alt="feedback"
                    src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "200px",
                      borderRadius: "8px",
                    }}
                  />
                </Box>
              )}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderRadius: "24px",
                  backgroundColor: "#b71c1c",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Submit Feedback
              </Button>
              <ToastContainer />
            </form>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default FeedbackForm;
