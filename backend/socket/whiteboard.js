const {
  addMessage,
  addStroke,
  clearRoom,
  getRoom,
  joinRoom,
  leaveRoom,
  serializeRoom,
} = require("../store/roomStore");

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function sanitizePoints(points) {
  if (!Array.isArray(points)) {
    return [];
  }

  return points
    .filter((point) => Number.isFinite(point?.x) && Number.isFinite(point?.y))
    .map((point) => ({ x: point.x, y: point.y }));
}

function registerWhiteboardHandlers(io) {
  io.on("connection", (socket) => {
    socket.on("cursor:move", (payload = {}) => {
  const roomId = socket.data.roomId;

  if (!roomId) return;

  const x = Number(payload.x);
  const y = Number(payload.y);

  if (!Number.isFinite(x) || !Number.isFinite(y)) return;

  socket.to(roomId).emit("cursor:move", {
    socketId: socket.id,
    userName: socket.data.userName || "Guest",
    x,
    y,
  });
});
    console.log(`socket connected ${socket.id}`);

    socket.on("room:join", (payload = {}, callback) => {
      const roomId = payload.roomId?.trim();
      const userName = payload.userName?.trim() || "Guest";

      if (!roomId) {
        callback?.({ ok: false, error: "roomId is required" });
        return;
      }

      if (socket.data.roomId) {
        socket.leave(socket.data.roomId);
        leaveRoom(socket.data.roomId, socket.id);
      }

      socket.data.roomId = roomId;
      socket.data.userName = userName;

      socket.join(roomId);
      const roomState = joinRoom(roomId, {
        socketId: socket.id,
        userName,
      });

      io.to(roomId).emit("presence:update", roomState.participants);
      callback?.({ ok: true, room: roomState });
    });

    socket.on("draw:stroke", (payload = {}, callback) => {
      const roomId = socket.data.roomId;
      const points = sanitizePoints(payload.points);

      if (!roomId) {
        callback?.({ ok: false, error: "Join a room before drawing" });
        return;
      }

      if (points.length < 2) {
        callback?.({ ok: false, error: "A stroke needs at least two points" });
        return;
      }

      const stroke = {
        id: payload.id || createId("stroke"),
        points,
        color: payload.color || "#111827",
        size: Number.isFinite(payload.size) ? payload.size : 4,
        userName: socket.data.userName || "Guest",
        createdAt: new Date().toISOString(),
      };

      addStroke(roomId, stroke);
      socket.to(roomId).emit("draw:stroke", stroke);
      callback?.({ ok: true, stroke });
    });

    socket.on("chat:message", (payload = {}, callback) => {
      const roomId = socket.data.roomId;
      const text = payload.text?.trim();

      if (!roomId || !text) {
        callback?.({ ok: false, error: "A room and message text are required" });
        return;
      }

      const message = {
        id: createId("message"),
        text,
        userName: socket.data.userName || "Guest",
        createdAt: new Date().toISOString(),
      };

      addMessage(roomId, message);
      io.to(roomId).emit("chat:message", message);
      callback?.({ ok: true, message });
    });

    socket.on("board:clear", (_, callback) => {
      const roomId = socket.data.roomId;

      if (!roomId) {
        callback?.({ ok: false, error: "Join a room before clearing the board" });
        return;
      }

      clearRoom(roomId);
      io.to(roomId).emit("board:cleared");
      callback?.({ ok: true });
    });

    socket.on("room:state", (_, callback) => {
      const roomId = socket.data.roomId;

      if (!roomId) {
        callback?.({ ok: false, error: "Join a room first" });
        return;
      }

      callback?.({ ok: true, room: serializeRoom(getRoom(roomId)) });
    });

    socket.on("disconnect", () => {
      const roomId = socket.data.roomId;

      if (!roomId) {
        return;
      }

      const roomState = leaveRoom(roomId, socket.id);

      if (roomState) {
        io.to(roomId).emit("presence:update", roomState.participants);
      }
    });
  });
}

module.exports = registerWhiteboardHandlers;