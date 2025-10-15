import express from 'express';
import cors from 'cors';
const app = express();
app.use(cors());
app.get('/', (_, res) => res.json({ ok: true }));
app.listen(4000, () => console.log('Server running on http://localhost:4000'));