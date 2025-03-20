import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createPost } from "../../../store/post/postsThunks.tsx";
import {
  PostType,
  CreatePostData,
  ProductPost,
} from "../../../types/social.types.ts";
import {
  VehicleType,
  EngineType,
  TransmissionType,
  Condition,
} from "../../../types/vehicle.types.ts";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { AppDispatch } from "../../../store/store.ts";
import { useNavigate } from "react-router-dom";
export const ProductPostCard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [product, setProduct] = useState<ProductPost["product"]>({
    title: "",
    price: 0,
    condition: Condition.USED,
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    color: "",
    vehicleType: VehicleType.SEDAN,
    mileage: 0,
    engineType: EngineType.GASOLINE,
    transmission: TransmissionType.MANUAL,
    features: [],
    location: "",
    contactPhone: "",
    contactEmail: "",
  });

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleProductChange = (
    field: keyof ProductPost["product"],
    value: any
  ) => {
    setProduct((prev) => ({ ...prev, [field]: value }));

    // Clear error for the field when it changes
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
    if (errors.content && e.target.value.trim()) {
      setErrors((prev) => ({ ...prev, content: "" }));
    }
  };

  const handleFeaturesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const features = e.target.value.split(",").map((feature) => feature.trim());
    setProduct((prev) => ({ ...prev, features }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate content (required)
    if (!content.trim()) {
      newErrors.content = "Post content is required";
    }

    // Validate required product fields
    if (!product.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (product.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!product.brand.trim()) {
      newErrors.brand = "Brand is required";
    }

    if (!product.model.trim()) {
      newErrors.model = "Model is required";
    }

    if (
      !product.year ||
      product.year < 1900 ||
      product.year > new Date().getFullYear() + 1
    ) {
      newErrors.year = "Please enter a valid year";
    }

    if (!product.color.trim()) {
      newErrors.color = "Color is required";
    }

    // If optional fields are provided, validate their format
    if (
      product.contactEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(product.contactEmail)
    ) {
      newErrors.contactEmail = "Please enter a valid email address";
    }

    if (
      product.contactPhone &&
      !/^\+?[0-9()-\s]{10,15}$/.test(product.contactPhone.replace(/\s/g, ""))
    ) {
      newErrors.contactPhone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    if (validateForm()) {
      const postData: CreatePostData = {
        content,
        postType: PostType.PRODUCT,
        images: images.length ? images : undefined,
        product,
      };

      dispatch(createPost(postData));
      setIsSubmitting(false);
      navigate("/posts");
    } else {
      setIsSubmitting(false);
      // Scroll to the first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  return (
    <Card sx={{ maxWidth: 600, mx: "auto", boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
          Create Product Post
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          placeholder="Describe your product"
          value={content}
          onChange={handleContentChange}
          margin="normal"
          name="content"
          error={!!errors.content}
          helperText={errors.content}
          required
        />

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Title"
              variant="outlined"
              value={product.title}
              onChange={(e) => handleProductChange("title", e.target.value)}
              name="title"
              error={!!errors.title}
              helperText={errors.title}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Price"
              type="number"
              variant="outlined"
              value={product.price}
              onChange={(e) =>
                handleProductChange("price", Number(e.target.value))
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
              name="price"
              error={!!errors.price}
              helperText={errors.price}
              required
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Condition"
              variant="outlined"
              value={product.condition}
              onChange={(e) => handleProductChange("condition", e.target.value)}
              required
            >
              <MenuItem value={Condition.NEW}>New</MenuItem>
              <MenuItem value={Condition.USED}>Used</MenuItem>
              <MenuItem value={Condition.FOR_PARTS}>For Parts</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Vehicle Type"
              variant="outlined"
              value={product.vehicleType}
              onChange={(e) =>
                handleProductChange("vehicleType", e.target.value)
              }
              required
            >
              {Object.values(VehicleType).map((type) => (
                <MenuItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Brand"
              variant="outlined"
              value={product.brand}
              onChange={(e) => handleProductChange("brand", e.target.value)}
              name="brand"
              error={!!errors.brand}
              helperText={errors.brand}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Model"
              variant="outlined"
              value={product.model}
              onChange={(e) => handleProductChange("model", e.target.value)}
              name="model"
              error={!!errors.model}
              helperText={errors.model}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Year"
              type="number"
              variant="outlined"
              value={product.year}
              onChange={(e) =>
                handleProductChange("year", Number(e.target.value))
              }
              name="year"
              error={!!errors.year}
              helperText={errors.year}
              required
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Color"
              variant="outlined"
              value={product.color}
              onChange={(e) => handleProductChange("color", e.target.value)}
              name="color"
              error={!!errors.color}
              helperText={errors.color}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Mileage"
              type="number"
              variant="outlined"
              value={product.mileage}
              onChange={(e) =>
                handleProductChange("mileage", Number(e.target.value))
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">mi</InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              label="Engine Type"
              variant="outlined"
              value={product.engineType}
              onChange={(e) =>
                handleProductChange("engineType", e.target.value)
              }
            >
              {Object.values(EngineType).map((type) => (
                <MenuItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Transmission"
              variant="outlined"
              value={product.transmission}
              onChange={(e) =>
                handleProductChange("transmission", e.target.value)
              }
            >
              {Object.values(TransmissionType).map((type) => (
                <MenuItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() +
                    type.slice(1).replace("_", " ")}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Location"
              variant="outlined"
              value={product.location}
              onChange={(e) => handleProductChange("location", e.target.value)}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Contact Phone"
              variant="outlined"
              value={product.contactPhone}
              onChange={(e) =>
                handleProductChange("contactPhone", e.target.value)
              }
              name="contactPhone"
              error={!!errors.contactPhone}
              helperText={errors.contactPhone}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Contact Email"
              variant="outlined"
              value={product.contactEmail}
              onChange={(e) =>
                handleProductChange("contactEmail", e.target.value)
              }
              name="contactEmail"
              error={!!errors.contactEmail}
              helperText={errors.contactEmail}
            />
          </Grid>
        </Grid>

        <TextField
          fullWidth
          label="Features"
          placeholder="Features (comma separated)"
          variant="outlined"
          value={product.features?.join(", ")}
          onChange={handleFeaturesChange}
          margin="normal"
        />

        <Box sx={{ mt: 2, mb: 2 }}>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ p: 1.5 }}
          >
            Upload Images
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
          </Button>
          {images.length > 0 && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {images.length} {images.length === 1 ? "image" : "images"}{" "}
              selected
            </Typography>
          )}
        </Box>
      </CardContent>

      <CardActions>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
          sx={{ mb: 1, mx: 1 }}
        >
          Create Product Post
        </Button>
      </CardActions>
    </Card>
  );
};
