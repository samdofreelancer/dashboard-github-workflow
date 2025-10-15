# GitHub Actions Dashboard — Mini Project

## Chạy nhanh
1) Tạo `server/.env` từ `.env.example` và điền:
```
GH_TOKEN=ghp_xxx
REPOS=samdofreelancer/money-keeper
POLL_INTERVAL_MS=120000
PORT=4000
```
2) Chạy server:
```
cd server
npm i
npm run dev
```
3) Chạy web (tab khác):
```
cd web
npm i
# set VITE_API_BASE nếu server không phải localhost:4000
npm run dev
```
Mở http://localhost:5173.

Nếu bảng trống: chờ ~2 phút hoặc chạy `npm run collect-once` trong thư mục `server` để kéo dữ liệu ngay.
