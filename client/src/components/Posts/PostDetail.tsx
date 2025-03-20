import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { RootState } from "../../store/store";
import { getPostById } from "../../store/post/postsThunks.tsx";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Stack,
  Avatar,
  Tooltip,
  Container,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ChatIcon from "@mui/icons-material/Chat";
import { AppDispatch } from "../../store/store";

import PostInteractions from "../LikeAndSave/PostInteractions.tsx";
import DeletePostConfirmation from "./DeletePostConfirmation";
import RegularPostDetail from "./details/RegularPostDetail.tsx";
import ProductPostDetail from "./details/ProductPostDetail.tsx";
import ServicePostDetail from "./details/ServicePostDetail.tsx";

import { addMessage } from "../../store/features/messageSlice.ts";

const PostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { singlePost, loading, error } = useSelector(
    (state: RootState) => state.posts
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (postId) {
      dispatch(getPostById(postId));
    }
  }, [dispatch, postId]);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleEditClick = () => {
    navigate(`/posts/edit/${postId}`);
  };
  const handleStartChat = () => {
    if (
      !singlePost ||
      !singlePost.user ||
      typeof singlePost.user === "string" ||
      !user
    ) {
      return;
    }

    const authorId = singlePost.user._id;
    const postTitle = singlePost.title || "Untitled Post";
    const postType = singlePost.postType || "regular";

    // Додаємо повну URL-адресу поста, щоб користувач міг скопіювати її
    const fullPostUrl = `${window.location.origin}/posts/${postId}`;

    // Створюємо просте текстове повідомлення з URL
    const messageContent = `Hi! I want to talk about your post:"${postTitle}" \n\nLInk: ${fullPostUrl}`;

    // Розрахунок ID розмови
    const conversationId = [user._id, authorId].sort().join("-");

    dispatch(
      addMessage({
        conversationId,
        message: {
          _id: Date.now().toString(),
          senderId: user._id,
          receiverId: authorId,
          text: messageContent,
          read: false,
          createdAt: new Date().toISOString(),
        },
      })
    );

    // Переходимо на сторінку чату
    navigate(`/chat/${authorId}`, {
      state: { initialMessage: messageContent },
    });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center">
        {error}
      </Typography>
    );
  }

  if (!singlePost) {
    return <Typography align="center">Post not found.</Typography>;
  }

  const isAuthor =
    user &&
    singlePost.user &&
    (typeof singlePost.user === "string"
      ? user._id === singlePost.user
      : user._id === singlePost.user._id);

  const renderAuthorInfo = () => {
    if (!singlePost.user || typeof singlePost.user === "string") {
      return null;
    }

    return (
      <Box display="flex" alignItems="center" mb={2} color="white">
        <Avatar src={singlePost.user.avatar} alt={singlePost.user.username} />
        <Box ml={2}>
          <Typography variant="subtitle1" fontWeight="bold">
            {singlePost.user.username}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date(singlePost.createdAt).toLocaleString()}
          </Typography>
        </Box>
      </Box>
    );
  };

  const renderPostContent = () => {
    switch (singlePost.postType) {
      case "regular":
        return <RegularPostDetail post={singlePost} />;
      case "product":
        return <ProductPostDetail post={singlePost} />;
      case "service":
        return <ServicePostDetail post={singlePost} />;
      default:
        return (
          <Typography variant="body1" color="white">
            {singlePost.content}
          </Typography>
        );
    }
  };

  return (
    <>
      <Container color="white">
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h4" gutterBottom color="white">
              Post Details
            </Typography>
            <Stack direction="row" spacing={2}>
              {isAuthor ? (
                <>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={handleEditClick}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleDeleteClick}
                  >
                    Delete
                  </Button>
                </>
              ) : (
                // Показуємо кнопку чату тільки якщо користувач не є автором поста
                user &&
                singlePost.user &&
                typeof singlePost.user !== "string" && (
                  <Tooltip title="Write to the author">
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<ChatIcon />}
                      onClick={handleStartChat}
                    >
                      Write to the author
                    </Button>
                  </Tooltip>
                )
              )}
            </Stack>
          </Box>

          {renderAuthorInfo()}
          {renderPostContent()}
        </CardContent>
      </Container>

      {/* Add interactions component */}
      {postId && (
        <PostInteractions
          postId={postId}
          likesCount={singlePost.likesCount || 0}
          commentsCount={singlePost.commentsCount || 0}
        />
      )}

      {/* Delete confirmation dialog */}
      {postId && (
        <DeletePostConfirmation
          postId={postId}
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        />
      )}
    </>
  );
};

export default PostDetail;
