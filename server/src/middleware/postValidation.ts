import { Request, Response, NextFunction } from 'express';
import { PostType } from '../types/post.types';

export const validateCreatePost = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { content, postType, productDetails, serviceDetails } = req.body;
  console.log(req.body, req.files);
  // Перевірка наявності контенту
  if (!content || content.trim() === '') {
    res.status(400).json({
      success: false,
      message: "Контент поста є обов'язковим",
    });
    return;
  }

  // Валідація типу поста
  if (postType && !Object.values(PostType).includes(postType)) {
    res.status(400).json({
      success: false,
      message: 'Невірний тип поста',
    });
    return;
  }

  // Валідація продуктових деталей
  if (
    postType === PostType.PRODUCT &&
    (!productDetails || !productDetails.title || !productDetails.price)
  ) {
    res.status(400).json({
      success: false,
      message: 'Для продуктового поста необхідно вказати назву та ціну',
    });
    return;
  }

  // Валідація сервісних деталей
  if (
    postType === PostType.SERVICE &&
    (!serviceDetails || !serviceDetails.title || !serviceDetails.description)
  ) {
    res.status(400).json({
      success: false,
      message: 'Для сервісного поста необхідно вказати назву та опис',
    });
    return;
  }

  next();
};

export const validateUpdatePost = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { postType, productDetails, serviceDetails } = req.body;

  // Валідація типу поста
  if (postType && !Object.values(PostType).includes(postType)) {
    res.status(400).json({
      success: false,
      message: 'Невірний тип поста',
    });
    return;
  }

  // Валідація продуктових деталей
  if (postType === PostType.PRODUCT && productDetails) {
    if (!productDetails.title || !productDetails.price) {
      res.status(400).json({
        success: false,
        message: 'Для продуктового поста необхідно вказати назву та ціну',
      });
      return;
    }
  }

  // Валідація сервісних деталей
  if (postType === PostType.SERVICE && serviceDetails) {
    if (!serviceDetails.title || !serviceDetails.description) {
      res.status(400).json({
        success: false,
        message: 'Для сервісного поста необхідно вказати назву та опис',
      });
      return;
    }
  }

  next();
};
