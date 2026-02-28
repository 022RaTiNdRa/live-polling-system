import { io } from 'socket.io-client';

const URL = process.env.BACKEND_URL || 'http://localhost:5000';

console.log('Attempting socket connection to', URL, '(allowing polling)');

const socket = io(URL, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
  timeout: 60000,
});

socket.on('connect', () => {
  console.log('SMOKE-FB: connected, id=', socket.id, 'transport=', socket.io.engine.transport.name);
  socket.disconnect();
  process.exit(0);
});

socket.on('connect_error', (err) => {
  console.error('SMOKE-FB: connect_error', err.message || err);
});

socket.on('reconnect_attempt', (n) => {
  console.log('SMOKE-FB: reconnect attempt', n);
});

socket.on('disconnect', (reason) => {
  console.log('SMOKE-FB: disconnected, reason=', reason);
});

setTimeout(() => {
  console.error('SMOKE-FB: timed out waiting for connection');
  process.exit(2);
}, 70000);
