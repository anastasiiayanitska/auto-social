import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createPost } from "../../../store/post/postsThunks.tsx";
import { PostType, CreatePostData } from "../../../types/social.types.ts";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  FormHelperText,
} from "@mui/material";
import { AppDispatch } from "../../../store/store.ts";
import { useNavigate } from "react-router-dom";
// Regular Post Card Component
export const RegularPostCard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [contentError, setContentError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;

    // Content validation
    if (!content.trim()) {
      setContentError("Content is required");
      isValid = false;
    } else {
      setContentError("");
    }

    return isValid;
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    if (validateForm()) {
      const postData: CreatePostData = {
        content,
        postType: PostType.REGULAR,
        images: images.length ? images : undefined,
      };
      dispatch(createPost(postData));
      setIsSubmitting(false);
      navigate("/posts");
    } else {
      setIsSubmitting(false);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
    if (contentError && e.target.value.trim()) {
      setContentError("");
    }
  };

  return (
    <Card sx={{ maxWidth: 500, mx: "auto", boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
          Create Post
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          placeholder="What's on your mind?"
          value={content}
          onChange={handleContentChange}
          margin="normal"
          error={!!contentError}
          helperText={contentError}
          required
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
          Create Post
        </Button>
      </CardActions>
    </Card>
  );
};
