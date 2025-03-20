import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store/store";
import { fetchAllUsers } from "../store/auth/userThunks";
import { Typography, Box, Container } from "@mui/material";
import UserList from "../components/Profile/UserList";
import SearchComponent from "../components/Search/SearchComponent";
import { AppDispatch } from "../store/store";

const GetAllUsers: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();
  const { users, isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (users.length > 0) {
      filterUsers(searchQuery);
    } else {
      setFilteredUsers([]);
    }
  }, [users, searchQuery]);

  const filterUsers = (query: string) => {
    if (!query.trim()) {
      setFilteredUsers(users);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = users.filter((user) => {
      return (
        user.username?.toLowerCase().includes(lowercaseQuery) ||
        user.firstName?.toLowerCase().includes(lowercaseQuery) ||
        user.lastName?.toLowerCase().includes(lowercaseQuery) ||
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(lowercaseQuery)
      );
    });

    setFilteredUsers(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  if (!isAuthenticated) {
    return <Typography>You are not authorized</Typography>;
  }

  return (
    <Container>
      <Box my={4}>
        <SearchComponent
          placeholder="Search users by name or username..."
          onSearch={handleSearch}
          initialQuery={searchQuery}
        />

        <UserList
          users={filteredUsers}
          loading={loading}
          error={error}
          emptyMessage={
            searchQuery
              ? "No users found matching your search."
              : "No users found."
          }
          onUserClick={handleUserClick}
        />
      </Box>
    </Container>
  );
};

export default GetAllUsers;
