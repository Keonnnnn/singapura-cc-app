// Common Use Imports
import './App.css';
import { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Button, Avatar, Grid, IconButton } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import http from './http';
import { ThemeProvider } from '@mui/material/styles';
import { Search, Clear, BorderAll } from '@mui/icons-material';

// Francine
import MyTheme from './themes/MyTheme';
import Register from './pages/Register';
import UserContext from './contexts/UserContext';
import ProtectedRoute from './ProtectedRoute.jsx'; // Unauthorised users redirected to login page
import logo from './logo.png';
import CreateStaff from './pages/CreateStaff';
import ViewUsers from './pages/ViewUsers';
import EditUser from './pages/EditUser';
import ViewUser from './pages/ViewUser';
import Notes from './pages/Notes';
import Home from './pages/Home';
import AddNote from './pages/AddNote';
import EditNote from './pages/EditNote';
import Login from './pages/Login';

// Keon
// import Posts from './pages/Posts'; 
// import CreatePost from './pages/CreatePost';
// import EditPost from './pages/EditPost';
// import MyForm from './pages/MyForm';
// import postImage from './assets/postImage.jpg';

//Amelia
import Events from './pages/Events'; // page
import AddEvent from './pages/AddEvent'; //page
import EditEvent from './pages/EditEvent'; //page
import ChatBot from 'react-chatbotify'; //chatbot

//Ahmed


//Ayura
import './App.css';
import { createTheme, ThemeProvider, Container, AppBar, Toolbar, Typography } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link }
  from 'react-router-dom';
import Rewards from './pages/Rewards';
import Sidebar from './pages/Sidebar';
import EditRewards from './pages/EditRewards';
import UpdateReward from './pages/updateReward';


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchUser = async () => {
      if (localStorage.getItem('accessToken')) {
        try {
          const res = await http.get('/user/auth');
          setUser(res.data.user);
          console.log("Fetched User: ", res.data.user); // Add this line

        } catch (error) {
          console.error(error);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);


  const logout = () => {
    localStorage.clear();
    window.location = '/';
  };

  // Function to get the first initial from the first name
  const getInitials = (firstName) => {
    if (!firstName) return '';
    return firstName.charAt(0).toUpperCase();
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  const isStaffOrAdmin = () => {
    return user && (user.role === 'Staff' || user.role === 'Admin');
  };

  const flow = {
    "start": {
      "message": "Greetings to you! How can I help you today?",
      path: "end"
    }
  }

  const options = {
    theme: {
      primaryColor: "#f9a99e",
      secondaryColor: "#e2160f",
      showFooter: false
    },
    chatHistory: {
      storageKey: "example_theming"
    }

  }




  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <ThemeProvider theme={MyTheme}>
          <AppBar position="static" className='AppBar'>
            <Container>
              <Toolbar disableGutters={true}>
                <Link to="/">
                  <Grid container spacing={0}
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

                <Link to="/notes" >
                  <Typography>Notes</Typography>
                </Link>

                <Link to="/register-staff">
                  <Typography>Add Staff</Typography>
                </Link>

                <Link to="/users">
                  <Typography>View Users</Typography>
                </Link>

                <Link to="/events">
                  <Typography>View events</Typography>
                </Link>




                {/* <Grid item>
                  <Typography variant="h6" component="div" color="white">
                    {isStaffOrAdmin() ? 'Staff Management Portal' : 'Customer Portal'}
                  </Typography>
                </Grid> */}

                <Box sx={{ flexGrow: 1 }} />
                {user && (
                  <>
                    <Avatar sx={{ width: 40, height: 40 }}>
                      {getInitials(user.firstName)}
                    </Avatar>
                    {/* <Typography>{user.name}</Typography> */}
                    <Typography sx={{ marginLeft: 1 }}>{user.firstName} {user.lastName}</Typography>
                    <Button onClick={logout}>Logout</Button>
                  </>
                )
                }
                {!user && (
                  <>
                    <Link to="/register">
                      <Typography>SIGN UP</Typography>
                    </Link>

                    <Link to="/login">
                      <Typography>LOGIN</Typography>
                    </Link>
                  </>
                )}


              </Toolbar>
            </Container>
          </AppBar>
          <Sidebar />
          <Container>
            <Routes>
              <Route path={"/"} element={<Home />} />
              <Route path="/notes" element={<ProtectedRoute element={Notes} />} />
              <Route path="/addnote" element={<ProtectedRoute element={AddNote} />} />
              <Route path="/editnote/:id" element={<ProtectedRoute element={EditNote} />} />
              <Route path={"/register"} element={<Register />} />
              <Route path={"/login"} element={<Login />} />
              <Route path={"/register-staff"} element={<ProtectedRoute element={CreateStaff} allowedRoles={['Admin']} />} />
              <Route path={"/users"} element={<ProtectedRoute element={ViewUsers} allowedRoles={['Admin']} />} />
              <Route path={"/users/:id/edit"} element={<ProtectedRoute element={EditUser} />} />
              <Route path={"/users/:id/view"} element={<ProtectedRoute element={ViewUser} allowedRoles={['Admin']} />} />
              <Route path={"/events"} element={<Events />} />
              <Route path={"/addevent"} element={<AddEvent />} />
              <Route path={"/editevent/:id"} element={<EditEvent />} />
              <Route path="/Rewards" element={<Rewards />} />
              <Route path="/EditRewards" element={<EditRewards />} />
              <Route path="/UpdateReward/:id" element={<UpdateReward />} />
              <Route path={"/"} />
              <Route path={"/rewards"} />
            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
      <ChatBot flow={flow} options={options} />
    </UserContext.Provider>

  );
}

export default App;
