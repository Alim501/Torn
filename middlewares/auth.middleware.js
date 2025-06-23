const jwt = require('jsonwebtoken');
const prisma = require("../db");
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET

async function authGuard(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Отсутствует токен' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { email: payload.email },
    });
    console.log("user",user);
      req.user = {
      email: user.email,
      address: user.adress,
      privateKey: user.privateKey, 
    };
    next();
  } catch (err) {
    res.status(401).json({ error: 'Неверный или просроченный токен' });
  }
}

module.exports = authGuard;
