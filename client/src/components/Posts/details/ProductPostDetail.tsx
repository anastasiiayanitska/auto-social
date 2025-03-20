import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Divider,
  Chip,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SpeedIcon from "@mui/icons-material/Speed";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import SettingsIcon from "@mui/icons-material/Settings";
import BuildIcon from "@mui/icons-material/Build";
import { ProductPost } from "../../../types/social.types";

interface ProductPostDetailProps {
  post: ProductPost;
}

const ProductPostDetail: React.FC<ProductPostDetailProps> = ({ post }) => {
  if (!post.product) return null;
  const product = post.product;

  return (
    <Box>
      <Typography variant="body1" sx={{ mb: 3 }}>
        {post.content}
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {product.title}
          </Typography>
          <Typography variant="h6" color="primary" gutterBottom>
            ${product.price.toLocaleString()}
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Vehicle Details
                </Typography>
                <Divider sx={{ my: 1 }} />

                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Brand:
                    </Typography>
                    <Typography variant="body1">{product.brand}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Model:
                    </Typography>
                    <Typography variant="body1">{product.model}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Year:
                    </Typography>
                    <Typography variant="body1">{product.year}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Condition:
                    </Typography>
                    <Typography variant="body1">{product.condition}</Typography>
                  </Grid>
                </Grid>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Technical Specifications
                </Typography>
                <Divider sx={{ my: 1 }} />

                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center">
                      <DirectionsCarIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        {product.vehicleType}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center">
                      <ColorLensIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2">{product.color}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center">
                      <SpeedIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        {product.mileage} miles
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center">
                      <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        {product.engineType}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center">
                      <BuildIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        {product.transmission}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              {product.features && product.features.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Features
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {product.features.map((feature: string, index: number) => (
                      <Chip key={index} label={feature} size="small" />
                    ))}
                  </Box>
                </Box>
              )}

              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Contact Information
                </Typography>
                <Divider sx={{ my: 1 }} />

                {product.location && (
                  <Box display="flex" alignItems="center" mb={1}>
                    <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">{product.location}</Typography>
                  </Box>
                )}

                {product.contactPhone && (
                  <Box display="flex" alignItems="center" mb={1}>
                    <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {product.contactPhone}
                    </Typography>
                  </Box>
                )}

                {product.contactEmail && (
                  <Box display="flex" alignItems="center">
                    <EmailIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {product.contactEmail}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {post.images && post.images.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Images
          </Typography>
          <Grid container spacing={2}>
            {post.images.map((image: string, index: number) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <CardMedia
                  component="img"
                  image={image}
                  alt={`Product image ${index + 1}`}
                  sx={{ height: 200, borderRadius: 1 }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default ProductPostDetail;
