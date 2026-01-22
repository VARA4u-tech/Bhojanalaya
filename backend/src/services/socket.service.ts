
import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { config } from '../config/env';

let io: Server;

export const initSocket = (httpServer: HttpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: config.frontendUrl,
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on('connection', (socket: Socket) => {
        console.log(`🔌 Client connected: ${socket.id}`);

        // Join order room
        socket.on('join_order', (orderId: string) => {
            console.log(`👤 Socket ${socket.id} joined order room: ${orderId}`);
            socket.join(`order_${orderId}`);
        });

        // Leave order room
        socket.on('leave_order', (orderId: string) => {
            console.log(`👋 Socket ${socket.id} left order room: ${orderId}`);
            socket.leave(`order_${orderId}`);
        });

        socket.on('disconnect', () => {
            console.log(`❌ Client disconnected: ${socket.id}`);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
