import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteProfileThunk } from "../../store/auth/profileThunks";
import { RootState } from "../../store/store";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
} from "@mui/material";
import { AppDispatch } from "../../store/store";

const DeleteProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();

  const userId = useSelector((state: RootState) => state.auth.user?._id);

  const handleDelete = async () => {
    if (userId) {
      await dispatch(deleteProfileThunk(userId));
      console.log(userId);
      navigate("/");
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    navigate("/me");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Button
        variant="contained"
        color="error"
        onClick={() => setIsModalOpen(true)}
      >
        Delete profile
      </Button>

      <Dialog
        open={isModalOpen}
        onClose={handleClose}
        aria-labelledby="delete-profile-dialog"
      >
        <DialogTitle id="delete-profile-dialog">Deleting a profile</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your profile?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete} color="error" variant="contained">
            Yes, delete
          </Button>
          <Button onClick={handleClose} color="inherit" variant="outlined">
            No, go back
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeleteProfile;
