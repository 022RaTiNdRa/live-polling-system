import { io } from 'socket.io-client';

const URL = process.env.BACKEND_URL || 'http://localhost:5001';

console.log('Attempting socket connection to', URL);

const socket = io(URL, {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
  timeout: 60000,
});

socket.on('connect', () => {
  console.log('SMOKE: connected, id=', socket.id);
  socket.disconnect();
  process.exit(0);
});

socket.on('connect_error', (err) => {
  console.error('SMOKE: connect_error', err.message || err);
});

socket.on('reconnect_attempt', (n) => {
  console.log('SMOKE: reconnect attempt', n);
});

socket.on('disconnect', (reason) => {
  console.log('SMOKE: disconnected, reason=', reason);
});

// Timeout to fail the script if no connect after 70s
setTimeout(() => {
  console.error('SMOKE: timed out waiting for connection');
  process.exit(2);
}, 70000);
