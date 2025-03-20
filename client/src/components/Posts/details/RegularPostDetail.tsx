import React from "react";
import { Box, Typography, CardMedia, Grid } from "@mui/material";
import { Post } from "../../../types/social.types";

interface RegularPostDetailProps {
  post: Post;
}

const RegularPostDetail: React.FC<RegularPostDetailProps> = ({ post }) => {
  return (
    <Box>
      <Typography variant="body1" sx={{ mb: 3 }}>
        {post.content}
      </Typography>
      {post.images && post.images.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            {post.images.map((image: string, index: number) => (
              <Grid item xs={12} md={6} key={index}>
                <CardMedia
                  component="img"
                  image={image}
                  alt={`Post image ${index + 1}`}
                  sx={{ height: 300, borderRadius: 1 }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default RegularPostDetail;
