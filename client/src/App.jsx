import "./App.css";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes, 
  Route,
  Navigate,
} from "react-router-dom";
import http from "./http";
import { ThemeProvider } from "@mui/material/styles";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx"; // Import Footer component
import { theme, darkTheme } from "./themes/MyTheme";
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
import Comments from "./pages/Comments";
import PostProfile from "./pages/PostProfile";

// Amelia
import Events from "./pages/Events";
import AddEvent from "./pages/AddEvent";
import EditEvent from "./pages/EditEvent";
import ChatBot from "react-chatbotify";
import CustomerEvent from "./pages/CustomerEvents"; 
import StaffEventConfirmation from "./pages/StaffEventConfirmation.jsx";
import UserRegistrationHistory from "./pages/UserRegistrationHistory.jsx";

// Ahmed
import FeedbackForm from "./pages/FeedbackForm";
import FeedbackList from "./pages/FeedbackList";
import FeedbackDetail from "./pages/FeedbackDetail";
import AddNotification from "./pages/AddNotification";
import NotificationList from "./pages/NotificationList";
import NotificationDetail from "./pages/NotificationDetail";
import AnnouncementList from './pages/AnnouncementList';
import AnnouncementForm from './pages/AnnouncementForm';
import AnnouncementDetail from './pages/AnnouncementDetail';

// Ayura
import EditRewards from "./pages/EditRewards";
import UpdateReward from "./pages/updateReward";
import ClaimRewards from "./pages/claimRewards.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import { ToastContainer } from "react-toastify";
import Spin from "./pages/Spin.jsx";

// Define the flow for the chatbot
const flow = {
  start: {
    message: "Greetings to you! How can I help you today?",
    transition: { duration: 1000 },
    path: "show_options",
  },
  show_options: {
    message: "Here are some options you can choose from:",
    options: ["Tell me about the events", "I want to view my membership details", "I want to connect with other people!", "I want to write feedback"],
    path: "process_options",
  },
  unknown_input: {
    message: "Sorry, I do not understand your message 😢! If you require further assistance you may click on ",
    options: ["Tell me about the events", "I want to view my membership details", "I want to connect with other people!", "I want to write feedback"],
    path: "process_options",
  },
  prompt_again: {
    message: "Do you need any other help?",
    options: ["Tell me about the events", "I want to view my membership details", "I want to connect with other people!", "I want to write feedback"],
    path: "process_options",
  },
  process_options: {
    transition: { duration: 0 },
    path: async (params) => {
      let link = "";
      switch (params.userInput) {
        case "Tell me about the events":
          link = "/customer-events";
          break;
        case "I want to view my membership details":
          link = "/membership";
          break;
        case "I want to connect with other people!":
          link = "/posts";
          break;
        case "I want to write feedback":
          return "handle_inquiry";
        default:
          return "unknown_input";
      }
      await params.injectMessage("Sit tight! I'll send you right there!");
      setTimeout(() => {
        window.open(link);
      }, 2000);
      return "repeat";
    },
  },
  repeat: {
    transition: { duration: 3000 },
    path: "prompt_again",
  },
  handle_inquiry: {
    message: "Thank you for your inquiry. We will review it and get back to you soon.",
    path: "end",
    processInput: (params) => {
      console.log("User inquiry:", params.userInput);
    },
  },
  end: {
    message: "Thank you for using our service!",
    end: true,
  },
};

