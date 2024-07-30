import "./App.css";
import { useState, useEffect } from "react";
import {} from "@mui/material";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import http from "./http";
import { ThemeProvider } from "@mui/material/styles";

import Navbar from "./components/Navbar.jsx";

// Francine
import MyTheme from "./themes/MyTheme";
import Register from "./pages/Register";
import UserContext from "./contexts/UserContext";
import ProtectedRoute from "./ProtectedRoute.jsx";
import CreateStaff from "./pages/CreateStaff";
import ViewUsers from "./pages/ViewUsers";
import EditUser from "./pages/EditUser";
import ViewUser from "./pages/ViewUser";
import Notes from "./pages/Notes";
import Home from "./pages/Home";
import AddNote from "./pages/AddNote";
import EditNote from "./pages/EditNote";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import OtpVerification from "./pages/OtpVerification.jsx";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

// Keon
import Posts from "./pages/Posts";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";

// Amelia
import Events from "./pages/Events";
import AddEvent from "./pages/AddEvent";
import EditEvent from "./pages/EditEvent";
import ChatBot from "react-chatbotify";

// Ahmed
import FeedbackForm from "./pages/FeedbackForm";
import FeedbackList from "./pages/FeedbackList";
import FeedbackDetail from "./pages/FeedbackDetail";

// Ayura
import Rewards from "./pages/Rewards";
import EditRewards from "./pages/EditRewards";
import UpdateReward from "./pages/updateReward";
import Dashboard from "./pages/Dashboard.jsx";
import EditProfile from "./pages/EditProfile.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const localS = localStorage.getItem("accessToken");
  useEffect(() => {
    const fetchUser = async () => {
      if (localS) {
        try {
          const res = await http.get("/user/auth");
          setUser(res.data.user);
        } catch (error) {
          console.error(error);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [localS]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const flow = {
    start: {
      message: "Greetings to you! How can I help you today?",
      path: "end",
    },
  };

  const options = {
    theme: {
      primaryColor: "#f9a99e",
      secondaryColor: "#e2160f",
      showFooter: false,
    },
    chatHistory: {
      storageKey: "example_theming",
    },
  };
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <Navbar />

        <ThemeProvider theme={MyTheme}>
          <Routes>
            {/* customer routes */}
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/otp-verification" element={<OtpVerification />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/settings" element={<Settings />} />

            <Route path="/events" element={<Events />} />
            <Route
              path="/feedbackform"
              element={<ProtectedRoute element={FeedbackForm} />}
            />

            <Route
              path="/posts"
              element={user ? <Posts /> : <Navigate to="/login" />}
            />
            <Route
              path="/createpost"
              element={user ? <CreatePost /> : <Navigate to="/login" />}
            />

            <Route path={"/rewards"} />
            <Route path="/notes" element={<ProtectedRoute element={Notes} />} />
            <Route
              path="/addnote"
              element={<ProtectedRoute element={AddNote} />}
            />
            <Route
              path="/editnote/:id"
              element={<ProtectedRoute element={EditNote} />}
            />

            {/* admin routes */}
            <Route
              path={"/admin/dashboard"}
              element={
                <ProtectedRoute
                  element={Dashboard}
                  allowedRoles={["Admin", "Staff"]}
                />
              }
            />

            <Route
              path="/admin/register-staff"
              element={
                <ProtectedRoute
                  element={CreateStaff}
                  allowedRoles={["Admin"]}
                />
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute
                  element={ViewUsers}
                  allowedRoles={["Admin", "Staff"]}
                />
              }
            />
            <Route
              path="/admin/users/:id/edit"
              element={
                <ProtectedRoute
                  element={EditUser}
                  allowedRoles={["Admin", "Staff"]}
                />
              }
            />
            <Route
              path="/admin/users/:id/view"
              element={
                <ProtectedRoute
                  element={ViewUser}
                  allowedRoles={["Admin", "Staff"]}
                />
              }
            />

            <Route
              path="/feedbacklist"
              element={<ProtectedRoute element={FeedbackList} />}
            />
            <Route path="/feedback/:id" element={<FeedbackDetail />} />

            <Route path="/addevent" element={<AddEvent />} />
            <Route path="/editevent/:id" element={<EditEvent />} />

            <Route
              path="/editpost/:id"
              element={user ? <EditPost /> : <Navigate to="/login" />}
            />

            <Route
              path="/admin/rewards"
              element={<ProtectedRoute element={Rewards} />}
            />
            <Route
              path="/admin/edit-rewards"
              element={<ProtectedRoute element={EditRewards} />}
            />
            <Route
              path="/admin/update-rewards/:id"
              element={<ProtectedRoute element={UpdateReward} />}
            />

            {/* routes not listed above */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </ThemeProvider>
      </Router>
      <ChatBot flow={flow} options={options} />
    </UserContext.Provider>
  );
}

export default App;
