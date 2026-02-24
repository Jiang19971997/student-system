const express = require('express');
const router = express.Router();
const db = require('../database');

// 获取所有课程
router.get('/', (req, res) => {
  db.all(`SELECT * FROM courses`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 添加课程
router.post('/', (req, res) => {
  const { name, teacher } = req.body;
  db.run(
    `INSERT INTO courses (name, teacher) VALUES (?, ?)`,
    [name, teacher],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, name, teacher });
    }
  );
});

module.exports = router;