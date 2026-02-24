const express = require('express');
const router = express.Router();
const db = require('../database');

// 获取所有学生
router.get('/', (req, res) => {
  db.all(`SELECT * FROM students`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 添加学生
router.post('/', (req, res) => {
  const { name, class: className, student_id } = req.body;
  db.run(
    `INSERT INTO students (name, class, student_id) VALUES (?, ?, ?)`,
    [name, className, student_id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, name, class: className, student_id });
    }
  );
});

// 删除学生
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM students WHERE id = ?`, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '学生删除成功' });
  });
});

// 修改学生信息
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { name, class: className, student_id } = req.body;
  db.run(
    `UPDATE students SET name = ?, class = ?, student_id = ? WHERE id = ?`,
    [name, className, student_id, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: '学生信息更新成功' });
    }
  );
});

module.exports = router;