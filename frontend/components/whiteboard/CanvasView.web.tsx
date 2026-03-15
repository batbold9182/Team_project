import { createElement, useState } from "react";
import { PanResponder, StyleSheet, Text, View } from "react-native";
import type { TextStyle, ViewStyle } from "react-native";

import type { Point, Stroke } from "@/types/whiteboard";

type CanvasViewProps = {
  strokes: Stroke[];
  draftPoints: Point[];
  selectedColor: string;
  selectedSize: number;
  onStrokeStart: (point: Point) => void;
  onStrokeMove: (point: Point) => void;
  onStrokeEnd: () => void;
};

function buildPath(points: Point[]) {
  if (points.length === 0) {
    return "";
  }

  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
}

function renderStroke(stroke: Stroke) {
  return createElement("path", {
    key: stroke.id,
    d: buildPath(stroke.points),
    fill: "none",
    stroke: stroke.color,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: stroke.size,
  });
}

export function CanvasView({
  strokes,
  draftPoints,
  selectedColor,
  selectedSize,
  onStrokeStart,
  onStrokeMove,
  onStrokeEnd,
}: CanvasViewProps) {
  const [boardSize, setBoardSize] = useState({ width: 1, height: 1 });
  const svgStyle = {
    width: "100%",
    height: "100%",
    display: "block" as const,
  };

  function clampPoint(x: number, y: number) {
    return {
      x: Math.max(0, Math.min(x, boardSize.width)),
      y: Math.max(0, Math.min(y, boardSize.height)),
    };
  }

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (event) => {
      onStrokeStart(clampPoint(event.nativeEvent.locationX, event.nativeEvent.locationY));
    },
    onPanResponderMove: (event) => {
      onStrokeMove(clampPoint(event.nativeEvent.locationX, event.nativeEvent.locationY));
    },
    onPanResponderRelease: onStrokeEnd,
    onPanResponderTerminate: onStrokeEnd,
  });

  const draftStroke: Stroke | null =
    draftPoints.length > 1
      ? {
          id: "draft-stroke",
          points: draftPoints,
          color: selectedColor,
          size: selectedSize,
          userName: "draft",
          createdAt: new Date().toISOString(),
        }
      : null;

  return (
    <View style={styles.wrapper}>
      <View
        style={styles.board}
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          setBoardSize({
            width: Math.max(width, 1),
            height: Math.max(height, 1),
          });
        }}
      >
        {createElement(
          "svg",
          {
            viewBox: `0 0 ${boardSize.width} ${boardSize.height}`,
            preserveAspectRatio: "none",
            style: svgStyle,
          },
          strokes.map(renderStroke),
          draftStroke ? renderStroke(draftStroke) : null
        )}
        <View style={styles.gestureLayer} {...panResponder.panHandlers} />
      </View>
      <Text style={styles.hint}>Web fallback uses SVG rendering. Native keeps Skia.</Text>
    </View>
  );
}

const styles = StyleSheet.create<{
  wrapper: ViewStyle;
  board: ViewStyle;
  gestureLayer: ViewStyle;
  hint: TextStyle;
}>({
  wrapper: {
    flex: 1,
    minHeight: 360,
    gap: 10,
  },
  board: {
    flex: 1,
    minHeight: 360,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "#fffdf8",
    borderWidth: 1,
    borderColor: "#eadfce",
    position: "relative",
  },
  gestureLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  hint: {
    fontSize: 13,
    color: "#6b7280",
  },
});