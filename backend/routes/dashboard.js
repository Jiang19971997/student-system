const express = require('express');
const router = express.Router();
const db = require('../database');

// 获取数据看板统计数据
router.get('/stats', (req, res) => {
  // 1. 班级平均分
  const avgScoreSql = `SELECT AVG(score) as avg_score FROM submissions WHERE score IS NOT NULL`;
  // 2. 最高分/最低分
  const maxMinSql = `SELECT MAX(score) as max_score, MIN(score) as min_score FROM submissions WHERE score IS NOT NULL`;
  // 3. 各分数段人数
  const scoreRangeSql = `
    SELECT 
      CASE 
        WHEN score >= 90 THEN '90-100'
        WHEN score >= 80 THEN '80-89'
        WHEN score >= 70 THEN '70-79'
        WHEN score >= 60 THEN '60-69'
        ELSE '0-59'
      END as range,
      COUNT(*) as count
    FROM submissions WHERE score IS NOT NULL
    GROUP BY range
  `;
  // 4. 作业提交率
  const submitRateSql = `
    SELECT 
      (SELECT COUNT(*) FROM submissions) as submitted,
      (SELECT COUNT(*) FROM students) * (SELECT COUNT(*) FROM assignments) as total
  `;

  // 执行所有查询
  db.get(avgScoreSql, (err, avgData) => {
    if (err) return res.status(500).json({ error: err.message });
    db.get(maxMinSql, (err, maxMinData) => {
      if (err) return res.status(500).json({ error: err.message });
      db.all(scoreRangeSql, (err, rangeData) => {
        if (err) return res.status(500).json({ error: err.message });
        db.get(submitRateSql, (err, rateData) => {
          if (err) return res.status(500).json({ error: err.message });
          
          // 计算提交率
          const submitRate = rateData.total > 0 ? (rateData.submitted / rateData.total * 100).toFixed(2) : 0;
          
          res.json({
            avg_score: avgData.avg_score ? avgData.avg_score.toFixed(2) : 0,
            max_score: maxMinData.max_score || 0,
            min_score: maxMinData.min_score || 0,
            score_ranges: rangeData,
            submit_rate: submitRate,
            submitted: rateData.submitted || 0,
            total: rateData.total || 0
          });
        });
      });
    });
  });
});

module.exports = router;