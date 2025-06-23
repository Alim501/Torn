const authService = require('../services/auth.service');

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const token = await authService.login(email, password);
    res.json({ token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
    
}
async function register(req, res) {
  const { email, password } = req.body;
  try {
    const user = await authService.register(email, password);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getMe(req, res) {
  try {
    const user = await authService.getMe(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
async function getBalance(req, res) {
  const { address,privateKey } = req.user;
  
  try {
    const balance = await authService.getBalance(address,privateKey);
    res.json(balance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


module.exports = {
  login,
  register,
  getMe,
  getBalance
};
