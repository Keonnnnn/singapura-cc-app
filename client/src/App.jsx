import './App.css';
import { Container, AppBar, Toolbar, Typography, Box, Button, Avatar, Grid } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Notes from './pages/Notes';
import Home from './pages/Home';
import AddNote from './pages/AddNote';
import EditNote from './pages/EditNote';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import Register from './pages/Register';
import Login from './pages/Login';
import { useState, useEffect } from 'react';
import http from './http';
import UserContext from './contexts/UserContext';
import ProtectedRoute from './ProtectedRoute.jsx';
import logo from './logo.png';



function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchUser = async () => {
      if (localStorage.getItem('accessToken')) {
        try {
          const res = await http.get('/user/auth');
          setUser(res.data.user);
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
    return <div>Loading...</div>; // or a spinner
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

                <Box sx={{flexGrow:1}}/>
                  { user && (
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

          <Container>
            <Routes>
              <Route path={"/"} element={<Home />}/>
              <Route path="/notes" element={<ProtectedRoute element={Notes} />} />
              <Route path="/addnote" element={<ProtectedRoute element={AddNote} />} />
              <Route path="/editnote/:id" element={<ProtectedRoute element={EditNote} />} />
              <Route path={"/register"} element={<Register />} />
              <Route path={"/login"} element={<Login />} />
            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
