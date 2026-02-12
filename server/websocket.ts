import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer | null = null;

/**
 * Initialize WebSocket server
 */
export function initializeWebSocket(httpServer: HTTPServer) {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*', // In production, specify exact origins
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`[WebSocket] Client connected: ${socket.id}`);

    // Join room based on user role
    socket.on('join', (data: { userId: number; role: string }) => {
      const room = `user:${data.userId}`;
      socket.join(room);
      console.log(`[WebSocket] User ${data.userId} (${data.role}) joined room: ${room}`);

      // Consultants join a special room for all consultant notifications
      if (data.role === 'consultant' || data.role === 'admin') {
        socket.join('consultants');
        console.log(`[WebSocket] User ${data.userId} joined consultants room`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[WebSocket] Client disconnected: ${socket.id}`);
    });
  });

  console.log('[WebSocket] Server initialized');
  return io;
}

/**
 * Get the Socket.IO instance
 */
export function getIO(): SocketIOServer | null {
  return io;
}

/**
 * Emit event to specific user
 */
export function emitToUser(userId: number, event: string, data: any) {
  if (!io) {
    console.warn('[WebSocket] Server not initialized');
    return;
  }
  
  const room = `user:${userId}`;
  io.to(room).emit(event, data);
  console.log(`[WebSocket] Emitted '${event}' to user ${userId}`);
}

/**
 * Emit event to all consultants
 */
export function emitToConsultants(event: string, data: any) {
  if (!io) {
    console.warn('[WebSocket] Server not initialized');
    return;
  }
  
  io.to('consultants').emit(event, data);
  console.log(`[WebSocket] Emitted '${event}' to all consultants`);
}

/**
 * Emit event to all connected clients
 */
export function emitToAll(event: string, data: any) {
  if (!io) {
    console.warn('[WebSocket] Server not initialized');
    return;
  }
  
  io.emit(event, data);
  console.log(`[WebSocket] Emitted '${event}' to all clients`);
}
