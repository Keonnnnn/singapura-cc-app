import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import http from "../http"; // Adjust based on your API path

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalStaff, setTotalStaff] = useState(0);
  const [dailyUsage, setDailyUsage] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);

  useEffect(() => {
    // Fetch total users
    http.get("/user").then((res) => {
      setTotalUsers(res.data.length);
      setTotalCustomers(
        res.data.filter((user) => user.role === "Customer").length
      );
      setTotalStaff(res.data.filter((user) => user.role === "Staff").length);

      // fetch daily usage statistics by checking lastLoggedIn date
      const today = new Date();
      const days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        return date.toISOString().split("T")[0];
      });

      const dailyUsage = days.map((date) => ({
        date,
        usage: res.data.filter((user) =>
          user.lastLogin ? user.lastLogin.split("T")[0] == date : false
        ).length,
      }));

      setDailyUsage(dailyUsage);

      // fetch top 5 recent customers based on creation date
      const recentCustomers = res.data
        .filter((user) => user.role === "Customer")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRecentCustomers(recentCustomers);
    });
  }, []);

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: "#f0f0f0",
        minHeight: "100vh",
        p: 3,
        borderRadius: "8px",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          my: 2,
          textAlign: "center",
          color: "#e2160f",
          fontWeight: "bold",
        }}
      >
        Admin Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4">{totalUsers}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Customers</Typography>
              <Typography variant="h4">{totalCustomers}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Staff</Typography>
              <Typography variant="h4">{totalStaff}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Daily Usage Statistics</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyUsage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="usage" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Top 5 Recent Customers</Typography>
              <Grid container spacing={2}>
                {/* Display top 5 recent customers profile picture, name, email and date created in a nice vertical list with the details spread out horizontally*/}
                {recentCustomers.slice(0, 5).map((customer, index) => {
                  return (
                    <Grid item xs={12} key={index}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                        }}
                      >
                        <Box
                          component="img"
                          src={customer.pfpURL || ""}
                          alt={customer.firstName}
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: "50%",
                            mr: 2,
                            objectFit: "cover",
                          }}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <Typography variant="h6">
                            {customer.firstName} {customer.lastName}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {customer.email}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {new Date(customer.createdAt).toDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
