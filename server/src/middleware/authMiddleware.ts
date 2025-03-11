// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// import User from '../models/User';

// interface JwtPayload {
//   id: string;
//   username: string;
// }

// export const protect = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ): Promise<void> => {
//   try {
//     let token;

//     // Отримуємо токен з cookie замість заголовка Authorization
//     token = req.cookies.token;

//     if (!token) {
//       res.status(401).json({
//         success: false,
//         message: 'Необхідна авторизація',
//       });
//       return;
//     }

//     try {
//       // Верифікуємо токен
//       const decoded = jwt.verify(
//         token,
//         process.env.JWT_SECRET || 'secret',
//       ) as JwtPayload;

//       // Додаємо користувача до запиту
//       const user = await User.findById(decoded.id).select('-password');

//       if (!user) {
//         res.status(401).json({
//           success: false,
//           message: 'Користувача не знайдено',
//         });
//         return;
//       }

//       req.user = user;
//       next();
//     } catch (error) {
//       res.status(401).json({
//         success: false,
//         message: 'Невірний токен',
//       });
//       return;
//     }
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Помилка авторизації',
//     });
//   }
// };
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface JwtPayload {
  id: string;
  username: string;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let token;

    // Отримуємо токен з cookie замість заголовка Authorization
    token = req.cookies.token;

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Необхідна авторизація',
      });
      return;
    }

    try {
      // Верифікуємо токен
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'secret',
      ) as JwtPayload;

      // Додаємо користувача до запиту
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Користувача не знайдено',
        });
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Невірний токен',
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Помилка авторизації',
    });
  }
};
