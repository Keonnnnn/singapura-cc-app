import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";
import http from "../http";

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalStaff, setTotalStaff] = useState(0);
  const [dailyUsage, setDailyUsage] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);

  useEffect(() => {
    http.get("/user").then((res) => {
      setTotalUsers(res.data.length);
      setTotalCustomers(
        res.data.filter((user) => user.role === "Customer").length
      );
      setTotalStaff(res.data.filter((user) => user.role === "Staff").length);

      const today = new Date();
      const days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        return date.toISOString().split("T")[0];
      });

      const dailyUsage = days.map((date) => ({
        date,
        usage: res.data.filter((user) =>
          user.lastLogin ? user.lastLogin.split("T")[0] === date : false
        ).length,
      }));

      setDailyUsage(dailyUsage);

      const recentCustomers = res.data
        .filter((user) => user.role === "Customer")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRecentCustomers(recentCustomers);
    });
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: "#f4f6f9",
        minHeight: "100vh",
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

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4">{totalUsers}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6">Total Customers</Typography>
              <Typography variant="h4">{totalCustomers}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6">Total Staff</Typography>
              <Typography variant="h4">{totalStaff}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2, p: 2 }}>
            <CardContent>
              <Typography variant="h6">Daily Usage Statistics</Typography>
              <Box sx={{ height: 350, mt: 3 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyUsage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={formatDate}>
                      <Label
                        value="Date (dd/mm/yyyy)"
                        offset={-5}
                        position="insideBottom"
                      />
                    </XAxis>
                    <YAxis>
                      <Label
                        value="Usage Count"
                        angle={-90}
                        position="insideLeft"
                      />
                    </YAxis>
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="usage" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top 5 Recent Customers
              </Typography>
              <Grid container spacing={3} sx={{ paddingX: 1 }}>
                {recentCustomers.slice(0, 5).map((customer, index) => (
                  <Grid item xs={12} key={index}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        padding: "10px 0",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          marginRight: 2,
                          color: "#000",
                          fontWeight: "semibold",
                        }}
                      >
                        {index + 1}.
                      </Typography>
                      <Avatar
                        src={customer.pfpURL || undefined}
                        alt={customer.firstName}
                        sx={{
                          width: 60,
                          height: 60,
                          marginRight: 2,
                          backgroundColor: customer.pfpURL
                            ? "transparent"
                            : "#ccc",
                        }}
                      >
                        {!customer.pfpURL && customer.firstName[0]}
                      </Avatar>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                          {customer.firstName} {customer.lastName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {customer.email}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {new Date(customer.createdAt).toLocaleDateString(
                            "en-GB"
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
