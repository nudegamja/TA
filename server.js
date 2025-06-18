// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cors = require('cors');

const app = express();
const PORT = 3000;

// 정적 파일 제공
app.use(express.static(__dirname));
app.use(cors());

// 업로드 폴더 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, 'results');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const decodedName = decodeURIComponent(file.originalname);
    cb(null, decodedName);
  }
});
const upload = multer({ storage: storage });

// 업로드 라우트
app.post('/upload', upload.any(), (req, res) => {
  const filenames = req.files.map(file => Buffer.from(file.originalname, 'utf-8').toString());
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.send({ status: 'ok', filenames });
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`✅ 서버 실행됨: http://localhost:${PORT}`);
});