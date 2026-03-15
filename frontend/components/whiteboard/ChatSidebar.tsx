import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import type { ChatMessage, Participant } from "@/types/whiteboard";

type ChatSidebarProps = {
  participants: Participant[];
  messages: ChatMessage[];
  messageText: string;
  onChangeMessage: (value: string) => void;
  onSendMessage: () => void;
};

export function ChatSidebar({
  participants,
  messages,
  messageText,
  onChangeMessage,
  onSendMessage,
}: ChatSidebarProps) {
  return (
    <View style={styles.sidebar}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Participants</Text>
        <View style={styles.participantsList}>
          {participants.length === 0 ? (
            <Text style={styles.emptyText}>No one is connected yet.</Text>
          ) : (
            participants.map((participant) => (
              <View key={participant.socketId} style={styles.participantChip}>
                <Text style={styles.participantText}>{participant.userName}</Text>
              </View>
            ))
          )}
        </View>
      </View>

      <View style={[styles.section, styles.messagesSection]}>
        <Text style={styles.sectionTitle}>Room chat</Text>
        <ScrollView style={styles.messagesScroll} contentContainerStyle={styles.messagesContent}>
          {messages.length === 0 ? (
            <Text style={styles.emptyText}>Messages will appear here.</Text>
          ) : (
            messages.map((message) => (
              <View key={message.id} style={styles.messageBubble}>
                <Text style={styles.messageAuthor}>{message.userName}</Text>
                <Text style={styles.messageText}>{message.text}</Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      <View style={styles.composer}>
        <TextInput
          value={messageText}
          onChangeText={onChangeMessage}
          placeholder="Send a room message"
          placeholderTextColor="#9ca3af"
          style={styles.input}
        />
        <Pressable style={styles.sendButton} onPress={onSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: "100%",
    maxWidth: 360,
    minHeight: 280,
    borderRadius: 28,
    backgroundColor: "#fffaf1",
    padding: 18,
    gap: 14,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },
  participantsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  participantChip: {
    borderRadius: 999,
    backgroundColor: "#ede9fe",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  participantText: {
    color: "#4c1d95",
    fontWeight: "700",
  },
  messagesSection: {
    flex: 1,
    minHeight: 180,
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContent: {
    gap: 10,
  },
  messageBubble: {
    borderRadius: 18,
    backgroundColor: "#ffffff",
    padding: 12,
    gap: 4,
  },
  messageAuthor: {
    fontSize: 12,
    color: "#9a3412",
    fontWeight: "800",
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#1f2937",
  },
  emptyText: {
    color: "#6b7280",
    lineHeight: 20,
  },
  composer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#111827",
  },
  sendButton: {
    borderRadius: 18,
    backgroundColor: "#111827",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sendButtonText: {
    color: "#ffffff",
    fontWeight: "800",
  },
});