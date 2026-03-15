const rooms = new Map();

function createRoom(roomId) {
  return {
    roomId,
    strokes: [],
    messages: [],
    participants: new Map(),
    updatedAt: new Date().toISOString(),
  };
}

function getRoom(roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, createRoom(roomId));
  }

  return rooms.get(roomId);
}

function updateTimestamp(room) {
  room.updatedAt = new Date().toISOString();
}

function serializeRoom(room) {
  return {
    roomId: room.roomId,
    strokes: room.strokes,
    messages: room.messages,
    participants: Array.from(room.participants.values()),
    updatedAt: room.updatedAt,
  };
}

function joinRoom(roomId, participant) {
  const room = getRoom(roomId);
  room.participants.set(participant.socketId, participant);
  updateTimestamp(room);
  return serializeRoom(room);
}

function leaveRoom(roomId, socketId) {
  const room = rooms.get(roomId);

  if (!room) {
    return null;
  }

  room.participants.delete(socketId);
  updateTimestamp(room);

  if (room.participants.size === 0 && room.strokes.length === 0 && room.messages.length === 0) {
    rooms.delete(roomId);
    return null;
  }

  return serializeRoom(room);
}

function addStroke(roomId, stroke) {
  const room = getRoom(roomId);
  room.strokes.push(stroke);
  updateTimestamp(room);
  return stroke;
}

function clearRoom(roomId) {
  const room = getRoom(roomId);
  room.strokes = [];
  updateTimestamp(room);
  return serializeRoom(room);
}

function addMessage(roomId, message) {
  const room = getRoom(roomId);
  room.messages.push(message);
  updateTimestamp(room);
  return message;
}

module.exports = {
  addMessage,
  addStroke,
  clearRoom,
  getRoom,
  joinRoom,
  leaveRoom,
  serializeRoom,
};