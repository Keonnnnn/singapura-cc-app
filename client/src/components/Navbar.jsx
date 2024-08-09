import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Grid,
  IconButton,
  Menu,
  Divider,
  MenuItem,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../logo.png";
import UserContext from "../contexts/UserContext";
import http from "../http";  // Import the http module
import { formatDistanceToNow, parseISO } from 'date-fns';  // Import date-fns for formatting
import {
  Notifications as NotificationsIcon,
  Comment as CommentIcon,
  ThumbUp as ThumbUpIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";

const Navbar = () => {
  const { user } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElCustomer, setAnchorElCustomer] = useState(null);
  const [anchorElAdmin, setAnchorElAdmin] = useState(null);
  const [anchorElEvents, setAnchorElEvents] = useState(null); // Added for events dropdown

  const open = Boolean(anchorEl);
  const openCustomer = Boolean(anchorElCustomer);
  const openAdmin = Boolean(anchorElAdmin);
  const openEvents = Boolean(anchorElEvents); // Events dropdown state
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClickCustomer = (event) => {
    setAnchorElCustomer(event.currentTarget);
  };

  const handleClickAdmin = (event) => {
    setAnchorElAdmin(event.currentTarget);
  };

  const handleEventsClick = (event) => {
    setAnchorElEvents(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseCustomer = () => {
    setAnchorElCustomer(null);
  };

  const handleCloseAdmin = () => {
    setAnchorElAdmin(null);
  };

  const handleEventsClose = () => {
    setAnchorElEvents(null);
  };

  const getInitials = (firstName) => {
    if (!firstName) return "";
    return firstName.charAt(0).toUpperCase();
  };

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  const fetchNotifications = async () => {
    try {
      const [eventRes, socialRes] = await Promise.all([
        http.get("/notificationEvents"),
        http.get("/notifications"),
      ]);
      const eventNotifications = eventRes.data.map((n) => ({
        ...n,
        type: "event",
      }));
      const socialNotifications = socialRes.data.map((n) => ({
        ...n,
        type: n.type,
      }));
      const combinedNotifications = [...eventNotifications, ...socialNotifications].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      console.log("Fetched notifications:", combinedNotifications); // Debugging log
      setNotifications(combinedNotifications);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  const markAsRead = async (id, type) => {
    try {
      if (type === 'event') {
        await http.put(`/notificationEvents/${id}/read`);
      } else {
        await http.put(`/notifications/${id}/read`);
      }
      setNotifications(
        notifications.map((notification) =>
          notification.id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const formatNotificationTime = (timestamp) => {
    const date = parseISO(timestamp);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const isAdmin = user && (user.role === "Admin" || user.role === "Staff");

  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <ThumbUpIcon />;
      case "comment":
        return <CommentIcon />;
      case "follow":
        return <PersonAddIcon />;
      case "event":
        return <NotificationsIcon />;
      default:
        return <NotificationsIcon />;
    }
  };



  return (
    <AppBar
      position="static"
      className="AppBar"
      sx={{ backgroundColor: "#D22B2B" }}
    >
      <Container>
        <Toolbar disableGutters={true}>
          <Link to={isAdmin ? "/admin/dashboard" : "/"}>
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
              paddingTop={"10px"}
            >
              <Avatar src={logo} sx={{ width: 60, height: 60 }} />
              <Typography variant="h6" component="div">
                SINGAPURA CC
              </Typography>
            </Grid>
          </Link>

          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              gap: 5,
            }}
          >
            

            {!isAdmin && (
              <>
                <Box
                  sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                  onClick={handleEventsClick}
                >
                  <Typography>Events</Typography>
                </Box>

                <Menu
                  anchorEl={anchorElEvents}
                  open={openEvents}
                  onClose={handleEventsClose}
                >
                  <Link to="/customer-events" style={{ textDecoration: "none", color: "inherit" }}>
                    <MenuItem onClick={handleEventsClose}>All Events</MenuItem>
                  </Link>
                  <Link to="/feedbacklist" style={{ textDecoration: "none", color: "inherit" }}>
                    <MenuItem onClick={handleEventsClose}>View Feedback</MenuItem>
                  </Link>
                  <Link to="/feedbackform" style={{ textDecoration: "none", color: "inherit" }}>
                    <MenuItem onClick={handleEventsClose}>Add Feedback</MenuItem>
                  </Link>
                </Menu>

                <Link to="/facilities">
                  <Typography>Facilities</Typography>
                </Link>

                <Link to="/notifications">
                  <Typography>Notification</Typography>
                </Link>


                {user && user.role === 'Customer' && (
                  <Link to="/posts">
                    <Typography>Connect</Typography>
                  </Link>
                )}
                {/* <Link to="/Membership">
                  <Typography>Membership</Typography>
                </Link> */}
              </>
            )}

            
          </Box>

          {user ? (
            <>
              {isAdmin && (
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Admin Management Portal
                </Typography>
              )}

              <IconButton color="inherit" onClick={handleNotificationClick}>
                <Badge
                  badgeContent={notifications.filter((n) => !n.isRead).length}
                  color="secondary"
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleNotificationClose}
                PaperProps={{
                  elevation: 3,
                  style: {
                    maxHeight: 400,
                    width: "320px",
                  },
                }}
              >
                {notifications.length === 0 ? (
                  <MenuItem onClick={handleNotificationClose}>
                    No notifications
                  </MenuItem>
                ) : (
                  <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                    {notifications.map((notification) => (
                      <ListItem
                        button
                        key={notification.type + notification.id}
                        onClick={() => markAsRead(notification.id, notification.type)}
                        sx={{
                          backgroundColor: notification.isRead
                            ? "#f0f0f0"
                            : "#fff",
                          fontWeight: notification.isRead ? "normal" : "bold",
                        }}
                      >
                        <ListItemIcon>
                          {getNotificationIcon(notification.type)}
                        </ListItemIcon>
                        <ListItemText
                          primary={notification.title || notification.message}
                          secondary={(
                            <>
                              {notification.description && (
                                <Typography variant="body2" color="textSecondary" component="span">
                                  {notification.description}
                                </Typography>
                              )}
                              <Typography variant="body2" color="textSecondary" component="span">
                                {formatNotificationTime(notification.createdAt)}
                              </Typography>
                            </>
                          )}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Menu>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1,
                }}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={isAdmin ? handleClickAdmin : handleClickCustomer}
              >
                <IconButton id="account-button">
                  <Avatar sx={{ width: 40, height: 40 }}>
                    {getInitials(user.firstName)}
                  </Avatar>
                </IconButton>
                <Typography
                  sx={{ cursor: "pointer" }}
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  {user.firstName} {user.lastName}
                </Typography>
              </Box>

              {/* admin side */}
              <Menu
                id="account-menu"
                anchorEl={anchorElAdmin}
                open={openAdmin}
                onClose={handleCloseAdmin}
                MenuListProps={{
                  "aria-labelledby": "account-button",
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    paddingX: 2,
                    paddingY: 1,
                  }}
                >
                  <Typography fontWeight={"medium"}>
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography color={"textSecondary"}>{user.email}</Typography>
                </Box>
                <Divider />
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <MenuItem>
                      <Typography>Dashboard</Typography>
                    </MenuItem>
                  </Link>
                )}
                <Link
                  to="/notes"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <MenuItem>
                    <Typography>My Notes</Typography>
                  </MenuItem>
                </Link>

                <Link
                  to="/profile"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <MenuItem>
                    <Typography>Profile</Typography>
                  </MenuItem>
                </Link>
                <MenuItem onClick={logout}>Logout</MenuItem>
              </Menu>

              {/* customer side */}

              <Menu
                id="account-menu-customer"
                anchorEl={anchorElCustomer}
                open={openCustomer}
                onClose={handleCloseCustomer}
                MenuListProps={{
                  "aria-labelledby": "account-button",
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    paddingX: 2,
                    paddingY: 1,
                  }}
                >
                  <Typography fontWeight={"medium"}>
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography color={"textSecondary"}>{user.email}</Typography>
                </Box>

                <Divider />

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    paddingX: 2,
                    paddingY: 1,
                  }}
                >
                  <Typography fontWeight={"medium"}>
                    Total Points: {user.totalPoints}
                  </Typography>
                </Box>

                <Divider />


                <Link
                  to="/notes"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <MenuItem>
                    <Typography>My Notes</Typography>
                  </MenuItem>
                </Link>

                <Link
                  to="/profile"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <MenuItem>
                    <Typography>Profile</Typography>
                  </MenuItem>
                </Link>
                <Link
                  to="/settings"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <MenuItem>
                    <Typography>Settings</Typography>
                  </MenuItem>
                </Link>
                <MenuItem onClick={logout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Link
                to="/register"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Typography>SIGN UP</Typography>
              </Link>
              <Link
                to="/login"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Typography>LOGIN</Typography>
              </Link>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;