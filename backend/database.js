const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// 初始化表
db.serialize(() => {
  // 学生表
  db.run(`CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    class TEXT NOT NULL,
    student_id TEXT UNIQUE NOT NULL
  )`);

  // 课程表
  db.run(`CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    teacher TEXT NOT NULL
  )`);

  // 作业表
  db.run(`CREATE TABLE IF NOT EXISTS assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    due_date TEXT NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id)
  )`);

  // 提交表
  db.run(`CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    assignment_id INTEGER NOT NULL,
    content TEXT,
    file_path TEXT,
    submitted_at TEXT NOT NULL,
    score INTEGER,
    comment TEXT,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (assignment_id) REFERENCES assignments(id)
  )`);

  // 管理员表
  db.run(`CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`);

  // 插入默认管理员账号: admin / 123456
  const bcrypt = require('bcryptjs');
  const hashedPwd = bcrypt.hashSync('123456', 10);
  db.run(`INSERT OR IGNORE INTO admins (username, password) VALUES (?, ?)`, ['admin', hashedPwd]);
});

module.exports = db;