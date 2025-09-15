const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB 연결
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB 연결 성공");
  })
  .catch((error) => {
    console.error("MongoDB 연결 실패:", error);
  });

// 라우터 설정
app.use("/products", require("./routes/products"));

// 기본 라우트
app.get("/", (req, res) => {
  res.json({
    message: "판다마켓 API 서버가 실행 중입니다!",
    version: "1.0.0",
  });
});

// 404 에러 처리
app.use((req, res) => {
  res.status(404).json({ error: "요청한 리소스를 찾을 수 없습니다." });
});

// 에러 처리 미들웨어
app.use((error, req, res, next) => {
  console.error("서버 오류:", error);
  res.status(500).json({ error: "서버 내부 오류가 발생했습니다." });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
