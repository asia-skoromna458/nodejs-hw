import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import bcrypt from "bcrypt";
import { Session } from '../models/session.js';
import {createSession, setSessionCookies} from '../services/auth.js';


export const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(400, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashedPassword,
  });
  const newSession = await createSession(user._id);
  setSessionCookies(res, newSession);

  res.status(201).json(user);
};//реєстрація


export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid credentials');
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw createHttpError(401, 'Invalid credentials');
  }
 await Session.deleteOne({ userId: user._id });
  const newSession = await createSession(user._id);
  setSessionCookies(res, newSession);
  res.status(200).json(user);
};//логін користувача



export const refreshUserSession = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;
  if (!sessionId || !refreshToken) {
    throw createHttpError(401, 'Session not found');
  }
  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });//шукааємо сесію
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }//якщо нема помилка
  const isSessionTokenExpired = session.refreshTokenValidUntil < new Date();//перевірка валітності рефрештокена
  if (isSessionTokenExpired) {
    await session.deleteOne();// видаляємо сесію
    res.clearCookie('sessionId');
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    throw createHttpError(401, 'Session token expired');//повертаємо помилку

  };
  await session.deleteOne(); //Якщо всі перевірки пройшли добре, видаляємо поточну сесію
  //нова сесія
  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);
  res.status(200).json({ message: 'Session refreshed' });
};//оновлення сесії


//логаут
export const logoutUser = async (req, res) => {
  const { sessionId } = req.cookies;
  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }
  res.clearCookie('sessionId');
    res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(204).send();
 };
