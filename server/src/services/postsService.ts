import Post, { ProductPost, ServicePost } from '../models/Post';
import { PostType, IServicePost, IProductPost } from '../types/post.types';
import Like from '../models/Like';
import Comment from '../models/Comments';
import { imageHandler } from '../utils/imageHandler';

export const postService = {
  async createPost(
    userId: string,
    postData: any,
    files: Express.Multer.File[],
  ) {
    let imagesUrl: string[] = [];

    if (files && Array.isArray(files)) {
      const filePaths = files.map((file) => file.path);
      imagesUrl = await imageHandler.uploadImages(filePaths);
    }

    let newPost;
    switch (postData.postType) {
      case PostType.PRODUCT:
        newPost = await ProductPost.create({
          user: userId,
          content: postData.content,
          postType: postData.postType,
          images: imagesUrl,
          product: postData.productDetails,
        });
        break;
      case PostType.SERVICE:
        newPost = await ServicePost.create({
          user: userId,
          content: postData.content,
          postType: postData.postType,
          images: imagesUrl,
          service: postData.serviceDetails,
        });
        break;
      default:
        newPost = await Post.create({
          user: userId,
          content: postData.content,
          postType: postData.postType || PostType.REGULAR,
          images: imagesUrl,
        });
    }

    return newPost;
  },

  async getUserPosts(userId: string) {
    return await Post.find({ user: userId })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 });
  },

  async getPostById(postId: string) {
    return await Post.findById(postId)
      .populate('user', 'username avatar firstName lastName')
      .exec();
  },

  async getAllPosts() {
    return await Post.find()
      .populate('user', 'username avatar firstName lastName')
      .sort({ createdAt: -1 });
  },

  async getMyPosts(userId: string) {
    return await Post.find({ user: userId })
      .populate('user', 'username avatar firstName lastName')
      .sort({ createdAt: -1 });
  },

  async deletePost(postId: string, userId: string) {
    const post = await Post.findById(postId);

    if (!post) {
      return { success: false, status: 404, message: 'Post not found' };
    }

    if (post.user.toString() !== userId.toString()) {
      return {
        success: false,
        status: 403,
        message: 'You do not have permission to delete this post',
      };
    }

    if (post.images && post.images.length > 0) {
      await imageHandler.deleteImages(post.images);
    }

    await Promise.all([
      Like.deleteMany({ post: postId }),
      Comment.deleteMany({ post: postId }),
      Post.findByIdAndDelete(postId),
    ]);

    return { success: true, message: 'Post successfully deleted' };
  },

  async updatePost(
    postId: string,
    userId: string,
    postData: any,
    files: Express.Multer.File[],
  ) {
    const post = await Post.findById(postId);
    console.log(post);
    if (!post) {
      return { success: false, status: 404, message: 'Post not found' };
    }

    if (post.user.toString() !== userId.toString()) {
      return {
        success: false,
        status: 403,
        message: 'You do not have permission to edit this post',
      };
    }

    let imagesUrl: string[] = [];
    if (files && Array.isArray(files) && files.length > 0) {
      const filePaths = files.map((file) => file.path);
      imagesUrl = await imageHandler.uploadImages(filePaths);

      if (post.images && post.images.length > 0) {
        await imageHandler.deleteImages(post.images);
      }
    }

    post.content = postData.content || post.content;
    post.postType = postData.postType || post.postType;
    post.images = imagesUrl.length > 0 ? imagesUrl : post.images;

    if (post.postType === PostType.PRODUCT && 'product' in post) {
      (post as IProductPost).product =
        postData.productDetails || (post as IProductPost).product;
    } else if (post.postType === PostType.SERVICE && 'service' in post) {
      (post as IServicePost).service =
        postData.serviceDetails || (post as IServicePost).service;
    }

    await post.save();

    return { success: true, data: post };
  },
};
