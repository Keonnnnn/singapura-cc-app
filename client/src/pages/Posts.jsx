import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  Edit,
  ThumbUp,
  Comment,
  Delete,
  ThumbUpAltOutlined,
} from "@mui/icons-material";
import http from "../http";
import dayjs from "dayjs";
import UserContext from "../contexts/UserContext";
import global from "../global";

function Posts() {
  const [postList, setPostList] = useState([]);
  const { user: loggedInUser } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState("all");
  const [userColors, setUserColors] = useState({});
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  useEffect(() => {
    if (user == null) {
      http.get(`/user/${loggedInUser.id}`).then((res) => {
        setUser(res.data);
      });
    }
  }, [user]);

  const getPosts = (filter = "all") => {
    http
      .get(`/post?filter=${filter}`)
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

  const handleFilterChange = (event) => {
    const newFilter = event.target.value;
    setFilter(newFilter);
    getPosts(newFilter);
  };

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
        getPosts(filter); // Refresh posts after liking
      })
      .catch((err) => {
        console.error("Error liking post:", err);
      });
  };

  const unlikePost = (postId) => {
    http
      .post(`/like/${postId}/unlike`)
      .then(() => {
        getPosts(filter); // Refresh posts after unliking
      })
      .catch((err) => {
        console.error("Error unliking post:", err);
      });
  };

  const handleOpen = (postId) => {
    setSelectedPostId(postId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPostId(null);
  };

  const handleDeletePost = () => {
    if (selectedPostId) {
      http
        .delete(`/post/${selectedPostId}`)
        .then(() => {
          getPosts(filter); // Refresh posts after deleting
          handleClose();
        })
        .catch((err) => {
          console.error("Error deleting post:", err);
        });
    }
  };

  return (
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
              <Avatar
                component={Link}
                src={user?.pfpURL || ""}
                to={`/profile/${user.id}`}
                sx={{
                  bgcolor: getUserColor(user.id),
                  mr: 2,
                  textDecoration: "none",
                }}
              >
                {user.firstName.charAt(0).toUpperCase()}
              </Avatar>
              <Box
                component={Link}
                to={`/profile/${user.id}`}
                sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  @{user.username}
                </Typography>
              </Box>
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
            onChange={handleFilterChange}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="all">
              <ListItemText primary="All Posts" />
            </MenuItem>
            <MenuItem value="following">
              <ListItemText primary="Following" />
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
                <Avatar
                  component={Link}
                  src={post.user?.pfpURL}
                  to={`/profile/${post.userId}`}
                  sx={{
                    bgcolor: getUserColor(post.userId),
                    mr: 2,
                    textDecoration: "none",
                  }}
                >
                  {post.user?.firstName.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    component={Link}
                    to={`/profile/${post.userId}`}
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    {post.user?.username}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {dayjs(post.createdAt).format(global.datetimeFormat)}
                  </Typography>
                </Box>
                {user && (user.id === post.userId || user.role === "Admin") && (
                  <>
                    <Link to={`/editpost/${post.id}`}>
                      <IconButton color="primary" sx={{ padding: "4px" }}>
                        <Edit />
                      </IconButton>
                    </Link>
                    <IconButton
                      color="secondary"
                      sx={{ padding: "4px" }}
                      onClick={() => handleOpen(post.id)}
                    >
                      <Delete />
                    </IconButton>
                  </>
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
                    onClick={() =>
                      post.Likes.some((like) => like.userId === user.id)
                        ? unlikePost(post.id)
                        : likePost(post.id)
                    }
                  >
                    {post.Likes.some((like) => like.userId === user.id) ? (
                      <ThumbUp />
                    ) : (
                      <ThumbUpAltOutlined />
                    )}
                  </IconButton>
                  <Typography variant="body2">
                    {post.Likes.length || 0} Likes
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    color="primary"
                    sx={{ padding: "4px", mr: 1 }}
                    onClick={() => navigate(`/comments/${post.id}`)}
                  >
                    <Comment />
                  </IconButton>
                  <Typography variant="body2">
                    {post.Comments?.length || 0} Comments
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeletePost} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Posts;