// Define options for the chatbot
const options = {
  theme: {
    primaryColor: "#6667AB",
    secondaryColor: "#e2160f",
    showFooter: false,
  },
  chatHistory: {
    storageKey: "example_theming",
  },
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
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

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <UserContext.Provider value={{ user, setUser, darkMode, toggleDarkMode }}>
      <Router>
        <Navbar />

        <ThemeProvider theme={theme}>
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
            <Route
              path="/comments/:postId"
              element={user ? <Comments darkMode={darkMode} /> : <Navigate to="/login" />}
            />
            <Route path="/profile/:userId" element={<PostProfile darkMode={darkMode} />} />

            <Route
              path="/events"
              element={
                <ProtectedRoute
                  element={Events}
                  allowedRoles={["Admin", "Staff"]}
                />
              }
            />
            <Route path="/customer-events" element={<CustomerEvent />} />
            <Route path="/user-registration-history" element={<UserRegistrationHistory />} />
            <Route
              path="/feedbackform"
              element={<ProtectedRoute element={FeedbackForm} />}
            />
            <Route
              path="/feedbacklist"
              element={<ProtectedRoute element={FeedbackList} />}
            />
            <Route
              path="/posts"
              element={<ThemeProvider theme={darkMode ? darkTheme : theme}><Posts darkMode={darkMode} /></ThemeProvider>}
            />
            <Route
              path="/createpost"
              element={user ? <ThemeProvider theme={darkMode ? darkTheme : theme}><CreatePost darkMode={darkMode} /></ThemeProvider> : <Navigate to="/login" />}
            />
            <Route
              path="/editpost/:id"
              element={<ThemeProvider theme={darkMode ? darkTheme : theme}><EditPost darkMode={darkMode} /></ThemeProvider>}
            />
            <Route path="/notes" element={<Notes />} />
            <Route path="/addnote" element={<AddNote />} />
            <Route path="/editnote/:id" element={<EditNote />} />
            <Route
            <Route
              path="/ClaimRewards"
              element={
                <ProtectedRoute
                  element={ClaimRewards}
                  allowedRoles={["Customer"]}
                />
              }
            />
            <Route
              path="/Spin"
              element={
                <ProtectedRoute
                  element={Spin}
                  allowedRoles={["Customer"]}
                />
              }
            />
            <Route
              path="/admin/notifications"
              element={<ProtectedRoute element={NotificationList} allowedRoles={["Admin", "Staff"]} />}
            />
            <Route
              path="/notifications/:id"
              element={<NotificationDetail />}
            />
            <Route
              path="/announcements"
              element={<AnnouncementList/>} 
            />
            <Route
              path="/announcements/new"
              element={<AnnouncementForm/>}
            />
            {/* <Route
              path="/announcements/:id/edit"
              element={AnnouncementForm}
            /> */}
            <Route
              path="/announcements/:id"
              element={<AnnouncementDetail/>}
            />

            {/* admin routes */}
            <Route
              path="/admin/dashboard"
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
              element={<ProtectedRoute element={FeedbackList} allowedRoles={["Admin", "Staff"]} />}
            />
            <Route path="/feedback/:id" element={<FeedbackDetail />} />
            <Route
              path="/admin/notifications/add"
              element={
                <ProtectedRoute
                  element={AddNotification}
                  allowedRoles={["Admin", "Staff"]}
                />
              }
            />
            <Route
              path="/admin/edit-notification/:id"
              element={<ProtectedRoute element={AddNotification} allowedRoles={["Admin", "Staff"]} />}
            />
            <Route path="/edit-event/:id" element={<EditEvent />} />

            {/* chat bot */}
            <Route
              path="/chatbot"
              element={<ChatBot steps={flow} options={options} />}
            />
            <Route
              path="/admin/events"
              element={<ProtectedRoute element={Events} allowedRoles={["Admin", "Staff"]} />}
            />
             <Route
              path="/eventsregistrations/:id"
              element={<StaffEventConfirmation />}
            />
            <Route path="/addevent" element={<AddEvent />} />
            <Route
              path="/admin/edit-event/:id"
              element={<ProtectedRoute element={EditEvent} allowedRoles={["Admin", "Staff"]} />}
            />

             <Route
              path="/admin/rewards"
              element={<ProtectedRoute element={Rewards} />}
            />
            <Route
              path="/admin/edit-rewards"
              element={
                <ProtectedRoute
                  element={EditRewards}
                  allowedRoles={["Admin", "Staff"]}
                />
              }
            />
            <Route
              path="/admin/update-rewards/:id"
              element={
                <ProtectedRoute
                  element={UpdateReward}
                  allowedRoles={["Admin", "Staff"]}
                />
              }
            />
          </Routes>
          <Footer />
          <ToastContainer />
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
