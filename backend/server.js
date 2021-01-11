const http = require('http');
const app = require('./app');

const normalizePort = proposedPort => {
  const resPort = parseInt(proposedPort, 10);

  if (isNaN(resPort)) {
    return proposedPort;
  }
  if (resPort >= 0) {
    return resPort;
  }
  return false;
};

const port = normalizePort(process.env.PORT || '3000');

const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
    default:
      throw error;
  }
};

const server = http.createServer(app);

// Listeners declaration
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log(`Example app listening on ${bind}`)
});

// Run the server
server.listen(port);
