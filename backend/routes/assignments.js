const express = require('express');
const router = express.Router();
const db = require('../database');

// 获取所有作业
router.get('/', (req, res) => {
  db.all(`SELECT * FROM assignments`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 添加作业
router.post('/', (req, res) => {
  const { course_id, title, description, due_date } = req.body;
  db.run(
    `INSERT INTO assignments (course_id, title, description, due_date) VALUES (?, ?, ?, ?)`,
    [course_id, title, description, due_date],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, course_id, title, description, due_date });
    }
  );
});

// 获取某课程的作业
router.get('/course/:course_id', (req, res) => {
  const course_id = req.params.course_id;
  db.all(`SELECT * FROM assignments WHERE course_id = ?`, [course_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;