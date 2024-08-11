import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Menu,
  MenuItem,
  Input,
  Chip,
  InputAdornment,
} from "@mui/material";
import {
  Sort,
  FilterList,
  Visibility,
  Edit,
  Delete,
  Search,
  Clear,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import http from "../http";

function ViewUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userId, setUserId] = useState(null);
  const [filterRole, setFilterRole] = useState("");
  const [filterMembership, setFilterMembership] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [open, setOpen] = useState(false);
  const [anchorElRole, setAnchorElRole] = useState(null);
  const [anchorElSort, setAnchorElSort] = useState(null);
  const [anchorElMembership, setAnchorElMembership] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await http.get("/user");
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filterRole, filterMembership, sortOrder, search, users]);

  const handleDelete = (id) => {
    setUserId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setUserId(null);
  };

  const deleteUser = () => {
    if (userId) {
      http
        .delete(`/user/${userId}`)
        .then((res) => {
          setUsers(users.filter((user) => user.id !== userId));
          toast.success("User deleted successfully");
          setOpen(false);
          setUserId(null);
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
          toast.error("Failed to delete user");
          setOpen(false);
        });
    }
  };

  const applyFilters = () => {
    let updatedUsers = [...users];

    if (filterRole) {
      updatedUsers = updatedUsers.filter((user) => user.role === filterRole);
    }

    if (filterMembership) {
      updatedUsers = updatedUsers.filter(
        (user) => user.membershipType === filterMembership
      );
    }

    if (search) {
      updatedUsers = updatedUsers.filter(
        (user) =>
          user.firstName.toLowerCase().includes(search.toLowerCase()) ||
          user.lastName.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    switch (sortOrder) {
      case "newest":
        updatedUsers.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case "oldest":
        updatedUsers.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        break;
      case "alphabetical":
        updatedUsers.sort((a, b) => a.firstName.localeCompare(b.firstName));
        break;
      case "default":
      default:
        updatedUsers.sort((a, b) => a.id - b.id);
        break;
    }

    setFilteredUsers(updatedUsers);
  };

  const getMembershipStyle = (membershipType) => {
    switch (membershipType) {
      case "Gold":
        return {
          backgroundColor: "#FFC107",
          color: "#000",
          fontWeight: "bold",
          borderRadius: "5px",
          padding: "4px 12px",
          textAlign: "center",
        };
      case "Silver":
        return {
          backgroundColor: "#C0C0C0",
          color: "#000",
          fontWeight: "bold",
          borderRadius: "5px",
          padding: "4px 12px",
          textAlign: "center",
        };
      case "Bronze":
        return {
          backgroundColor: "#CD7F32",
          color: "#000",
          fontWeight: "bold",
          borderRadius: "5px",
          padding: "4px 12px",
          textAlign: "center",
        };
      default:
        return {
          backgroundColor: "#E0E0E0",
          color: "#000",
          fontWeight: "bold",
          borderRadius: "5px",
          padding: "4px 12px",
          textAlign: "center",
        };
    }
  };

  const getRoleStyle = (role) => {
    switch (role) {
      case "Admin":
        return {
          backgroundColor: "#D32F2F",
          color: "#fff",
          fontWeight: "bold",
          borderRadius: "5px",
          padding: "4px 12px",
          textAlign: "center",
        };
      case "Staff":
        return {
          backgroundColor: "#388E3C",
          color: "#fff",
          fontWeight: "bold",
          borderRadius: "5px",
          padding: "4px 12px",
          textAlign: "center",
        };
      case "Customer":
        return {
          backgroundColor: "#FFEB3B",
          color: "#000",
          fontWeight: "bold",
          borderRadius: "5px",
          padding: "4px 12px",
          textAlign: "center",
        };
      default:
        return {};
    }
  };

  const handleRoleFilterClick = (event) => {
    setAnchorElRole(event.currentTarget);
  };

  const handleMembershipFilterClick = (event) => {
    setAnchorElMembership(event.currentTarget);
  };

  const handleSortFilterClick = (event) => {
    setAnchorElSort(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorElRole(null);
    setAnchorElSort(null);
    setAnchorElMembership(null);
  };

  const handleFilterChange = (value, type) => {
    if (type === "role") {
      setFilterRole(value);
    } else if (type === "membership") {
      setFilterMembership(value);
    } else if (type === "sort") {
      setSortOrder(value);
    }
    handleFilterClose();
  };

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const onClickClear = () => {
    setSearch("");
    applyFilters();
  };

  const handleDeleteFilter = () => {
    setFilterRole("");
  };

  const handleDeleteMembershipFilter = () => {
    setFilterMembership("");
  };

  const handleDeleteSortFilter = () => {
    setSortOrder("default");
  };

  const capitalize = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  return (
    <Box
      sx={{
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
        User Overview
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Input
            value={search}
            placeholder="Search..."
            onChange={onSearchChange}
            sx={{ mr: 2, width: "300px", borderBottom: "1px solid gray" }}
            startAdornment={
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            }
          />
          <Tooltip title="Clear">
            <IconButton color="primary" onClick={onClickClear}>
              <Clear />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
            <Typography variant="body1" sx={{ mr: 1 }}>
              Role:
            </Typography>
            <IconButton onClick={handleRoleFilterClick}>
              <FilterList />
            </IconButton>
          </Box>
          <Menu
            anchorEl={anchorElRole}
            open={Boolean(anchorElRole)}
            onClose={handleFilterClose}
          >
            <MenuItem onClick={() => handleFilterChange("", "role")}>
              All Roles
            </MenuItem>
            <MenuItem onClick={() => handleFilterChange("Admin", "role")}>
              Admin
            </MenuItem>
            <MenuItem onClick={() => handleFilterChange("Staff", "role")}>
              Staff
            </MenuItem>
            <MenuItem onClick={() => handleFilterChange("Customer", "role")}>
              Customer
            </MenuItem>
          </Menu>

          <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
            <Typography variant="body1" sx={{ mr: 1 }}>
              Membership:
            </Typography>
            <IconButton onClick={handleMembershipFilterClick}>
              <FilterList />
            </IconButton>
          </Box>
          <Menu
            anchorEl={anchorElMembership}
            open={Boolean(anchorElMembership)}
            onClose={handleFilterClose}
          >
            <MenuItem onClick={() => handleFilterChange("", "membership")}>
              All Memberships
            </MenuItem>
            <MenuItem onClick={() => handleFilterChange("Gold", "membership")}>
              Gold
            </MenuItem>
            <MenuItem
              onClick={() => handleFilterChange("Silver", "membership")}
            >
              Silver
            </MenuItem>
            <MenuItem
              onClick={() => handleFilterChange("Bronze", "membership")}
            >
              Bronze
            </MenuItem>
          </Menu>

          <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
            <Typography variant="body1" sx={{ mr: 1 }}>
              Sort:
            </Typography>
            <IconButton onClick={handleSortFilterClick}>
              <Sort />
            </IconButton>
          </Box>
          <Menu
            anchorEl={anchorElSort}
            open={Boolean(anchorElSort)}
            onClose={handleFilterClose}
          >
            <MenuItem onClick={() => handleFilterChange("default", "sort")}>
              User ID (Default)
            </MenuItem>
            <MenuItem onClick={() => handleFilterChange("newest", "sort")}>
              Most Recent
            </MenuItem>
            <MenuItem onClick={() => handleFilterChange("oldest", "sort")}>
              Oldest
            </MenuItem>
            <MenuItem
              onClick={() => handleFilterChange("alphabetical", "sort")}
            >
              Alphabetical
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Active Filters */}
      <Box sx={{ display: "flex", flexWrap: "wrap", mb: 2 }}>
        {filterRole && (
          <Chip
            label={`Role: ${filterRole}`}
            onDelete={handleDeleteFilter}
            sx={{ mb: 1, mr: 1 }}
          />
        )}
        {filterMembership && (
          <Chip
            label={`Membership: ${filterMembership}`}
            onDelete={handleDeleteMembershipFilter}
            sx={{ mb: 1, mr: 1 }}
          />
        )}
        {sortOrder !== "default" && (
          <Chip
            label={`Sort: ${capitalize(sortOrder)}`}
            onDelete={handleDeleteSortFilter}
            sx={{ mb: 1, mr: 1 }}
          />
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>User ID</strong>
              </TableCell>
              <TableCell>
                <strong>First Name</strong>{" "}
              </TableCell>
              <TableCell>
                <strong>Last Name</strong>
              </TableCell>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>
                <strong>Mobile Number</strong>
              </TableCell>
              <TableCell>
                <strong>Role</strong>
              </TableCell>
              <TableCell>
                <strong>Membership</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.mobileNumber ? user.mobileNumber : "N/A"}
                </TableCell>
                <TableCell>
                  <Box sx={getRoleStyle(user.role)}>{user.role}</Box>
                </TableCell>
                <TableCell>
                  <Box sx={getMembershipStyle(user.membershipType)}>
                    {user.membershipType ? user.membershipType : "N/A"}
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Link to={`/admin/users/${user.id}/view`}>
                    <Tooltip title="View Details">
                      <IconButton color="secondary" sx={{ padding: "4px" }}>
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                  </Link>
                  <Link to={`/admin/users/${user.id}/edit`}>
                    <Tooltip title="Edit User">
                      <IconButton color="secondary" sx={{ padding: "4px" }}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  </Link>
                  <Tooltip title="Delete User">
                    <IconButton
                      color="error"
                      sx={{
                        padding: "4px",
                        visibility: user.id === 1 ? "hidden" : "visible",
                      }}
                      onClick={() => handleDelete(user.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ color: "#e2160f", fontWeight: "bold" }}>{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={{ mb: 2 }}>
            Are you sure you want to delete this user? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={deleteUser} color="error" autoFocus variant="contained" >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ViewUsers;
