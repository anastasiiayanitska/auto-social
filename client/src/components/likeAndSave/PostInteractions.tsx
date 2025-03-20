import {
  Box,
  Divider,
  Card,
  CardActions,
  Typography,
  Container,
} from "@mui/material";
import LikeButton from "./LikeButton";
import SavePostButton from "./SavePostButton";
import CommentsSection from "../Comments/CommentsSection";

interface LikeProps {
  postId: string;
  likesCount?: number;
}

const PostInteractions = ({ postId, likesCount = 0 }: LikeProps) => {
  return (
    <Container variant="outlined" sx={{ mt: 2 }}>
      <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
        <Box display="flex" alignItems="center">
          <LikeButton postId={postId} likesCount={likesCount} />

          <SavePostButton postId={postId} />
        </Box>
      </CardActions>
      <Divider />
      <CommentsSection postId={postId} />
    </Container>
  );
};

export default PostInteractions;
