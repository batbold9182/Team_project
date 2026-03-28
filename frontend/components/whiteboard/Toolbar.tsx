import { Pressable, StyleSheet, Text, View } from "react-native";

const COLORS = ["#111827", "#2563eb", "#dc2626", "#16a34a", "#d97706"];
const SIZES = [2, 4, 8, 12];

type ToolbarProps = {
  isConnected: boolean;
  selectedColor: string;
  selectedSize: number;
  onSelectColor: (color: string) => void;
  onSelectSize: (size: number) => void;
  onInvite: () => void;
  onClear: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
};

export function Toolbar({
  isConnected,
  selectedColor,
  selectedSize,
  onSelectColor,
  onSelectSize,
  onInvite,
  onClear,
  onUndo,
  onRedo,
}: ToolbarProps) {
  return (
    <View style={styles.toolbar}>
      <View style={styles.group}>
        <Text style={styles.label}>Color</Text>
        <View style={styles.row}>
          {COLORS.map((color) => (
            <Pressable
              key={color}
              style={[
                styles.colorChip,
                { backgroundColor: color },
                selectedColor === color ? styles.colorChipSelected : null,
              ]}
              onPress={() => onSelectColor(color)}
            />
          ))}
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>

</View>
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Stroke</Text>
        <View style={styles.row}>
          {SIZES.map((size) => (
            <Pressable
              key={size}
              style={[styles.sizeChip, selectedSize === size ? styles.sizeChipSelected : null]}
              onPress={() => onSelectSize(size)}
            >
              <Text style={[styles.sizeText, selectedSize === size ? styles.sizeTextSelected : null]}>
                {size}px
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.actionsRow}>
        <Pressable style={styles.inviteButton} onPress={onInvite}>
          <Text style={styles.inviteButtonText}>Invite</Text>
        </Pressable>
        <Pressable style={[styles.clearButton, !isConnected ? styles.clearButtonMuted : null]} onPress={onClear}>
          <Text style={styles.clearButtonText}>Clear board</Text>
        </Pressable>
          <Pressable style={styles.undoButton} onPress={onUndo}>
    <Text style={styles.undoText}>↩</Text>
  </Pressable>

  <Pressable style={styles.redoButton} onPress={onRedo}>
    <Text style={styles.redoText}>↪</Text>
  </Pressable>
      </View>
      <View style={styles.undoRedoRow}>

  
</View>
    </View>
    
    
  );
}

const styles = StyleSheet.create({
  toolbar: {
    borderRadius: 24,
    backgroundColor: "#fffaf1",
    padding: 16,
    gap: 14,
  },
  group: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  colorChip: {
    width: 30,
    height: 30,
    borderRadius: 999,
  },
  colorChipSelected: {
    borderWidth: 3,
    borderColor: "#fbbf24",
  },
  sizeChip: {
    borderRadius: 999,
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sizeChipSelected: {
    backgroundColor: "#111827",
  },
  sizeText: {
    color: "#111827",
    fontWeight: "700",
  },
  sizeTextSelected: {
    color: "#ffffff",
  },
  inviteButton: {
    alignSelf: "flex-start",
    borderRadius: 999,
    backgroundColor: "#2563eb",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inviteButtonText: {
    color: "#ffffff",
    fontWeight: "800",
  },
  clearButton: {
    alignSelf: "flex-start",
    borderRadius: 999,
    backgroundColor: "#dc2626",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  clearButtonMuted: {
    opacity: 0.7,
  },
  clearButtonText: {
    color: "#ffffff",
    fontWeight: "800",
  },
  undoRedoRow: {
  flexDirection: "row",
  gap: 10,
  marginTop: 10,
},

undoButton: {
  backgroundColor: "#e0e7ff", // soft blue
  paddingHorizontal: 14,
  paddingVertical: 10,
  borderRadius: 999,
},

redoButton: {
  backgroundColor: "#fef3c7", // soft yellow
  paddingHorizontal: 14,
  paddingVertical: 10,
  borderRadius: 999,
},

undoText: {
  color: "#1e3a8a",
  fontWeight: "700",
},

redoText: {
  color: "#92400e",
  fontWeight: "700",
},
});