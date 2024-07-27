import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Collapse,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import UserContext from "../contexts/UserContext";

// Icons for the sidebar options
// import dashboardIcon from "../assets/dashboard.svg";
// import usersIcon from "../assets/users.svg";
// import blogIcon from "../assets/blog.svg";
// import eventsIcon from "../assets/events.svg";
// import rewardsIcon from "../assets/rewards.svg";
// import customerIcon from "../assets/customer.svg";
// import staffIcon from "../assets/staff.svg";

// Sidebar menu options
const sideMenuOptions = [
  {
    name: "Dashboard",
    // icon: dashboardIcon,
    icon: "https://via.placeholder.com/26",
    path: "/admin/dashboard",
  },
  {
    name: "Users",
    // icon: dashboardIcon,
    icon: "https://via.placeholder.com/26",
    subOptions: [
      {
        name: "View All Users",
        path: "/admin/users",
      },
      {
        name: "Add Staff",
        path: "/admin/register-staff",
      },
    ],
  },
  {
    name: "Blogs",
    // icon: blogIcon,
    icon: "https://via.placeholder.com/26",
    path: "/admin/blogs",
  },
  {
    name: "Events",
    // icon: eventsIcon,
    icon: "https://via.placeholder.com/26",
    path: "/admin/events",
  },

  {
    name: "Rewards",
    // icon: dashboardIcon,
    icon: "https://via.placeholder.com/26",
    subOptions: [
      {
        name: "View All Rewards",
        path: "/admin/rewards",
      },
      {
        name: "Add Rewards",
        path: "/admin/add-rewards",
      },
    ],
  },
];

function Sidebar() {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const [isMinimized, setIsMinimized] = useState(() => {
    const storedState = localStorage.getItem("snMinimized");
    return storedState ? JSON.parse(storedState) : false;
  });

  useEffect(() => {
    localStorage.setItem("snMinimized", JSON.stringify(isMinimized));
  }, [isMinimized]);

  const [open, setOpen] = useState({});

  const handleClick = (name) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [name]: !prevOpen[name],
    }));
  };

  return (
    <Box
      sx={{
        px: 1.5,
        borderRight: "1px solid lightgrey",
        width: isMinimized ? 80 : "35%",
        maxWidth: isMinimized ? 80 : 290,
        transition: "all 0.3s ease",
      }}
    >
      <List>
        <ListItem
          sx={{
            display: "flex",
            gap: "30px",
            my: 1,
            alignItems: "center",
          }}
        >
          <Box
            component="a"
            onClick={() => setIsMinimized(!isMinimized)}
            sx={{ ":hover": { cursor: "pointer" } }}
          >
            {isMinimized ? <ChevronRight /> : <ChevronLeft />}
          </Box>
          <ListItemText
            primary={`Welcome, ${user.firstName}`}
            sx={{
              whiteSpace: "nowrap",
              opacity: isMinimized ? 0 : 1,
              visibility: isMinimized ? "hidden" : "visible",
              transition: "opacity 0.1s ease-in-out, visibility 0s linear 0.1s",
            }}
          />
        </ListItem>
        <Divider />
        {sideMenuOptions.map((option) => (
          <React.Fragment key={option.name}>
            <ListItem
              button
              onClick={() => option.subOptions && handleClick(option.name)}
              sx={{
                my: 1,
                borderRadius: 2,
                backgroundColor: location.pathname.startsWith(
                  `/admin/${
                    option.name.toLowerCase().includes(" ")
                      ? option.name.toLowerCase().replace(" ", "-")
                      : option.name.toLowerCase()
                  }`
                )
                  ? "#e2160f"
                  : "#FFF",
              }}
            >
              {!option.subOptions ? (
                <Link
                  to={option.path}
                  style={{
                    textDecoration: "none",
                    display: "flex",
                    gap: "30px",
                    color: "black",
                    width: "100%",
                    alignItems: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: "30px",
                      width: "100%",
                      alignItems: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <img
                      src={option.icon}
                      alt={option.name}
                      width={26}
                      height={26}
                    />
                    <ListItemText
                      primary={option.name}
                      sx={{
                        opacity: isMinimized ? 0 : 1,
                        visibility: isMinimized ? "hidden" : "visible",
                        transition:
                          "opacity 0.1s ease-in-out, visibility 0s linear 0.1s",
                      }}
                    />
                  </Box>
                </Link>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    gap: "30px",
                    width: "100%",
                    alignItems: "center",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={option.icon}
                    alt={option.name}
                    width={26}
                    height={26}
                  />
                  <ListItemText
                    primary={option.name}
                    sx={{
                      opacity: isMinimized ? 0 : 1,
                      visibility: isMinimized ? "hidden" : "visible",
                      transition:
                        "opacity 0.1s ease-in-out, visibility 0s linear 0.1s",
                    }}
                  />
                  {option.subOptions &&
                    !isMinimized &&
                    (open[option.name] ? <ExpandLess /> : <ExpandMore />)}
                </Box>
              )}
            </ListItem>
            {option.subOptions && (
              <Collapse in={open[option.name]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {option.subOptions.map((subOption) => (
                    <ListItem
                      key={subOption.name}
                      sx={{
                        pl: 4,
                        my: 1,
                        borderRadius: 2,
                        backgroundColor:
                          location.pathname === subOption.path
                            ? "#e2160f"
                            : "#FFF",
                      }}
                    >
                      <Link
                        to={subOption.path}
                        style={{
                          textDecoration: "none",
                          display: "flex",
                          gap: "30px",
                          color: "black",
                          width: "100%",
                          alignItems: "center",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <ListItemText
                          primary={subOption.name}
                          sx={{
                            opacity: isMinimized ? 0 : 1,
                            visibility: isMinimized ? "hidden" : "visible",
                            transition:
                              "opacity 0.1s ease-in-out, visibility 0s linear 0.1s",
                          }}
                        />
                      </Link>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}

export default Sidebar;
