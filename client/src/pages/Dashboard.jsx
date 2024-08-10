import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import http from "../http"; // Adjust based on your API path

const Dashboard = () => {
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [totalStaff, setTotalStaff] = useState(0);
    const [dailyUsage, setDailyUsage] = useState([]);
    const [recentCustomers, setRecentCustomers] = useState([]);

    useEffect(() => {
        // Fetch total users
        http.get('/dashboard/users/count').then(res => setTotalUsers(res.data.totalUsers));

        // Fetch total users by roles
        http.get('/dashboard/users/roles').then(res => {
            const roles = res.data.roles;
            setTotalCustomers(roles.find(role => role.role === 'Customer')?.count || 0);
            setTotalStaff(roles.find(role => role.role === 'Staff')?.count || 0);
        });

        // Fetch daily usage statistics
        http.get('/daily-logins').then(res => setDailyUsage([{ date: "Today", usage: res.data.dailyLogins }]));

        // Fetch top 5 recent customers
        http.get('/dashboard/recent-customers').then(res => setRecentCustomers(res.data.recentCustomers));
    }, []);

    return (
        <Box sx={{ p: 3, backgroundColor: "#f0f0f0", minHeight: "100vh", p: 3, borderRadius: "8px"}}>
            <Typography
                variant="h4"
                sx={{ my: 2, textAlign: "center", color: "#e2160f", fontWeight: "bold"}}
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
                            <ul>
                                {recentCustomers.slice(0, 5).map(customer => (
                                    <li key={customer.id}>{customer.firstName} {customer.lastName} - {customer.email}</li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
