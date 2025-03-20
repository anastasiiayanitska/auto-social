import Post from '../models/Post';
import SavedPost from '../models/Saved';

export const savedPost = async (userId: string, postId: string) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');

  const savedPost = await SavedPost.findOneAndUpdate(
    { user: userId, savedPost: postId },
    { user: userId, savedPost: postId },
    { upsert: true, new: true },
  );

  return postId;
};

export const unsavedPost = async (userId: string, postId: string) => {
  const saved = await SavedPost.findOneAndDelete({
    user: userId,
    savedPost: postId,
  });
  if (!saved) throw new Error('You did not save this post');
};

export const getSavedPosts = async (userId: string) => {
  return await SavedPost.find({ user: userId })
    .populate({
      path: 'savedPost',
      populate: {
        path: 'user',
        select: 'username email avatar firstName lastName',
      },
    })
    .populate({
      path: 'user',
      select: 'username email avatar firstName lastName',
    });
};
export const getUserSavedPosts = async (postId: string) => {
  return await SavedPost.find({ savedPost: postId });
};

export const checkSavedStatus = async (userId: string, postId: string) => {
  const saved = await SavedPost.findOne({ user: userId, savedPost: postId });
  return !!saved;
};
