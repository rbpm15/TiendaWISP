import { createApp } from './infrastructure/http/app.js';
import { config } from './infrastructure/config/env.js';

const app = createApp();

app.listen(config.port, () => {
  console.log(`Backend listening on port ${config.port}`);
});
