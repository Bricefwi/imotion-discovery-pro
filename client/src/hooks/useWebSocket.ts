import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { trpc } from '@/lib/trpc';

interface WebSocketHook {
  isConnected: boolean;
  socket: Socket | null;
}

export function useWebSocket(): WebSocketHook {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const { data: user } = trpc.auth.me.useQuery();

  useEffect(() => {
    if (!user) return;

    // Create WebSocket connection
    const socket = io(window.location.origin, {
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[WebSocket] Connected');
      setIsConnected(true);

      // Join user-specific room
      socket.emit('join', {
        userId: user.id,
        role: user.role,
      });
    });

    socket.on('disconnect', () => {
      console.log('[WebSocket] Disconnected');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('[WebSocket] Connection error:', error);
      setIsConnected(false);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [user]);

  return {
    isConnected,
    socket: socketRef.current,
  };
}

/**
 * Hook to listen to specific WebSocket events
 */
export function useWebSocketEvent<T = any>(
  eventName: string,
  callback: (data: T) => void
) {
  const { socket } = useWebSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on(eventName, callback);

    return () => {
      socket.off(eventName, callback);
    };
  }, [socket, eventName, callback]);
}
