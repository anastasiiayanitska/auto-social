import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Avatar,
  MobileStepper,
  Button,
} from "@mui/material";
import { Post } from "../../../types/social.types";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

interface RegularPostCardProps {
  post: Post;
  onClick: (post: Post) => void;
}

const RegularPostCard: React.FC<RegularPostCardProps> = ({ post, onClick }) => {
  const [activeStep, setActiveStep] = useState(0);
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

  return (
    <Card
      onClick={() => onClick(post)}
      sx={{
        cursor: "pointer",
        height: "100%",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: 3,
        },
      }}
    >
      {/* User info */}
      <Box display="flex" alignItems="center" p={1.5} pb={0}>
        <Avatar src={avatar} sx={{ width: 40, height: 40 }} />
        <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 500 }}>
          {username}
        </Typography>
      </Box>

      {/* Image carousel */}
      {post.images && post.images.length > 0 && (
        <Box position="relative">
          <CardMedia
            component="img"
            height="220"
            image={
              typeof post.images[activeStep] === "string"
                ? post.images[activeStep]
                : post.images[activeStep]?.url ||
                  "https://via.placeholder.com/400x220"
            }
            alt={post.content || "Post image"}
          />

          {post.images.length > 1 && (
            <MobileStepper
              steps={maxSteps}
              position="static"
              variant="dots"
              activeStep={activeStep}
              sx={{
                background: "transparent",
                position: "absolute",
                bottom: 0,
                width: "100%",
                justifyContent: "center",
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
                    bottom: 8,
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
                    bottom: 8,
                  }}
                >
                  <KeyboardArrowLeft />
                </Button>
              }
            />
          )}
        </Box>
      )}

      <CardContent>
        <Typography variant="body1">{post.content}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {new Date(post.createdAt).toLocaleDateString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default RegularPostCard;
