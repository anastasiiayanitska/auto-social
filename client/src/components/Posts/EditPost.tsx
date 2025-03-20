import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Container,
  Grid,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Chip,
} from "@mui/material";
import { getPostById, updatePost } from "../../store/post/postsThunks";
import { RootState } from "../../store/store";
import { UpdatePostData, Post } from "../../types/social.types";

const EditPost: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const singlePost = useSelector((state: RootState) => state.posts.singlePost);
  const loading = useSelector((state: RootState) => state.posts.loading);
  const error = useSelector((state: RootState) => state.posts.error);

  // State for regular post
  const [content, setContent] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);

  // State for product post
  const [productDetails, setProductDetails] = useState({
    title: "",
    price: "",
    condition: "used",
    year: "",
    model: "",
    brand: "",
    color: "",
    vehicleType: "",
    mileage: "",
    engineType: "",
    transmission: "",
    features: "",
    location: "",
    contactPhone: "",
    contactEmail: "",
  });

  // State for service post
  const [serviceDetails, setServiceDetails] = useState({
    title: "",
    price: "",
    priceType: "fixed",
    category: "",
    description: "",
    availability: "",
    location: "",
    contactPhone: "",
    contactEmail: "",
    experience: "",
  });

  // Fetch post on component mount
  useEffect(() => {
    if (postId) {
      dispatch(getPostById(postId) as any);
    }
  }, [dispatch, postId]);

  // Populate form with post data when available
  useEffect(() => {
    if (singlePost) {
      setContent(singlePost.content || "");

      if (singlePost.images && singlePost.images.length > 0) {
        setImagePreviews(singlePost.images);
      }

      if (singlePost.postType === "product" && singlePost.product) {
        setProductDetails({
          title: singlePost.product.title || "",
          price: singlePost.product.price?.toString() || "",
          condition: singlePost.product.condition || "used",
          year: singlePost.product.year || "",
          model: singlePost.product.model || "",
          brand: singlePost.product.brand || "",
          color: singlePost.product.color || "",
          vehicleType: singlePost.product.vehicleType || "",
          mileage: singlePost.product.mileage || "",
          engineType: singlePost.product.engineType || "",
          transmission: singlePost.product.transmission || "",
          features: Array.isArray(singlePost.product.features)
            ? singlePost.product.features.join(", ")
            : singlePost.product.features || "",
          location: singlePost.product.location || "",
          contactPhone: singlePost.product.contactPhone || "",
          contactEmail: singlePost.product.contactEmail || "",
        });
      }

      if (singlePost.postType === "service" && singlePost.service) {
        setServiceDetails({
          title: singlePost.service.title || "",
          price: singlePost.service.price?.toString() || "",
          priceType: singlePost.service.priceType || "fixed",
          category: singlePost.service.category || "",
          description: singlePost.service.description || "",
          availability: singlePost.service.availability || "",
          location: singlePost.service.location || "",
          contactPhone: singlePost.service.contactPhone || "",
          contactEmail: singlePost.service.contactEmail || "",
          experience: singlePost.service.experience || "",
        });
      }
    }
  }, [singlePost]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);

      // Add new images to state
      setNewImages([...newImages, ...filesArray]);

      // Create URLs for previews
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...newPreviews]);
    }
  };

  const handleRemoveImage = (index: number) => {
    // Remove preview
    const updatedPreviews = [...imagePreviews];
    updatedPreviews.splice(index, 1);
    setImagePreviews(updatedPreviews);

    // If removing a new image, update newImages state
    if (index >= (singlePost?.images?.length || 0)) {
      const newIndex = index - (singlePost?.images?.length || 0);
      const updatedNewImages = [...newImages];
      updatedNewImages.splice(newIndex, 1);
      setNewImages(updatedNewImages);
    }
  };

  const handleProductChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setProductDetails({
      ...productDetails,
      [name as string]: value,
    });
  };

  const handleServiceChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setServiceDetails({
      ...serviceDetails,
      [name as string]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit button clicked"); // Add this line

    if (!postId || !singlePost) return;

    console.log("PostId and singlePost are available");

    const updateData: UpdatePostData = {
      content,
      images: newImages.length > 0 ? newImages : undefined,
    };

    // Add product details if this is a product post
    if (singlePost.postType === "product") {
      updateData.product = {
        ...productDetails,
        features: productDetails.features
          .split(",")
          .map((feature) => feature.trim())
          .filter((feature) => feature.length > 0),
        price: parseFloat(productDetails.price) || 0,
      };
    }

    // Add service details if this is a service post
    if (singlePost.postType === "service") {
      updateData.service = {
        ...serviceDetails,
        price: parseFloat(serviceDetails.price) || 0,
      };
    }

    try {
      const resultAction = await dispatch(
        updatePost({
          postId,
          updateData,
        }) as any
      );

      if (updatePost.fulfilled.match(resultAction)) {
        navigate(`/posts/${postId}`);
      }
    } catch (err) {
      console.error("Failed to update post:", err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!singlePost) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        <Typography variant="h5">Post not found</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3, mt: 3, mb: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Edit{" "}
          {singlePost.postType === "product"
            ? "Product"
            : singlePost.postType === "service"
              ? "Service"
              : "Post"}
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          {/* Common fields for all post types */}
          <TextField
            label="Post Content"
            fullWidth
            multiline
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            margin="normal"
          />

          {/* Product specific fields */}
          {singlePost.postType === "product" && (
            <>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Product Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Product Title"
                    fullWidth
                    name="title"
                    value={productDetails.title}
                    onChange={handleProductChange}
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Price"
                    fullWidth
                    name="price"
                    value={productDetails.price}
                    onChange={handleProductChange}
                    margin="normal"
                    required
                    type="number"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Condition</InputLabel>
                    <Select
                      name="condition"
                      value={productDetails.condition}
                      onChange={handleProductChange}
                      label="Condition"
                    >
                      <MenuItem value="new">New</MenuItem>
                      <MenuItem value="used">Used</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Year"
                    fullWidth
                    name="year"
                    value={productDetails.year}
                    onChange={handleProductChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Model"
                    fullWidth
                    name="model"
                    value={productDetails.model}
                    onChange={handleProductChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Brand"
                    fullWidth
                    name="brand"
                    value={productDetails.brand}
                    onChange={handleProductChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Color"
                    fullWidth
                    name="color"
                    value={productDetails.color}
                    onChange={handleProductChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Vehicle Type"
                    fullWidth
                    name="vehicleType"
                    value={productDetails.vehicleType}
                    onChange={handleProductChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Mileage"
                    fullWidth
                    name="mileage"
                    value={productDetails.mileage}
                    onChange={handleProductChange}
                    margin="normal"
                    type="number"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Engine Type"
                    fullWidth
                    name="engineType"
                    value={productDetails.engineType}
                    onChange={handleProductChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Transmission"
                    fullWidth
                    name="transmission"
                    value={productDetails.transmission}
                    onChange={handleProductChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Features (comma-separated)"
                    fullWidth
                    multiline
                    name="features"
                    value={productDetails.features}
                    onChange={handleProductChange}
                    margin="normal"
                    helperText="Enter features separated by commas"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Location"
                    fullWidth
                    name="location"
                    value={productDetails.location}
                    onChange={handleProductChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Contact Phone"
                    fullWidth
                    name="contactPhone"
                    value={productDetails.contactPhone}
                    onChange={handleProductChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Contact Email"
                    fullWidth
                    name="contactEmail"
                    value={productDetails.contactEmail}
                    onChange={handleProductChange}
                    margin="normal"
                    type="email"
                  />
                </Grid>
              </Grid>
            </>
          )}

          {/* Service specific fields */}
          {singlePost.postType === "service" && (
            <>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Service Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Service Title"
                    fullWidth
                    name="title"
                    value={serviceDetails.title}
                    onChange={handleServiceChange}
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Price"
                    fullWidth
                    name="price"
                    value={serviceDetails.price}
                    onChange={handleServiceChange}
                    margin="normal"
                    required
                    type="number"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Price Type</InputLabel>
                    <Select
                      name="priceType"
                      value={serviceDetails.priceType}
                      onChange={handleServiceChange}
                      label="Price Type"
                    >
                      <MenuItem value="fixed">Fixed</MenuItem>
                      <MenuItem value="hourly">Hourly</MenuItem>
                      <MenuItem value="negotiable">Negotiable</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Category"
                    fullWidth
                    name="category"
                    value={serviceDetails.category}
                    onChange={handleServiceChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Service Description"
                    fullWidth
                    multiline
                    rows={3}
                    name="description"
                    value={serviceDetails.description}
                    onChange={handleServiceChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Availability"
                    fullWidth
                    name="availability"
                    value={serviceDetails.availability}
                    onChange={handleServiceChange}
                    margin="normal"
                    placeholder="e.g., Mon-Fri, 9:00-18:00"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Experience"
                    fullWidth
                    name="experience"
                    value={serviceDetails.experience}
                    onChange={handleServiceChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Location"
                    fullWidth
                    name="location"
                    value={serviceDetails.location}
                    onChange={handleServiceChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Contact Phone"
                    fullWidth
                    name="contactPhone"
                    value={serviceDetails.contactPhone}
                    onChange={handleServiceChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Contact Email"
                    fullWidth
                    name="contactEmail"
                    value={serviceDetails.contactEmail}
                    onChange={handleServiceChange}
                    margin="normal"
                    type="email"
                  />
                </Grid>
              </Grid>
            </>
          )}

          {/* Image upload section */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Images</Typography>
            <Button variant="contained" component="label" sx={{ mt: 1 }}>
              Add Images
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleImageChange}
              />
            </Button>

            {/* Image previews */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {imagePreviews.map((preview, index) => (
                <Grid item xs={4} sm={3} md={2} key={index}>
                  <Box
                    sx={{
                      position: "relative",
                      height: 100,
                      width: "100%",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleRemoveImage(index)}
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        minWidth: 30,
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        p: 0,
                      }}
                    >
                      X
                    </Button>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Form actions */}
          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Save Changes"}
            </Button>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default EditPost;
