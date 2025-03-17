const jsonServer = require('json-server');
const cors = require('cors');
const server = jsonServer.create();
const path = require('path');
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Konfiguracja CORS - zezwolenie na żądania z różnych źródeł
server.use(cors({
  origin: '*',  // Zezwól wszystkim źródłom (w środowisku produkcyjnym należy to ograniczyć)
  credentials: true
}));

// Add custom routes before JSON Server router
server.get('/health', (req, res) => {
  res.json({ status: 'UP' });
});

// Use default router
server.use('/api', router);

// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
  console.log(`API is available at http://localhost:${PORT}/api`);
});
