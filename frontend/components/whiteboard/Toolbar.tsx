import { Pressable, StyleSheet, Text, View } from "react-native";

const COLORS = ["#111827", "#2563eb", "#dc2626", "#16a34a", "#d97706"];
const SIZES = [2, 4, 8, 12];

type ToolbarProps = {
  isConnected: boolean;
  selectedColor: string;
  selectedSize: number;
  onSelectColor: (color: string) => void;
  onSelectSize: (size: number) => void;
  onClear: () => void;
};

export function Toolbar({
  isConnected,
  selectedColor,
  selectedSize,
  onSelectColor,
  onSelectSize,
  onClear,
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

      <Pressable style={[styles.clearButton, !isConnected ? styles.clearButtonMuted : null]} onPress={onClear}>
        <Text style={styles.clearButtonText}>Clear board</Text>
      </Pressable>
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
});