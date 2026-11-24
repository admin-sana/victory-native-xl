import { type PanGesture, type PinchGesture } from "react-native-gesture-handler";
import type { PanGestureConfig } from "react-native-gesture-handler/lib/typescript/handlers/PanGestureHandler";
import { type ChartTransformState } from "../hooks/useChartTransformState";
type Dimension = "x" | "y";
export type PinchTransformGestureConfig = {
    enabled?: boolean;
    dimensions?: Dimension | Dimension[];
};
export declare const pinchTransformGesture: (state: ChartTransformState, _config?: PinchTransformGestureConfig) => PinchGesture;
export type PanTransformGestureConfig = {
    enabled?: boolean;
    dimensions?: Dimension | Dimension[];
    /** When set, panning is clamped so the chart cannot translate past these bounds. */
    canvasWidth?: number;
    canvasHeight?: number;
} & Pick<PanGestureConfig, "activateAfterLongPress">;
export declare const panTransformGesture: (state: ChartTransformState, _config?: PanTransformGestureConfig) => PanGesture;
export {};
