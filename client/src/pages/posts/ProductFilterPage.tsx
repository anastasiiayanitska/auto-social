import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  CircularProgress,
  TextField,
  Button,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { getAllPosts } from "../../store/post/postsThunks";
import PostsList from "../../components/Posts/PostsList";

const ProductFilterPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading, error } = useSelector(
    (state: RootState) => state.posts
  );

  const [filters, setFilters] = useState({
    brand: "",
    model: "",
    minPrice: "",
    maxPrice: "",
    year: "",
  });
  const [filteredPosts, setFilteredPosts] = useState(posts);

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  useEffect(() => {
    filterPosts();
  }, [posts, filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filterPosts = () => {
    let filtered = posts.filter((post) => {
      const product = post.product;
      if (!product) return false;

      return (
        (!filters.brand ||
          product.brand.toLowerCase().includes(filters.brand.toLowerCase())) &&
        (!filters.model ||
          product.model.toLowerCase().includes(filters.model.toLowerCase())) &&
        (!filters.minPrice || product.price >= Number(filters.minPrice)) &&
        (!filters.maxPrice || product.price <= Number(filters.maxPrice)) &&
        (!filters.year || product.year.toString() === filters.year)
      );
    });
    setFilteredPosts(filtered);
  };

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
          <TextField
            label="Brand"
            name="brand"
            value={filters.brand}
            onChange={handleFilterChange}
          />
          <TextField
            label="Model"
            name="model"
            value={filters.model}
            onChange={handleFilterChange}
          />
          <TextField
            label="Min Price"
            name="minPrice"
            type="number"
            value={filters.minPrice}
            onChange={handleFilterChange}
          />
          <TextField
            label="Max Price"
            name="maxPrice"
            type="number"
            value={filters.maxPrice}
            onChange={handleFilterChange}
          />
          <TextField
            label="Year"
            name="year"
            type="number"
            value={filters.year}
            onChange={handleFilterChange}
          />
          <Button variant="contained" onClick={filterPosts}>
            Apply Filters
          </Button>
        </Box>

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
            emptyMessage="No products found."
          />
        )}
      </Box>
    </Container>
  );
};

export default ProductFilterPage;
