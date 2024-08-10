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
import Comments from "./pages/Comments";
import PostProfile from "./pages/PostProfile";

// Amelia
import Events from "./pages/Events";
import AddEvent from "./pages/AddEvent";
import EditEvent from "./pages/EditEvent";
import ChatBot from "react-chatbotify";
import CustomerEvent from "./pages/CustomerEvents"; //page
import StaffEventConfirmation from "./pages/StaffEventConfirmation.jsx";

// Ahmed
import FeedbackForm from "./pages/FeedbackForm";
import FeedbackList from "./pages/FeedbackList";
import FeedbackDetail from "./pages/FeedbackDetail";
import AddNotification from "./pages/AddNotification";
import NotificationList from "./pages/NotificationList";
import NotificationDetail from "./pages/NotificationDetail";

// Ayura
import EditRewards from "./pages/EditRewards";
import UpdateReward from "./pages/updateReward";
import ClaimRewards from "./pages/claimRewards.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import { ToastContainer } from "react-toastify";
import Spin from "./pages/Spin.jsx";

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

  // Amelia's codes

  const flow = {
    start: {
      message: "Greetings to you! How can I help you today?",
      options: ["Tell me about the events", "I want to view my membership details", "I want to connect with other people!"],
      path: "handle_inquiry",
    },

    process_options: {
      message: (params) => {
        let link = "";
        switch (params.userInput) {
          case "Tell me about the events":
            link = "customer-events";
            params.userInput = "our events";
            break;

          case "I want to view my membership details":
            if (user) {
              link = "Membership";
              params.userInput = "your membership details";
            }
            else {
              link = "login";
              params.userInput = "login or sign up before you can view your membership details";
            }
            break;

          case "I want to connect with other people!":
            if (user) {
              link = "posts";
              params.userInput = "bond with fellow members";
            }
            else {
              link = "posts";
              params.userInput = "login or sign up before you can view your membership details";
            }
            break;

          case "Help me with something else":
            return {
              path: "handle_inquiry"
            };

          default:
            return "unknown_input";
        }
        setTimeout(() => {
          window.open(link);
        }, 2000);
        return `Sit tight! I'll send you to ${params.userInput}!`;
      },
    },

    handle_inquiry: {
      message: "Thank you for your inquiry. We will review it and get back to you soon.",
      path: "end",
      processInput: (params) => {
        // Here you can handle the user's inquiry, e.g., send it to a backend service or store it.
        console.log("User inquiry:", params.userInput);
      }
    },

    end: {
      message: "Thank you for using our service!",
      end: true,
    },
  };

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
            <Route
              path="/comments/:postId"
              element={user ? <Comments /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile/:userId"
              element={<ProtectedRoute element={PostProfile} />}
            />

            <Route
              path="/events"
              element={
                <ProtectedRoute
                  element={Events}
                  allowedRoles={["Admin", "Staff"]}
                />
              }
            />
            <Route
              path={"/customer-events"}
              element={<CustomerEvent />}
            />

            <Route
              path="/feedbackform"
              element={<ProtectedRoute element={FeedbackForm} />}
            />
            <Route path="/posts" element={<ProtectedRoute element={Posts} />} />
            <Route
              path="/createpost"
              element={user ? <CreatePost /> : <Navigate to="/login" />}
            />
            <Route path="/notes" element={<Notes />} />
            <Route path="/addnote" element={<AddNote />} />
            <Route path="/editnote/:id" element={<EditNote />} />
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
              element={<ProtectedRoute element={NotificationList} />}
            />
            <Route path="/notifications/:id" element={<NotificationDetail />} />

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
              element={<ProtectedRoute element={FeedbackList} />}
            />
            <Route path="/feedback/:id" element={<FeedbackDetail />} />
            <Route path="/addevent" element={<AddEvent />} />
            <Route path="/eventsregistrations/:id" element={<StaffEventConfirmation />} />
            <Route path="/editevent/:id" element={<EditEvent />} />
            <Route
              path="/editpost/:id"
              element={user ? <EditPost /> : <Navigate to="/login" />}
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
            <Route
              path="/admin/notifications/add"
              element={
                <ProtectedRoute
                  element={AddNotification}
                  allowedRoles={["Admin", "Staff"]}
                />
              }
            />
            {/* routes not listed above */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </ThemeProvider>
      </Router>
      <ToastContainer />

      <ChatBot flow={flow} options={options} />
    </UserContext.Provider>
  );
}

export default App;
