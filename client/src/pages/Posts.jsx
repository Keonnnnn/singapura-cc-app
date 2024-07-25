import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Avatar,
  Divider,
  TextField,
  MenuItem,
  ListItemText,
  Container,
} from "@mui/material";
import { Edit, ThumbUp, Comment, Save, ArrowBack } from "@mui/icons-material";
import http from "../http";
import dayjs from "dayjs";
import UserContext from "../contexts/UserContext";
import global from "../global";

function Posts() {
  const [postList, setPostList] = useState([]);
  const { user, setUser } = useContext(UserContext);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [filter, setFilter] = useState("all");
  const [userColors, setUserColors] = useState({});

  const getPosts = () => {
    http
      .get("/post")
      .then((res) => {
        setPostList(res.data);
        console.log("Fetched Posts: ", res.data);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
      });
  };

  useEffect(() => {
    getPosts();
  }, []);

  const getRandomColor = () => {
    const colors = [
      "#f44336",
      "#e91e63",
      "#9c27b0",
      "#673ab7",
      "#3f51b5",
      "#2196f3",
      "#03a9f4",
      "#00bcd4",
      "#009688",
      "#4caf50",
      "#8bc34a",
      "#cddc39",
      "#ffeb3b",
      "#ffc107",
      "#ff9800",
      "#ff5722",
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  const getUserColor = (userId) => {
    if (userColors[userId]) {
      return userColors[userId];
    } else {
      const color = getRandomColor();
      setUserColors((prevState) => ({
        ...prevState,
        [userId]: color,
      }));
      return color;
    }
  };

  const likePost = (postId) => {
    http
      .post(`/like/${postId}/like`)
      .then(() => {
        getPosts(); // Refresh posts after liking
      })
      .catch((err) => {
        console.error("Error liking post:", err);
      });
  };

  const unlikePost = (postId) => {
    http
      .post(`/like/${postId}/unlike`)
      .then(() => {
        getPosts(); // Refresh posts after unliking
      })
      .catch((err) => {
        console.error("Error unliking post:", err);
      });
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

  const handleSaveProfile = () => {
    console.log("Updating user profile with:", { username: newUsername }); // Log the data being sent

    http
      .put(`/user/${user.id}`, { username: newUsername })
      .then((res) => {
        console.log("Profile update response:", res.data); // Log the response
        setUser(res.data);
        setIsEditingProfile(false);
      })
      .catch((err) => {
        console.error("Error updating profile:", err); // Log the error
      });
  };

  const handleCancelEditProfile = () => {
    setNewUsername(user?.username || "");
    setIsEditingProfile(false);
  };

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          backgroundColor: "#f0f2f5",
          minHeight: "100vh",
          borderRadius: 2,
          boxShadow: 3,
          mt: 2,
        }}
      >
        <Box
          sx={{
            width: 300,
            padding: 3,
            backgroundColor: "#ffffff",
            borderRight: "1px solid #ddd",
            minHeight: "100vh",
            boxShadow: 3,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              fontSize: "1.5rem",
              fontWeight: "bold",
              fontStyle: "italic",
            }}
          >
            Connect
          </Typography>
          {user && (
            <Link to="/createpost">
              <Button
                variant="contained"
                fullWidth
                sx={{ mb: 2, backgroundColor: "#4caf50" }}
              >
                Post
              </Button>
            </Link>
          )}
          {user && (
            <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
              <CardContent sx={{ display: "flex", alignItems: "center" }}>
                <Avatar sx={{ bgcolor: getUserColor(user.id), mr: 2 }}>
                  {user.firstName.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  {isEditingProfile ? (
                    <>
                      <TextField
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        sx={{ mb: 1 }}
                      />
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton color="primary" onClick={handleSaveProfile}>
                          <Save />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={handleCancelEditProfile}
                        >
                          <ArrowBack />
                        </IconButton>
                      </Box>
                    </>
                  ) : (
                    <>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold" }}
                      >
                        {user.firstName} {user.lastName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        @{user.username}
                      </Typography>
                    </>
                  )}
                </Box>
                {!isEditingProfile && (
                  <IconButton color="primary" onClick={handleEditProfile}>
                    <Edit />
                  </IconButton>
                )}
              </CardContent>
            </Card>
          )}
          <Divider />
          <Box sx={{ mt: 3 }}>
            <TextField
              select
              fullWidth
              variant="outlined"
              label="Filter by"
              size="small"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="all">
                <ListItemText primary="All Posts" />
              </MenuItem>
              <MenuItem value="friends">
                <ListItemText primary="Friends' Posts" />
              </MenuItem>
            </TextField>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1, padding: 3, marginLeft: 3 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Latest Events
          </Typography>
          {postList.map((post) => (
            <Card
              key={post.id}
              sx={{
                mb: 3,
                boxShadow: 3,
                borderRadius: 2,
                padding: 2,
                border: "1px solid #ddd",
                backgroundColor: "white",
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar sx={{ bgcolor: getUserColor(post.userId), mr: 2 }}>
                    {post.user?.firstName.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      {post.user?.firstName} {post.user?.lastName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {dayjs(post.createdAt).format(global.datetimeFormat)}
                    </Typography>
                  </Box>
                  {user && user.id === post.userId && (
                    <Link to={`/editpost/${post.id}`}>
                      <IconButton color="primary" sx={{ padding: "4px" }}>
                        <Edit />
                      </IconButton>
                    </Link>
                  )}
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                  {post.title}
                </Typography>
                {post.imageFile && (
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: 0,
                      paddingBottom: "56.25%",
                      mb: 2,
                      overflow: "hidden",
                      borderRadius: 2,
                      boxShadow: 2,
                    }}
                  >
                    <img
                      src={`${import.meta.env.VITE_FILE_BASE_URL}${
                        post.imageFile
                      }`}
                      alt="post"
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                )}
                <Typography
                  variant="body1"
                  sx={{ whiteSpace: "pre-wrap", mb: 2 }}
                >
                  {post.description}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                      color="primary"
                      sx={{ padding: "4px", mr: 1 }}
                      onClick={() => {
                        post.Likes.some((like) => like.userId === user.id)
                          ? unlikePost(post.id)
                          : likePost(post.id);
                      }}
                    >
                      <ThumbUp />
                    </IconButton>
                    <Typography variant="body2">
                      {post.Likes.length || 0} Likes
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton color="primary" sx={{ padding: "4px", mr: 1 }}>
                      <Comment />
                    </IconButton>
                    <Typography variant="body2">
                      {post.comments?.length || 0} Comments
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Container>
  );
}

export default Posts;
