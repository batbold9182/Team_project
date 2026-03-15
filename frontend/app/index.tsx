import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { API_URL } from "@/lib/config";

export default function Index() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("demo-room");

  function normalizeRoomId(value: string) {
    return value.trim().replace(/\s+/g, "-");
  }

  function handleOpenRoom() {
    const nextRoomId = normalizeRoomId(roomId);

    if (!nextRoomId) {
      Alert.alert("Room ID required", "Enter a room ID before opening a room.");
      return;
    }

    setRoomId(nextRoomId);
    router.push({
      pathname: "/whiteboard/[roomId]",
      params: { roomId: nextRoomId },
    });
  }

  async function handleShareRoom() {
    const nextRoomId = normalizeRoomId(roomId);

    if (!nextRoomId) {
      Alert.alert("Room ID required", "Enter a room ID before sharing a room.");
      return;
    }

    setRoomId(nextRoomId);

    const roomPath = `/whiteboard/${encodeURIComponent(nextRoomId)}`;
    const inviteLink =
      Platform.OS === "web" && typeof window !== "undefined"
        ? `${window.location.origin}${roomPath}`
        : Linking.createURL(roomPath);

    try {
      if (Platform.OS === "web") {
        if (typeof navigator !== "undefined" && navigator.share) {
          await navigator.share({
            title: `Whiteboard room ${nextRoomId}`,
            text: `Join my whiteboard room: ${nextRoomId}`,
            url: inviteLink,
          });
          return;
        }

        if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(inviteLink);
          Alert.alert("Invite link copied", inviteLink);
          return;
        }
      }

      await Share.share({
        title: `Whiteboard room ${nextRoomId}`,
        message: `Join my whiteboard room: ${inviteLink}`,
        url: inviteLink,
      });
    } catch {
      Alert.alert("Invite link", inviteLink);
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Realtime whiteboard MVP</Text>
        <Text style={styles.title}>Skia + Socket.IO collaboration starter</Text>
        <Text style={styles.copy}>
          Enter a room ID to open a shared whiteboard and send the same room link to other people.
        </Text>
        <Text style={styles.meta}>API: {API_URL}</Text>
        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>Room ID</Text>
          <TextInput
            value={roomId}
            onChangeText={setRoomId}
            placeholder="e.g. team-meeting-1"
            placeholderTextColor="#9ca3af"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
          />
        </View>
        <View style={styles.actionsRow}>
          <Pressable style={styles.button} onPress={handleOpenRoom}>
            <Text style={styles.buttonText}>Open room</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={handleShareRoom}>
            <Text style={styles.secondaryButtonText}>Share room link</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f4efe6",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 520,
    borderRadius: 28,
    backgroundColor: "#fffdf8",
    padding: 28,
    gap: 14,
    shadowColor: "#1f2937",
    shadowOpacity: 0.1,
    shadowRadius: 24,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    elevation: 6,
  },
  eyebrow: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.4,
    color: "#9a3412",
    fontWeight: "700",
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    color: "#111827",
    fontWeight: "800",
  },
  copy: {
    fontSize: 16,
    lineHeight: 24,
    color: "#4b5563",
  },
  meta: {
    fontSize: 13,
    color: "#6b7280",
  },
  formGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  input: {
    borderRadius: 18,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#111827",
    fontSize: 15,
  },
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  button: {
    marginTop: 8,
    borderRadius: 999,
    backgroundColor: "#111827",
    paddingHorizontal: 18,
    paddingVertical: 14,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryButton: {
    marginTop: 8,
    borderRadius: 999,
    backgroundColor: "#2563eb",
    paddingHorizontal: 18,
    paddingVertical: 14,
    alignSelf: "flex-start",
  },
  secondaryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
