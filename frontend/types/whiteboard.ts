export type Point = {
  x: number;
  y: number;
};

export type Stroke = {
  id: string;
  points: Point[];
  color: string;
  size: number;
  userName: string;
  createdAt: string;
};

export type ChatMessage = {
  id: string;
  text: string;
  userName: string;
  createdAt: string;
};

export type Participant = {
  socketId: string;
  userName: string;
};