import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Typography,
  FormControl,
  FormHelperText,
} from "@mui/material";
import ecorun from "../assets/ecorun.png";
import http from '../http'


// {
//   const [FeedbackList, setFeedbacklist] = useState([])
//   useEffect(() => {
//       http.get('/Feedback').then((res) => {
//           console.log(res.data);
//           setEventList(res.data);
//       });
//   }, []);

const FeedbackForm = () => {
    const [userId, setUserId] = useState('');
    const [eventId, setEventId] = useState('');
    const [content, setContent] = useState('');
    const [userIdError, setUserIdError] = useState('');
    const [eventIdError, setEventIdError] = useState('');
    const [contentError, setContentError] = useState('');
    
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      // Check if any field is empty
      if (!userId) setUserIdError("Please fill in this field");
      if (!eventId) setEventIdError("Please fill in this field");
      if (!content) setContentError("Please fill in this field");
  
      // If there are errors, do not proceed with the submission
      if (
        !userId ||
        !eventId ||
        !content ||
        userIdError ||
        eventIdError ||
        contentError
      ) {
        return;
      }
  
       
        // http.post('/feedbackController',{
        //   userId: parseInt(userId),
        //   eventId: parseInt(eventId),
        //   content,
        // } ).then((res)=> {
        //   if (response.status === 201) {
        //     setUserId('');
        //     setEventId('');
        //     setContent('');
        //     alert('Feedback submitted successfully');
        //   } else {
        //     alert('Failed to submit feedback');
        //   }
          

        // } )
        const response = await axios.post("http://localhost:3001/feedback", {
          userId: parseInt(userId),
          eventId: parseInt(eventId),
          content,
        });
        if (response.status === 201) {
          setUserId('');
          setEventId('');
          setContent('');
          alert('Feedback submitted successfully');
        } else {
          alert('Failed to submit feedback');
        }
      
    };
  
    const handleUserIdChange = (e) => {
      const value = e.target.value;
      setUserId(value);
      if (/^\d*$/.test(value)) {
        setUserIdError('');
      } else {
        setUserIdError('User ID must be a number.');
      }
    };
  
    const handleEventIdChange = (e) => {
      const value = e.target.value;
      setEventId(value);
      if (/^\d*$/.test(value) && parseInt(value) >= 1 && parseInt(value) <= 10) {
        setEventIdError('');
      } else {
        setEventIdError('Rating must be a number between 1 and 10.');
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
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
        <div
          style={{
            padding: '20px',
            maxWidth: '600px',
            width: '100%',
            position: 'relative',
            borderRadius: '12px',
            border: '1px solid #ddd',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <button
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              backgroundColor: 'rgba(255,255,255,0.8)',
              borderRadius: '50%',
              border: 'none',
            }}
            onClick={() => {
              setUserId('');
              setEventId('');
              setContent('');
            }}
          >
            &times;
          </button>
  
          <h5 style={{ flex: 1, marginBottom: '10px' }}>Feedback Submission</h5>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                overflow: 'hidden',
                borderRadius: '50%',
                marginRight: '12px',
                backgroundColor: '#b71c1c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#ffffff',
              }}
            >
              {userId ? userId.charAt(0) : 'U'}
            </div>
            <div>
              <img src={ecorun} width={480} alt="img" />
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="User ID"
              value={userId}
              onChange={handleUserIdChange}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
              }}
            />
            {userIdError && <small style={{ color: 'red' }}>{userIdError}</small>}
            <input
              type="text"
              placeholder="Rating (1 to 10)*"
              value={eventId}
              onChange={handleEventIdChange}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
              }}
            />
            {eventIdError && <small style={{ color: 'red' }}>{eventIdError}</small>}
            <textarea
              placeholder="How was the Event?"
              value={content}
              onChange={handleContentChange}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
              }}
              rows="4"
            ></textarea>
            {contentError && <small style={{ color: 'red' }}>{contentError}</small>}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '24px',
                backgroundColor: '#b71c1c',
                color: 'white',
                border: 'none',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Submit Feedback
            </button>
          </form>
        </div>
      </div>
    );
  };
  
  export default FeedbackForm;