import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  TextField,
  Box,
  Paper,
  IconButton,
  Slider,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import http from "../http";
import UserContext from "../contexts/UserContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FeedbackDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [feedback, setFeedback] = useState(null);
  const [userId, setUserId] = useState("");
  const [eventId, setEventId] = useState(5);
  const [content, setContent] = useState("");
  const [response, setResponse] = useState("");
  const [imageFile, setImageFile] = useState("");

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await http.get(`/feedback/${id}`);
        setFeedback(res.data);
        setUserId(res.data.userId);
        setEventId(res.data.eventId);
        setContent(res.data.content);
        setResponse(res.data.response || "");
        setImageFile(res.data.imageFile);
      } catch (error) {
        console.error("Failed to fetch feedback:", error);
      }
    };

    fetchFeedback();
  }, [id]);

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
        .post("/file/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          setImageFile(res.data.filename);
        })
        .catch((error) => {
          console.log(error.response);
        });
    }
  };

  const handleUpdate = async () => {
    try {
      await http.put(`/feedback/${id}`, {
        userId,
        eventId,
        content,
        response,
        imageFile,
      });
      alert("Feedback updated successfully");
      navigate("/feedbacklist", { replace: true });
    } catch (error) {
      console.error("Failed to update feedback:", error);
      alert("Failed to update feedback");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        await http.delete(`/feedback/${id}`, { data: { userId: user.id } });
        alert("Feedback deleted successfully");
        navigate("/feedbacklist", { replace: true });
      } catch (error) {
        console.error("Failed to delete feedback:", error);
        alert("Failed to delete feedback");
      }
    }
  };

  if (!feedback) {
    return <Typography>Loading...</Typography>;
  }

  const isEditable = userId === user.id || user.id === 1;

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
            <Paper elevation={3} sx={{ padding: '20px', maxWidth: '600px', width: '100%', position: 'relative', borderRadius: '12px' }}>
                <IconButton
                    color="secondary"
                    sx={{ position: 'absolute', top: '8px', right: '8px', bgcolor: 'rgba(255,255,255,0.8)', borderRadius: '50%' }}
                    onClick={() => navigate('/feedbacklist')}
                >
                    <Close />
                </IconButton>
                <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', color: '#b71c1c' }}>
                    Feedback Detail
                </Typography>
                <form>
                    <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: '8px', mb: 2 }}>
                        <Typography gutterBottom>Rating (1 to 10)</Typography>
                        <Slider
                            value={eventId}
                            onChange={(e, value) => setEventId(value)}
                            aria-labelledby="rating-slider"
                            valueLabelDisplay="auto"
                            step={1}
                            marks
                            min={1}
                            max={10}
                            sx={{ color: '#b71c1c' }}
                            disabled={!isEditable}
                        />
                    </Box>
                    <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: '8px', mb: 2 }}>
                        <Typography gutterBottom>Feedback</Typography>
                        <TextField
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            fullWidth
                            required
                            multiline
                            rows={4}
                            variant="outlined"
                            margin="normal"
                            disabled={!isEditable}
                            sx={{ backgroundColor: '#fff', borderRadius: '4px' }}
                        />
                    </Box>
                    <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: '8px', mb: 2 }}>
                        <Typography gutterBottom>Response (reason for changing feedback)</Typography>
                        <TextField
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            margin="normal"
                            disabled={!isEditable}
                            sx={{ backgroundColor: '#fff', borderRadius: '4px' }}
                        />
                    </Box>
                    {imageFile && (
                        <Box sx={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                            <img src={`${import.meta.env.VITE_FILE_BASE_URL}${feedback.imageFile}`} alt="feedback" style={{ maxWidth: '100%', borderRadius: '8px' }} />
                        </Box>
                    )}
                    {isEditable && (
                        <>
                            {/* <Button variant="contained" component="label" sx={{ marginTop: '20px' }}>
                                Upload Image
                                <input hidden accept="image/*" type="file" onChange={onFileChange} />
                            </Button> */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "20px",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdate}
                >
                  Update Feedback
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleDelete}
                >
                  Delete Feedback
                </Button>
              </Box>
            </>
          )}
        </form>
      </Paper>
    </Box>
  );
};

export default FeedbackDetail;
