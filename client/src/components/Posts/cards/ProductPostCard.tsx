import React, { useState } from "react";
import {
  Card,
  CardMedia,
  Typography,
  Box,
  Avatar,
  MobileStepper,
  Button,
  Chip,
} from "@mui/material";
import { Post, ProductPost } from "../../../types/social.types";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

interface ProductPostCardProps {
  post: ProductPost;
  onClick: (post: Post) => void;
}

const ProductPostCard: React.FC<ProductPostCardProps> = ({ post, onClick }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const maxSteps = post.images?.length || 0;

  const handleNext = (event: React.MouseEvent) => {
    event.stopPropagation();
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = (event: React.MouseEvent) => {
    event.stopPropagation();
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const username = post.user?.username || "Unknown user";
  const avatar = post.user?.avatar || "https://via.placeholder.com/40";
  const price = post.product?.price;

  return (
    <Card
      onClick={() => onClick(post)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        cursor: "pointer",
        height: "100%",
        transition: "transform 0.2s",
        position: "relative",
        borderLeft: "4px solid",
        borderColor: "primary.main",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: 3,
        },
      }}
    >
      {/* Price flag */}
      {price && (
        <Box
          sx={{
            position: "absolute",
            top: 150,
            right: 10,
            zIndex: 2,
            backgroundColor: "primary.main",
            color: "white",
            padding: "4px 10px",
            borderRadius: 2,

            fontSize: "24px",
          }}
        >
          ${price}
        </Box>
      )}

      {/* Image carousel taking full card size */}
      <Box sx={{ height: "100%", position: "relative" }}>
        <CardMedia
          component="img"
          sx={{
            height: "100%",
            minHeight: 300,
            objectFit: "cover",
          }}
          image={
            typeof post.images?.[activeStep] === "string"
              ? post.images[activeStep]
              : post.images?.[activeStep]?.url ||
                "https://via.placeholder.com/400x400"
          }
          alt={post.product?.title || "Product image"}
        />

        {/* User info at top */}
        <Box
          display="flex"
          alignItems="center"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            padding: 1.5,
            zIndex: 1,
          }}
        >
          <Avatar src={avatar} sx={{ width: 40, height: 40 }} />
          <Typography
            variant="subtitle1"
            sx={{ ml: 1, fontWeight: 500, color: "white" }}
          >
            {username}
          </Typography>
          <Chip
            icon={
              <ShoppingBagIcon
                sx={{
                  color: "primary.main",
                }}
              />
            }
            label="Product"
            size="small"
            sx={{
              position: "absolute",
              top: 20,
              right: 30,
              ml: "auto",
              border: "1px solid",
              borderColor: "primary.main",
              backgroundColor: "rgba(0,0,0,0.4)",
              color: "primary.main",
              "& .MuiChip-icon": {
                color: "primary.main",
              },
            }}
          />
        </Box>

        {/* Hover overlay with product info */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            padding: 2,
            transform: isHovered ? "translateY(0)" : "translateY(100%)",
            transition: "transform 0.3s ease",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
          }}
        >
          <Typography variant="h6" color="white">
            {post.product?.title || "Product"}
          </Typography>

          {(post.product?.brand || post.product?.model) && (
            <Typography variant="body2" color="rgba(255,255,255,0.8)">
              {post.product.brand && (
                <span>
                  Brand: <b>{post.product.brand}</b>
                </span>
              )}
              {post.product.brand && post.product.model && " | "}
              {post.product.model && (
                <span>
                  Model: <b>{post.product.model}</b>
                </span>
              )}
            </Typography>
          )}

          {post.product?.condition && (
            <Typography variant="body2" color="rgba(255,255,255,0.7)">
              Condition: {post.product.condition}
              {post.product.year && ` | Year: ${post.product.year}`}
            </Typography>
          )}

          <Typography
            variant="body2"
            color="rgba(255,255,255,0.9)"
            sx={{ mt: 0.5 }}
          >
            {post.content}
          </Typography>

          <Typography
            variant="body2"
            color="rgba(255,255,255,0.6)"
            sx={{ mt: 0.5 }}
          >
            {new Date(post.createdAt).toLocaleDateString()}
          </Typography>
        </Box>

        {/* Image navigation controls */}
        {post.images && post.images.length > 1 && (
          <MobileStepper
            steps={maxSteps}
            position="static"
            variant="dots"
            activeStep={activeStep}
            sx={{
              background: "transparent",
              position: "absolute",
              bottom: isHovered ? "auto" : 10,
              top: isHovered ? 60 : "auto",
              width: "100%",
              justifyContent: "center",
              zIndex: 1,
            }}
            nextButton={
              <Button
                size="small"
                onClick={handleNext}
                disabled={activeStep === maxSteps - 1}
                sx={{
                  minWidth: "auto",
                  backgroundColor: "rgba(255,255,255,0.6)",
                  position: "absolute",
                  right: 8,
                }}
              >
                <KeyboardArrowRight />
              </Button>
            }
            backButton={
              <Button
                size="small"
                onClick={handleBack}
                disabled={activeStep === 0}
                sx={{
                  minWidth: "auto",
                  backgroundColor: "rgba(255,255,255,0.6)",
                  position: "absolute",
                  left: 8,
                }}
              >
                <KeyboardArrowLeft />
              </Button>
            }
          />
        )}
      </Box>
    </Card>
  );
};

export default ProductPostCard;
