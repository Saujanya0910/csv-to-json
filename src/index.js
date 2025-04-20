const express = require('express');
const DatabaseService = require('./services/database');
const { initializeDatabase } = require('./connection/database');
const authMiddleware = require('./middlewares/authMiddleware');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

const db = initializeDatabase(DatabaseService);

app.use(express.json());
app.use(authMiddleware);
app.use('/api', routes());

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

process.on('SIGTERM', async () => {
  await db.close();
  process.exit(0);
});