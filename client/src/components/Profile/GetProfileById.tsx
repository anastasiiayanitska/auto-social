import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { fetchUserProfileById } from "../../store/auth/profileThunks";
import { User } from "../../types/auth";
import ProfileInfo from "./ProfileInfo";

const GetProfileById: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      dispatch(fetchUserProfileById(id))
        .unwrap()
        .then((profile) => {
          setUserProfile(profile);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err);
          setIsLoading(false);
        });
    }
  }, [dispatch, id]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Eroor: {error}</p>;
  if (!userProfile) return <p>User not found</p>;

  return <ProfileInfo userId={userProfile._id} />;
};

export default GetProfileById;
