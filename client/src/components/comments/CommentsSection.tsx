import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  createComment,
  getPostComments,
  deleteComment,
} from "../../store/post/interactionThunks";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  CircularProgress,
  Paper,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import { AppDispatch } from "../../store/store";
import { Comment } from "../../types/social.types";
const CommentsSection = ({ postId }: { postId: string }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [commentContent, setCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const comments = useSelector(
    (state: RootState) => state.interactions.comments[postId] || []
  );
  const loading = useSelector(
    (state: RootState) => state.interactions.loadingComments
  );
  const currentUser = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    dispatch(getPostComments(postId));
  }, [dispatch, postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Отримати authorId поста звідкись (наприклад, з пропсів або запиту)
      // Припустимо, що ви додали новий проп authorId
      const resultAction = await dispatch(
        createComment({
          postId,
          content: commentContent,
          authorId: currentUser._id, // Додати authorId
        })
      );

      if (createComment.fulfilled.match(resultAction)) {
        setCommentContent("");
        await dispatch(getPostComments(postId));
      } else {
        setError(
          resultAction.payload || "Failed to post comment. Please try again."
        );
      }
    } catch (error: any) {
      setError(error.message || "Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!commentId) {
      console.error("No comment ID provided for deletion.");
      return;
    }

    try {
      await dispatch(deleteComment({ postId, commentId }));
      await dispatch(getPostComments(postId));
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const isCommentOwner = (comment: Comment) => {
    const commentUserId =
      typeof comment.user === "object" ? comment.user._id : comment.user;
    const currentUserId = currentUser?._id;
    console.log("Current User ID:", currentUserId);
    console.log("Comment User ID:", commentUserId);
    return currentUserId === commentUserId;
  };

  return (
    <Paper elevation={0} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Comments ({comments.length})
      </Typography>
      <Box
        component="form"
        onSubmit={handleCommentSubmit}
        sx={{ mb: 3, display: "flex" }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Add a comment..."
          size="small"
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          error={!!error}
          helperText={error}
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!commentContent.trim() || isSubmitting}
          endIcon={isSubmitting ? <CircularProgress size={16} /> : <SendIcon />}
          sx={{ ml: 1 }}
        >
          Post
        </Button>
      </Box>

      {loading && comments.length === 0 ? (
        <CircularProgress size={24} />
      ) : comments.length > 0 ? (
        <List>
          {comments.map((comment) => (
            <React.Fragment key={comment._id}>
              <ListItem
                secondaryAction={
                  isCommentOwner(comment) && (
                    <Tooltip title="Delete Comment">
                      <span>
                        <IconButton
                          edge="end"
                          onClick={() => handleDeleteComment(comment._id)}
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  )
                }
              >
                <ListItemText
                  primary={
                    typeof comment.user === "object"
                      ? comment.user.username
                      : comment.user || "Anonymous"
                  }
                  secondary={comment.content}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography color="text.secondary" align="center">
          No comments yet. Be the first to comment!
        </Typography>
      )}
    </Paper>
  );
};

export default CommentsSection;
