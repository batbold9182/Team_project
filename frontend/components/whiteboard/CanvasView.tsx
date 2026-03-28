import { useState } from "react";

import { PanResponder, StyleSheet, Text, View } from "react-native";
import Svg, { Path as SvgPath } from "react-native-svg";

import type { Point, Stroke } from "@/types/whiteboard";

type CanvasViewProps = {
  strokes: Stroke[];
  draftPoints: Point[];
  selectedColor: string;
  selectedSize: number;
  cursors: Record<string, { x: number; y: number; userName: string }>;
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

export function CanvasView({
  strokes,
  draftPoints,
  selectedColor,
  selectedSize,
  cursors = {},
  onStrokeStart,
  onStrokeMove,
  onStrokeEnd,
}: CanvasViewProps) {
  const [boardSize, setBoardSize] = useState({ width: 1, height: 1 });

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
        <Svg
        
          viewBox={`0 0 ${boardSize.width} ${boardSize.height}`}
          preserveAspectRatio="none"
          style={styles.canvas}
        >
          {strokes.map((stroke) => (
            <SvgPath
              key={stroke.id}
              d={buildPath(stroke.points)}
              fill="none"
              stroke={stroke.color}
              strokeWidth={stroke.size}
              strokeCap="round"
              strokeJoin="round"
            />
          ))}
          {draftPoints.length > 1 ? (
            <SvgPath
              d={buildPath(draftPoints)}
              fill="none"
              stroke={selectedColor}
              strokeWidth={selectedSize}
              strokeCap="round"
              strokeJoin="round"
            />
          ) : null}
        </Svg> 
   
        
        <View style={styles.gestureLayer} {...panResponder.panHandlers} />
        {Object.values(cursors).map((cursor, index) => (
  <View
    key={index}
    style={{
      position: "absolute",
      left: cursor.x - 10,
      top: cursor.y - 10,
      backgroundColor: "red",
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: "black",
      zIndex: 999, // IMPORTANT
    }}
  />
))}
      </View>
      <Text style={styles.hint}>Expo Go-safe renderer active. Replace with Skia later if you move to a custom dev client.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
  canvas: {
    flex: 1,
  },
  gestureLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  hint: {
    fontSize: 13,
    color: "#6b7280",
  },
});