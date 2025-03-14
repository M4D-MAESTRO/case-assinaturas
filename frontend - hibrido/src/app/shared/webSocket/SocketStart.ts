import { io as client } from "socket.io-client";
import { API_CONFIG } from "src/config/api.config";

const io = client(API_CONFIG.socketURL, { reconnection: true, });

export { io };