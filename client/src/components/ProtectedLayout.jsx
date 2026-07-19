import React from "react";
import { CssBaseline, Box } from "@mui/material";
import Sidebar from "./Sidebar";

const ProtectedLayout = ({ children }) => {
  return (
    <Box sx={{ overflow: "hidden" }}>
      <CssBaseline />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          display: "flex",
        }}
      >
        <Sidebar />
        <Box
          sx={{
            p: { xs: 2, sm: 4, md: 7.5 },
            width: "100%",
            minWidth: 0,
            minHeight: "100vh",
            overflowY: "auto",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default ProtectedLayout;
