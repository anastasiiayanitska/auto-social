import React, { useEffect, useState } from "react";
import { Container, Box, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { getAllPosts } from "../../store/post/postsThunks";
import PostsList from "../../components/Posts/PostsList";
import SearchComponent from "../../components/Search/SearchComponent";
import { Post } from "../../types/social.types";

const AllPostsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading, error } = useSelector(
    (state: RootState) => state.posts
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  useEffect(() => {
    if (posts.length > 0) {
      filterPosts(searchQuery);
    } else {
      setFilteredPosts([]);
    }
  }, [posts, searchQuery]);

  const filterPosts = (query: string) => {
    if (!query.trim()) {
      setFilteredPosts(posts);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = posts.filter((post) => {
      // Search in all text fields of the post
      return (
        post.content?.toLowerCase().includes(lowercaseQuery) ||
        post.title?.toLowerCase().includes(lowercaseQuery) ||
        post.author?.username?.toLowerCase().includes(lowercaseQuery) ||
        // Add more fields as needed
        false
      );
    });

    setFilteredPosts(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <Container maxWidth="lg">
      <SearchComponent
        placeholder="Search posts by content, title, or author..."
        onSearch={handleSearch}
        initialQuery={searchQuery}
      />

      {loading && posts.length === 0 ? (
        <Box
          display="flex"
          justifyContent="center"
          minHeight="200px"
          alignItems="center"
        >
          <CircularProgress />
        </Box>
      ) : (
        <PostsList
          posts={filteredPosts}
          loading={loading}
          error={error}
          emptyMessage={
            searchQuery
              ? "No posts found matching your search."
              : "No posts found."
          }
        />
      )}
    </Container>
  );
};

export default AllPostsPage;
