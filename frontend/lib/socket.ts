import { io } from "socket.io-client";

import { API_URL } from "@/lib/config";

export function createWhiteboardSocket() {
  return io(API_URL, {
    transports: ["websocket"],
  });
}