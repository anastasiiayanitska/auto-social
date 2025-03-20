import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createPost } from "../../../store/post/postsThunks.tsx";
import {
  PostType,
  CreatePostData,
  ServicePost,
} from "../../../types/social.types.ts";
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

export const ServicePostCard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [service, setService] = useState<ServicePost["service"]>({
    title: "",
    price: undefined,
    priceType: "fixed",
    category: "",
    description: "",
    availability: "",
    location: "",
    contactPhone: "",
    contactEmail: "",
    experience: "",
  });

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleServiceChange = (
    field: keyof ServicePost["service"],
    value: any
  ) => {
    setService((prev) => ({ ...prev, [field]: value }));

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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate content (required)
    if (!content.trim()) {
      newErrors.content = "Post content is required";
    }

    // Validate required service fields
    if (!service.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!service.description.trim()) {
      newErrors.description = "Description is required";
    }

    // If optional fields are provided, validate their format
    if (service.price !== undefined && service.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (
      service.contactEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(service.contactEmail)
    ) {
      newErrors.contactEmail = "Please enter a valid email address";
    }

    if (
      service.contactPhone &&
      !/^\+?[0-9()-\s]{10,15}$/.test(service.contactPhone.replace(/\s/g, ""))
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
        postType: PostType.SERVICE,
        images: images.length ? images : undefined,
        service,
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
          Create Service Post
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          placeholder="Describe your service"
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
              label="Service Title"
              variant="outlined"
              value={service.title}
              onChange={(e) => handleServiceChange("title", e.target.value)}
              name="title"
              error={!!errors.title}
              helperText={errors.title}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Category"
              variant="outlined"
              value={service.category}
              onChange={(e) => handleServiceChange("category", e.target.value)}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Price (optional)"
              type="number"
              variant="outlined"
              value={service.price ?? ""}
              onChange={(e) =>
                handleServiceChange(
                  "price",
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
              name="price"
              error={!!errors.price}
              helperText={errors.price}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Price Type"
              variant="outlined"
              value={service.priceType}
              onChange={(e) => handleServiceChange("priceType", e.target.value)}
            >
              <MenuItem value="fixed">Fixed</MenuItem>
              <MenuItem value="hourly">Hourly</MenuItem>
              <MenuItem value="negotiable">Negotiable</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <TextField
          fullWidth
          multiline
          rows={4}
          label="Detailed Description"
          variant="outlined"
          placeholder="Detailed description of your service"
          value={service.description}
          onChange={(e) => handleServiceChange("description", e.target.value)}
          margin="normal"
          name="description"
          error={!!errors.description}
          helperText={errors.description}
          required
        />

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Availability"
              variant="outlined"
              placeholder="e.g. Weekdays 9-5"
              value={service.availability}
              onChange={(e) =>
                handleServiceChange("availability", e.target.value)
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Location"
              variant="outlined"
              value={service.location}
              onChange={(e) => handleServiceChange("location", e.target.value)}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Contact Phone"
              variant="outlined"
              value={service.contactPhone}
              onChange={(e) =>
                handleServiceChange("contactPhone", e.target.value)
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
              value={service.contactEmail}
              onChange={(e) =>
                handleServiceChange("contactEmail", e.target.value)
              }
              name="contactEmail"
              error={!!errors.contactEmail}
              helperText={errors.contactEmail}
            />
          </Grid>
        </Grid>

        <TextField
          fullWidth
          label="Experience"
          placeholder="e.g. '5 years in automotive repair'"
          variant="outlined"
          value={service.experience}
          onChange={(e) => handleServiceChange("experience", e.target.value)}
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
          Create Service Post
        </Button>
      </CardActions>
    </Card>
  );
};
