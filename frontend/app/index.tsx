import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { API_URL } from "@/lib/config";

export default function Index() {
  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Realtime whiteboard MVP</Text>
        <Text style={styles.title}>Skia + Socket.IO collaboration starter</Text>
        <Text style={styles.copy}>
          Launch the demo room to test live pen drawing, presence, and room chat.
        </Text>
        <Text style={styles.meta}>API: {API_URL}</Text>
        <Link
          href={{
            pathname: "/whiteboard/[roomId]",
            params: { roomId: "demo-room" },
          }}
          asChild
        >
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Open demo room</Text>
          </Pressable>
        </Link>
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
});
