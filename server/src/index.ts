// import express, { Application } from 'express';
// import connectDB from './config/database';
// import authRoutes from './routes/authRoutes';
// import userRoutes from './routes/userRoutes';
// import postRoutes from './routes/postRouter';
// import interactionRoutes from './routes/interactionRoutes';
// import subscriptionRoutes from './routes/subscriptionRoutes';
// import cookieParser from 'cookie-parser';
// import cors from 'cors';
// import 'dotenv/config';

// const app: Application = express();
// const PORT = process.env.PORT || 3333;

// app.use(express.json());
// app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));
// app.use(
//   cors({
//     origin: 'http://localhost:5173',
//     credentials: true,
//   }),
// );
// app.use('/api', authRoutes);
// app.use('/api', userRoutes);
// app.use('/api/posts', postRoutes);
// app.use('/api/interactions', interactionRoutes);
// app.use('/api/subscriptions', subscriptionRoutes);

// const startServer = async (): Promise<void> => {
//   try {
//     await connectDB();
//     app.listen(PORT, () => {
//       console.log('Server is listening on port:', PORT);
//     });
//   } catch (error) {
//     console.error('Error listening server:', error);
//   }
// };

// startServer();
import express, { Application } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './config/database';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRouter';
import interactionRoutes from './routes/interactionRoutes';
import subscriptionRoutes from './routes/subscriptionRoutes';
import messageRoutes from './routes/messageRoutes'; // Додано
import notificationRoutes from './routes/notificationRoutes'; // Додано
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import Message from './models/Message'; // Імпортуємо моделі
import Notification from './models/Notification';

const app: Application = express();
const PORT = process.env.PORT || 3333;

// Створюємо HTTP сервер з Express додатком
const server = http.createServer(app);

// Ініціалізуємо socket.io з CORS налаштуваннями
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // URL вашого фронтенд додатку
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/messages', messageRoutes); // Додано
app.use('/api/notifications', notificationRoutes); // Додано

// Структура для зберігання онлайн користувачів
interface OnlineUser {
  userId: string;
  socketId: string;
}

// Активні користувачі
let onlineUsers: OnlineUser[] = [];

// Логіка сокетів
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Користувач онлайн
  socket.on('userConnected', (userId: string) => {
    // Додати користувача до списку онлайн
    if (!onlineUsers.some((user) => user.userId === userId)) {
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
    } else {
      // Оновити socketId для вже доданого користувача
      onlineUsers = onlineUsers.map((user) =>
        user.userId === userId ? { ...user, socketId: socket.id } : user,
      );
    }
    console.log('Online users:', onlineUsers);

    // Сповіщаємо інших користувачів, що цей користувач онлайн
    io.emit(
      'onlineUsers',
      onlineUsers.map((user) => user.userId),
    );
  });

  // Відправка повідомлення
  socket.on(
    'sendMessage',
    async (data: { senderId: string; receiverId: string; text: string }) => {
      try {
        // Зберігаємо повідомлення в базі даних
        const newMessage = new Message({
          senderId: data.senderId,
          receiverId: data.receiverId,
          text: data.text,
          read: false,
        });

        await newMessage.save();

        // Знаходимо отримувача в онлайн користувачах
        const receiver = onlineUsers.find(
          (user) => user.userId === data.receiverId,
        );

        // Відправляємо сповіщення через сокет, якщо отримувач онлайн
        if (receiver) {
          io.to(receiver.socketId).emit('receiveMessage', {
            _id: newMessage._id,
            senderId: data.senderId,
            receiverId: data.receiverId,
            text: data.text,
            read: false,
            createdAt: newMessage.createdAt,
          });
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    },
  );

  // Сповіщення для лайків
  socket.on(
    'sendLike',
    async (data: { senderId: string; receiverId: string; postId: string }) => {
      try {
        // Зберігаємо сповіщення в базі даних
        const newNotification = new Notification({
          type: 'like',
          senderId: data.senderId,
          receiverId: data.receiverId,
          postId: data.postId,
          read: false,
        });

        await newNotification.save();

        // Знаходимо отримувача в онлайн користувачах
        const receiver = onlineUsers.find(
          (user) => user.userId === data.receiverId,
        );

        // Відправляємо сповіщення через сокет, якщо отримувач онлайн
        if (receiver) {
          io.to(receiver.socketId).emit('receiveLike', {
            _id: newNotification._id,
            type: 'like',
            senderId: data.senderId,
            postId: data.postId,
            createdAt: newNotification.createdAt,
          });
        }
      } catch (error) {
        console.error('Error sending like notification:', error);
      }
    },
  );

  // Сповіщення для коментарів
  socket.on(
    'sendComment',
    async (data: {
      senderId: string;
      receiverId: string;
      postId: string;
      commentId: string;
      commentText: string;
    }) => {
      try {
        // Зберігаємо сповіщення в базі даних
        const newNotification = new Notification({
          type: 'comment',
          senderId: data.senderId,
          receiverId: data.receiverId,
          postId: data.postId,
          commentId: data.commentId,
          commentText: data.commentText,
          read: false,
        });

        await newNotification.save();

        // Знаходимо отримувача в онлайн користувачах
        const receiver = onlineUsers.find(
          (user) => user.userId === data.receiverId,
        );

        // Відправляємо сповіщення через сокет, якщо отримувач онлайн
        if (receiver) {
          io.to(receiver.socketId).emit('receiveComment', {
            _id: newNotification._id,
            type: 'comment',
            senderId: data.senderId,
            postId: data.postId,
            commentId: data.commentId,
            commentText: data.commentText,
            createdAt: newNotification.createdAt,
          });
        }
      } catch (error) {
        console.error('Error sending comment notification:', error);
      }
    },
  );

  // Сповіщення для підписок
  socket.on(
    'sendFollow',
    async (data: { senderId: string; receiverId: string }) => {
      try {
        // Зберігаємо сповіщення в базі даних
        const newNotification = new Notification({
          type: 'follow',
          senderId: data.senderId,
          receiverId: data.receiverId,
          read: false,
        });

        await newNotification.save();

        // Знаходимо отримувача в онлайн користувачах
        const receiver = onlineUsers.find(
          (user) => user.userId === data.receiverId,
        );

        // Відправляємо сповіщення через сокет, якщо отримувач онлайн
        if (receiver) {
          io.to(receiver.socketId).emit('receiveFollow', {
            _id: newNotification._id,
            type: 'follow',
            senderId: data.senderId,
            createdAt: newNotification.createdAt,
          });
        }
      } catch (error) {
        console.error('Error sending follow notification:', error);
      }
    },
  );

  // Відключення користувача
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

    // Сповіщаємо інших користувачів про оновлений список онлайн користувачів
    io.emit(
      'onlineUsers',
      onlineUsers.map((user) => user.userId),
    );

    console.log('Remaining users:', onlineUsers);
  });
});

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    // Запуск сервера
    server.listen(PORT, () => {
      console.log('Server is listening on port:', PORT);
    });
  } catch (error) {
    console.error('Error listening server:', error);
  }
};

startServer();
