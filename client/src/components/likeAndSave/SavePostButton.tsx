import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  savePost,
  unsavePost,
  checkSaveStatus,
} from "../../store/post/interactionThunks";
import { IconButton, Tooltip } from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

interface SavePostButtonProps {
  postId: string;
}

const SavePostButton: React.FC<SavePostButtonProps> = ({ postId }) => {
  const dispatch = useDispatch();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const saveStatus = useSelector((state: RootState) =>
    state.interactions.saveStatus.find((status) => status.postId === postId)
  );

  useEffect(() => {
    const checkStatus = async () => {
      try {
        await dispatch(checkSaveStatus(postId));
        setLoading(false);
      } catch (error) {
        console.error("Failed to check save status:", error);
        setLoading(false);
      }
    };

    checkStatus();
  }, [dispatch, postId]);

  useEffect(() => {
    if (saveStatus) {
      setSaved(saveStatus.saved);
    }
  }, [saveStatus]);

  const handleSaveToggle = async () => {
    try {
      if (saved) {
        await dispatch(unsavePost(postId));
      } else {
        await dispatch(savePost(postId));
      }
      setSaved(!saved);
    } catch (error) {
      console.error("Failed to toggle save:", error);
    }
  };

  return (
    <Tooltip title={saved ? "Unsave" : "Save"}>
      <IconButton
        onClick={handleSaveToggle}
        disabled={loading}
        color="primary"
        size="small"
      >
        {saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default SavePostButton;
