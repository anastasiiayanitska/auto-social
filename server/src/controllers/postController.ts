import { Request, Response, NextFunction } from 'express';
import { postService } from '../services/postsService';

export const createPost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user._id;

    const newPost = await postService.createPost(
      userId,
      req.body,
      req.files as Express.Multer.File[],
    );

    res.status(201).json({
      success: true,
      data: newPost,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserPosts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.params.id;
    const posts = await postService.getUserPosts(userId);

    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPostById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const postId = req.params.id;
    const post = await postService.getPostById(postId);

    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Post not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving post',
    });
  }
};

export const getAllPosts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = await postService.getAllPosts();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving posts',
    });
  }
};

export const getMyPosts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user._id;

    const posts = await postService.getMyPosts(userId);

    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving posts',
    });
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const result = await postService.deletePost(postId, userId);

    if (!result.success) {
      res.status(500).json({
        success: false,
        message: result.message,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting post',
    });
  }
};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    console.log('REQUEST BODY:', req.body);
    console.log('REQUEST FILES:', req.files);

    const result = await postService.updatePost(
      postId,
      userId,
      req.body,
      req.files as Express.Multer.File[],
    );

    if (!result.success) {
      res.status(500).json({
        success: false,
        message: result.message,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: result.data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error editing post',
    });
  }
};
// export const updatePost = async (
//   req: Request,
//   res: Response,
// ): Promise<void> => {
//   try {
//     const postId = req.params.id;
//     const userId = req.user._id;

//     if (req.body.productDetails) {
//       req.body.productDetails = JSON.parse(req.body.productDetails);
//     }
//     if (req.body.serviceDetails) {
//       req.body.serviceDetails = JSON.parse(req.body.serviceDetails);
//     }

//     const result = await postService.updatePost(
//       postId,
//       userId,
//       req.body,
//       req.files as Express.Multer.File[],
//     );

//     if (!result.success) {
//       res.status(500).json({
//         success: false,
//         message: result.message,
//       });
//       return;
//     }

//     res.status(200).json({
//       success: true,
//       data: result.data,
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: error.message || 'Error editing post',
//     });
//   }
// };
