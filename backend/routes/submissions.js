const express = require('express');
const router = express.Router();
const db = require('../database');

// 提交作业
router.post('/', (req, res) => {
  const { student_id, assignment_id, content } = req.body;
  const submitted_at = new Date().toISOString();
  db.run(
    `INSERT INTO submissions (student_id, assignment_id, content, submitted_at) VALUES (?, ?, ?, ?)`,
    [student_id, assignment_id, content, submitted_at],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, message: '作业提交成功' });
    }
  );
});

// 批改作业（评分+评语）
router.post('/:id/grade', (req, res) => {
  const id = req.params.id;
  const { score, comment } = req.body;
  db.run(
    `UPDATE submissions SET score = ?, comment = ? WHERE id = ?`,
    [score, comment, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: '评分成功' });
    }
  );
});

// 获取某学生的所有提交记录
router.get('/student/:student_id', (req, res) => {
  const student_id = req.params.student_id;
  db.all(`SELECT * FROM submissions WHERE student_id = ?`, [student_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 获取某作业的所有提交
router.get('/assignment/:assignment_id', (req, res) => {
  const assignment_id = req.params.assignment_id;
  db.all(`SELECT s.*, st.name FROM submissions s JOIN students st ON s.student_id = st.id WHERE s.assignment_id = ?`, [assignment_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;