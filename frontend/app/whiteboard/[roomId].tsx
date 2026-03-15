import { useEffect, useRef, useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

import { CanvasView } from "@/components/whiteboard/CanvasView";
import { ChatSidebar } from "@/components/whiteboard/ChatSidebar";
import { Toolbar } from "@/components/whiteboard/Toolbar";
import { API_URL } from "@/lib/config";
import { createWhiteboardSocket } from "@/lib/socket";
import type { ChatMessage, Participant, Point, Stroke } from "@/types/whiteboard";

export default function WhiteboardRoomScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const safeRoomId = roomId || "demo-room";
  const { width } = useWindowDimensions();
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [draftPoints, setDraftPoints] = useState<Point[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messageText, setMessageText] = useState("");
  const [selectedColor, setSelectedColor] = useState("#111827");
  const [selectedSize, setSelectedSize] = useState(4);
  const [isConnected, setIsConnected] = useState(false);
  const [userName] = useState(() => `Guest-${Math.floor(Math.random() * 900 + 100)}`);
  const socketRef = useRef<ReturnType<typeof createWhiteboardSocket> | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadRoomState() {
      try {
        const response = await fetch(`${API_URL}/api/rooms/${safeRoomId}/state`);
        const room = await response.json();

        if (!isMounted) {
          return;
        }

        setStrokes(room.strokes || []);
        setMessages(room.messages || []);
        setParticipants(room.participants || []);
      } catch {
        if (isMounted) {
          Alert.alert("Unable to load room state", `Check that the backend is running at ${API_URL}.`);
        }
      }
    }

    loadRoomState();

    return () => {
      isMounted = false;
    };
  }, [safeRoomId]);

  useEffect(() => {
    const socket = createWhiteboardSocket();
    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("room:join", { roomId: safeRoomId, userName }, (response: { ok: boolean; room?: { strokes?: Stroke[]; messages?: ChatMessage[]; participants?: Participant[] } }) => {
        if (!response?.ok || !response.room) {
          return;
        }

        setStrokes(response.room.strokes || []);
        setMessages(response.room.messages || []);
        setParticipants(response.room.participants || []);
      });
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("draw:stroke", (stroke: Stroke) => {
      setStrokes((current) => {
        if (current.some((item) => item.id === stroke.id)) {
          return current;
        }

        return [...current, stroke];
      });
    });

    socket.on("chat:message", (message: ChatMessage) => {
      setMessages((current) => [...current, message]);
    });

    socket.on("presence:update", (nextParticipants: Participant[]) => {
      setParticipants(nextParticipants || []);
    });

    socket.on("board:cleared", () => {
      setDraftPoints([]);
      setStrokes([]);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [safeRoomId, userName]);

  function handleStrokeStart(point: Point) {
    setDraftPoints([point]);
  }

  function handleStrokeMove(point: Point) {
    setDraftPoints((current) => [...current, point]);
  }

  function handleStrokeEnd() {
    if (draftPoints.length < 2) {
      setDraftPoints([]);
      return;
    }

    const stroke: Stroke = {
      id: `local-${Date.now()}`,
      points: draftPoints,
      color: selectedColor,
      size: selectedSize,
      userName,
      createdAt: new Date().toISOString(),
    };

    setStrokes((current) => [...current, stroke]);
    socketRef.current?.emit("draw:stroke", stroke);
    setDraftPoints([]);
  }

  function handleSendMessage() {
    const text = messageText.trim();

    if (!text) {
      return;
    }

    socketRef.current?.emit("chat:message", { text });
    setMessageText("");
  }

  function handleClearBoard() {
    setDraftPoints([]);
    setStrokes([]);
    socketRef.current?.emit("board:clear");
  }

  const isWide = width >= 980;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Room {safeRoomId}</Text>
          <Text style={styles.title}>Live whiteboard</Text>
        </View>
        <View style={styles.statusPill}>
          <View style={[styles.statusDot, isConnected ? styles.statusLive : styles.statusOffline]} />
          <Text style={styles.statusText}>{isConnected ? "Connected" : "Offline"}</Text>
        </View>
      </View>

      <Toolbar
        isConnected={isConnected}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        onSelectColor={setSelectedColor}
        onSelectSize={setSelectedSize}
        onClear={handleClearBoard}
      />

      <View style={[styles.content, isWide ? styles.contentWide : styles.contentStacked]}>
        <CanvasView
          strokes={strokes}
          draftPoints={draftPoints}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
          onStrokeStart={handleStrokeStart}
          onStrokeMove={handleStrokeMove}
          onStrokeEnd={handleStrokeEnd}
        />
        <ChatSidebar
          participants={participants}
          messages={messages}
          messageText={messageText}
          onChangeMessage={setMessageText}
          onSendMessage={handleSendMessage}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f4efe6",
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  eyebrow: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: "#9a3412",
    fontWeight: "700",
  },
  title: {
    marginTop: 4,
    fontSize: 30,
    color: "#111827",
    fontWeight: "800",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    backgroundColor: "#fffaf1",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  statusLive: {
    backgroundColor: "#16a34a",
  },
  statusOffline: {
    backgroundColor: "#dc2626",
  },
  statusText: {
    color: "#374151",
    fontWeight: "700",
  },
  content: {
    flex: 1,
    gap: 12,
  },
  contentWide: {
    flexDirection: "row",
  },
  contentStacked: {
    flexDirection: "column",
  },
});