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
} from "@mui/material";
import ecorun from "../assets/ecorun.png";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../contexts/UserContext'

const FeedbackForm = () => {
  const [userId, setUserId] = useState('');
  const [eventId, setEventId] = useState(5);
  const [content, setContent] = useState('');
  const [contentError, setContentError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const { user } = useContext(UserContext);

  const onFileChange = (e) => {
    let file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error('Maximum file size is 1MB');
        return;
      }
      let formData = new FormData();
      formData.append('file', file);

      axios.post('http://localhost:3001/feedback/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then((res) => {
          setImageFile(res.data.filename);
        })
        .catch((error) => {
          console.log(error.response);
          toast.error('Failed to upload file');
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
      imageFile
    };

    try {
      const response = await axios.post("http://localhost:3001/feedback", feedbackData);
      if (response.status === 201) {
        setUserId('');
        setEventId(5);
        setContent('');
        setImageFile(null);
        alert('Feedback submitted successfully');
      } else {
        alert('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      alert('Failed to submit feedback');
    }
  };


  const handleContentChange = (e) => {
    const value = e.target.value;
    setContent(value);
    if (value) {
      setContentError('');
    } else {
      setContentError('Please fill in this field');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: '12px', width: '100%' }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', color: '#b71c1c' }}>
          Feedback Submission
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              width: '48px',
              height: '48px',
              overflow: 'hidden',
              borderRadius: '50%',
              mr: 2,
              backgroundColor: '#b71c1c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#ffffff',
            }}
          >
            
          </Box>
          <img src={ecorun} width={480} alt="Event" />
        </Box>
        <form onSubmit={handleSubmit}>
          
          <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: '8px', mb: 2 }}>
            <Typography gutterBottom>Rating* (1 to 10)</Typography>
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
            />
          </Box>
          <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: '8px', mb: 2 }}>
            <Typography gutterBottom>Feedback* </Typography>
            <TextField
              value={content}
              onChange={handleContentChange}
              fullWidth
              required
              multiline
              rows={4}
              error={!!contentError}
              helperText={contentError}
              sx={{ backgroundColor: '#fff', borderRadius: '4px' }}
            />
          </Box>
          <Button variant="contained" component="label">
            Upload Image
            <input hidden accept="image/*" type="file" onChange={onFileChange} />
          </Button>
          {imageFile && (
            <div className="aspect-ratio-container" style={{ marginTop: '10px' }}>
              <img alt="feedback" src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}>
              </img>
            </div>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, py: 1.5, borderRadius: '24px', backgroundColor: '#b71c1c', color: 'white', fontWeight: 'bold' }}
          >
            Submit Feedback
          </Button>
          <ToastContainer />
        </form>
      </Paper>
    </Container>
  );
};

export default FeedbackForm;





