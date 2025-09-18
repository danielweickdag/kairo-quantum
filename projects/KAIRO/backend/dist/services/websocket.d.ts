import { Server as SocketIOServer } from 'socket.io';
export declare const initializeWebSocket: (io: SocketIOServer) => SocketIOServer<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
export declare const emitToUser: (io: SocketIOServer, userId: string, event: string, data: any) => void;
export declare const emitToPortfolio: (io: SocketIOServer, portfolioId: string, event: string, data: any) => void;
export declare const emitToPost: (io: SocketIOServer, postId: string, event: string, data: any) => void;
export declare const emitMarketUpdate: (io: SocketIOServer, symbol: string, data: any) => void;
//# sourceMappingURL=websocket.d.ts.map