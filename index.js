require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());
app.use('/block', require('./routes/block.routes'));
app.use('/auth', require('./routes/auth.routes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
