const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

// 路由
app.use('/api/students', require('./routes/students'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/dashboard', require('./routes/dashboard'));

// 登录接口
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database');

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM admins WHERE username = ?`, [username], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(401).json({ message: '用户不存在' });
    if (!bcrypt.compareSync(password, row.password)) {
      return res.status(401).json({ message: '密码错误' });
    }
    const token = jwt.sign({ id: row.id, username: row.username }, 'your-secret-key', { expiresIn: '1d' });
    res.json({ token, username: row.username });
  });
});

// 启动服务
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});