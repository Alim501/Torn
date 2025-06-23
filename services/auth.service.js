const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require("../db");
const { defaultTronWeb, getUserTronWeb } = require('../utils/tron');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET

async function register(email, password) {
    const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    throw new Error('Email уже зарегистрирован');
  }
  
 const account = await defaultTronWeb.createAccount();
  const adress= account.address.base58;
  const privateKey= account.privateKey;
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      email,
    passwordHash,
      adress,
      privateKey,
    },
  });
   const token = jwt.sign({ email }, JWT_SECRET);
  return token;
}

async function login(email, password) {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) throw new Error('Неверный email или пароль');

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error('Неверный email или пароль');

  const token = jwt.sign({ email }, JWT_SECRET);
  return token;
}

async function getMe(id) {
    console.log(id);
    const user = await prisma.user.findUnique({
        where: { id },
    });
    if (!user) throw new Error('Пользователь не найден');
    return {
        id: user.id,
        email: user.email,
        adress: user.adress,
        privateKey: user.privateKey,
    };
    
}

async function getUserInfo(email) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Пользователь не найден');

  return {
    adress: user.adress,
    privateKey: user.privateKey,
  };
}

async function getBalance(adress, privateKey) {
  const tronWeb = getUserTronWeb(privateKey);
  const balanceInSun = await tronWeb.trx.getBalance(adress);
  const balance = tronWeb.fromSun(balanceInSun);
  return {
    adress: adress,
    balance: parseFloat(balance),
  };
}

module.exports = {
  register,
  login,
  getMe,
  getUserInfo,
  getBalance,
};
