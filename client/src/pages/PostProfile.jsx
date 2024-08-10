import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Divider,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Grid,
} from "@mui/material";
import {
  ArrowBack,
  Edit,
  Save,
  Delete,
  Close,
  PersonAdd,
  PersonRemove,
} from "@mui/icons-material";
import http from "../http";
import UserContext from "../contexts/UserContext";
import dayjs from "dayjs";
import global from "../global";

function PostProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [profileUser, setProfileUser] = useState(null);
  const [postList, setPostList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchUserProfile(userId);
      fetchUserPosts(userId);
      fetchFollowers(userId);
      fetchFollowing(userId);
      checkIfFollowing(userId);
    }
  }, [userId, isFollowing]);

  const fetchUserProfile = async (id) => {
    try {
      const res = await http.get(`/user/${id}`);
      setProfileUser(res.data);
      setNewUsername(res.data.username || "");
      setNewDescription(res.data.profileDescription || "");
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const fetchUserPosts = async (id) => {
    try {
      const res = await http.get(`/post?userId=${id}`);
      setPostList(res.data);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  const fetchFollowers = async (id) => {
    try {
      const res = await http.get(`/user/${id}/followers`);
      setFollowers(res.data);
    } catch (error) {
      console.error("Error fetching followers:", error);
    }
  };

  const fetchFollowing = async (id) => {
    try {
      const res = await http.get(`/user/${id}/following`);
      setFollowing(res.data);
    } catch (error) {
      console.error("Error fetching following:", error);
    }
  };

  const checkIfFollowing = async (id) => {
    try {
      const res = await http.get(`/user/${user.id}/following`);
      const followingIds = res.data.map((user) => user.id);
      setIsFollowing(followingIds.includes(parseInt(id)));
    } catch (error) {
      console.error("Error checking following status:", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    http
      .put(`/user/${profileUser.id}`, {
        username: newUsername,
        profileDescription: newDescription,
      })
      .then((res) => {
        setProfileUser(res.data);
        setUser(res.data); // Update user context if the logged-in user is editing their own profile
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Failed to update profile:", error);
      });
  };

  const handleOpen = (post) => {
    setSelectedPost(post);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPost(null);
  };

  const deletePost = () => {
    http
      .delete(`/post/${selectedPost.id}`)
      .then((res) => {
        fetchUserPosts(userId);
        handleClose();
      })
      .catch((error) => {
        console.error("Failed to delete post:", error);
      });
  };

  const handleFollow = () => {
    http
      .post(`/user/${profileUser.id}/follow`)
      .then(() => {
        setIsFollowing(true);
        fetchFollowers(profileUser.id);
      })
      .catch((error) => {
        console.error("Failed to follow user:", error);
      });
  };

  const handleUnfollow = () => {
    http
      .delete(`/user/${profileUser.id}/unfollow`)
      .then(() => {
        setIsFollowing(false);
        fetchFollowers(profileUser.id);
      })
      .catch((error) => {
        console.error("Failed to unfollow user:", error);
      });
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        variant="outlined"
        sx={{ mb: 3 }}
      >
        Back
      </Button>
      {profileUser && (
        <Box
          sx={{
            mb: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{ bgcolor: "#2196f3", width: 100, height: 100, mb: 2 }}
            src={profileUser?.pfpURL || ""}
          >
            {profileUser.firstName.charAt(0).toUpperCase()}
          </Avatar>
          {isEditing ? (
            <>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                sx={{ mb: 1, maxWidth: 300 }}
              />
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                sx={{ mb: 1, maxWidth: 300 }}
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<Save />}
                onClick={handleSave}
                sx={{ mb: 2 }}
              >
                Save
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {profileUser.firstName} {profileUser.lastName}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                @{profileUser.username}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {followers.length} Followers | {following.length} Following
              </Typography>
              <Typography variant="body2" sx={{ mt: 2, mb: 2 }}>
                {profileUser.profileDescription}
              </Typography>
              {user && user.id === profileUser.id && (
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={handleEdit}
                  sx={{ mb: 2 }}
                >
                  Edit Profile
                </Button>
              )}
              {user &&
                user.id !== profileUser.id &&
                (isFollowing ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<PersonRemove />}
                    onClick={handleUnfollow}
                  >
                    Unfollow
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PersonAdd />}
                    onClick={handleFollow}
                  >
                    Follow
                  </Button>
                ))}
            </>
          )}
        </Box>
      )}
      <Divider sx={{ mb: 3 }} />
      <Typography variant="h5" sx={{ mb: 3 }}>
        Posts
      </Typography>
      <Grid container spacing={2}>
        {postList.map((post) => (
          <Grid item xs={6} sm={4} md={3} key={post.id}>
            <Card sx={{ cursor: "pointer" }} onClick={() => handleOpen(post)}>
              {post.imageFile && (
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    paddingBottom: "100%",
                    overflow: "hidden",
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
            </Card>
          </Grid>
        ))}
      </Grid>
      {selectedPost && (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
          <DialogTitle>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography>Post Details</Typography>
              <IconButton onClick={handleClose}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                sx={{ bgcolor: "#2196f3", mr: 2 }}
                src={selectedPost.user?.pfpURL || ""}
              >
                {selectedPost.user?.firstName.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {selectedPost.user?.username}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {dayjs(selectedPost.createdAt).format(global.datetimeFormat)}
                </Typography>
              </Box>
              {user &&
                (user.id === selectedPost.userId || user.role === "Admin") && (
                  <>
                    <Link
                      to={`/editpost/${selectedPost.id}`}
                      state={{ redirectTo: `/profile/${userId}` }}
                    >
                      <IconButton color="primary" sx={{ padding: "4px" }}>
                        <Edit />
                      </IconButton>
                    </Link>
                    <IconButton
                      color="secondary"
                      sx={{ padding: "4px" }}
                      onClick={() => handleOpen(selectedPost)}
                    >
                      <Delete />
                    </IconButton>
                  </>
                )}
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              {selectedPost.title}
            </Typography>
            {selectedPost.imageFile && (
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  paddingBottom: "56.25%",
                  mb: 2,
                  overflow: "hidden",
                  borderRadius: 2,
                  boxShadow: 2,
                }}
              >
                <img
                  src={`${import.meta.env.VITE_FILE_BASE_URL}${
                    selectedPost.imageFile
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
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", mb: 2 }}>
              {selectedPost.description}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="contained" color="inherit">
              Cancel
            </Button>
            {user &&
              (user.id === selectedPost.userId || user.role === "Admin") && (
                <Button onClick={deletePost} variant="contained" color="error">
                  Delete
                </Button>
              )}
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}

export default PostProfile;
