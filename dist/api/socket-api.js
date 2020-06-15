"use strict";
// import { isEmptyOrNull, isAuthorizedJwt, deepClone } from "../util/utils";
// import { SOCKET_SEVER, REDIS_CLIENT } from "../app";
// import { getCacheElement, setCacheElement, getCacheElements } from "./redis-api";
// export const socketResponse = async (socket: any) => {
//     socket.on('jwt', async (data: any) => {
//         if (!isEmptyOrNull(data)) {
//             const decoded: any = await isAuthorizedJwt(data);
//             if (decoded) {
//                 socket.userId = decoded.id;
//                 socket.jwt = data;
//                 socket.sessionId = socket.id;
//                 const userCache: any = await getCacheElement(REDIS_CLIENT, 'users', 'userId', socket.userId);
//                 if (userCache) {
//                     const newCacheSessions = [...userCache.sessions];
//                     if (newCacheSessions.indexOf(socket.sessionId) === -1) {
//                         newCacheSessions.push(socket.sessionId);
//                     }
//                     const newCache = { 
//                     }
//                     await setCacheElement(REDIS_CLIENT, 'users', 'userId', socket.userId, newCache);
//                 }
//             }
//         }
//     });
//     socket.on('disconnect', async () => {
//         if (socket.userId) {
//             const userCache: any = await getCacheElement(REDIS_CLIENT, 'users', 'userId', socket.userId);
//             if (userCache) {
//                 userCache.sessions = userCache.sessions.filter((session: any) => session !== socket.sessionId);
//                 const newCache = { 
//                 }
//                 await setCacheElement(REDIS_CLIENT, 'users', 'userId', socket.userId, newCache);
//             }
//         }
//     });
// }
// export const sendToSocket = (socketId: string, key: string, payload: any) => {
//     SOCKET_SEVER.to(`${socketId}`).emit(key, JSON.stringify(payload));
// }
// export const broadcastToSockets = (key: string, payload: any) => {
//     SOCKET_SEVER.emit(key, JSON.stringify(payload));
// } 
//# sourceMappingURL=socket-api.js.map