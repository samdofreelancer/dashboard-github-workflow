import express from 'express';
import cors from 'cors';
import { PORT, POLL_INTERVAL_MS } from './env.js';
import { api } from './routes.js';
import { collectOnce } from './collector.js';

const app = express();
app.use(cors());
app.use('/api', api);

app.get('/health', (_, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`[server] http://localhost:${PORT}`);
  const tick = async () => {
    try { await collectOnce(); }
    catch (e) { console.error('[collector] error', e); }
    finally { setTimeout(tick, POLL_INTERVAL_MS); }
  };
  tick();
});
