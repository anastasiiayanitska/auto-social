import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Divider,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CategoryIcon from "@mui/icons-material/Category";

import WorkIcon from "@mui/icons-material/Work";
import { ServicePost } from "../../../types/social.types";

interface ServicePostDetailProps {
  post: ServicePost;
}

const ServicePostDetail: React.FC<ServicePostDetailProps> = ({ post }) => {
  if (!post.service) return null;
  const service = post.service;

  const formatPrice = () => {
    if (service.price === undefined || service.price === null)
      return "Not specified";

    switch (service.priceType) {
      case "hourly":
        return `$${service.price.toLocaleString()} / hour`;
      case "fixed":
        return `$${service.price.toLocaleString()}`;
      case "negotiable":
        return `$${service.price.toLocaleString()} (Negotiable)`;
      default:
        return `$${service.price.toLocaleString()}`;
    }
  };

  return (
    <Box>
      <Typography variant="body1" sx={{ mb: 3 }}>
        {post.content}
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {service.title}
          </Typography>

          {service.price !== undefined && (
            <Typography variant="h6" color="primary" gutterBottom>
              {formatPrice()}
            </Typography>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Service Details
                </Typography>
                <Divider sx={{ my: 1 }} />

                {service.category && (
                  <Box display="flex" alignItems="center" mb={1}>
                    <CategoryIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      Category: {service.category}
                    </Typography>
                  </Box>
                )}

                {service.experience && (
                  <Box display="flex" alignItems="center" mb={1}>
                    <WorkIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      Experience: {service.experience}
                    </Typography>
                  </Box>
                )}

                {service.availability && (
                  <Box display="flex" alignItems="center" mb={1}>
                    <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      Availability: {service.availability}
                    </Typography>
                  </Box>
                )}
              </Box>

              {service.description && (
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Description
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" paragraph>
                    {service.description}
                  </Typography>
                </Box>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Contact Information
                </Typography>
                <Divider sx={{ my: 1 }} />

                {service.location && (
                  <Box display="flex" alignItems="center" mb={1}>
                    <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">{service.location}</Typography>
                  </Box>
                )}

                {service.contactPhone && (
                  <Box display="flex" alignItems="center" mb={1}>
                    <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {service.contactPhone}
                    </Typography>
                  </Box>
                )}

                {service.contactEmail && (
                  <Box display="flex" alignItems="center">
                    <EmailIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {service.contactEmail}
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
                  alt={`Service image ${index + 1}`}
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

export default ServicePostDetail;
