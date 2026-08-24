import type { SkFont } from "@shopify/react-native-skia";
import type { AxisLabelDimensions, AxisLabelRenderer } from "../types";
export declare const getLabelDimensions: ({ text, font, labelRenderer, }: {
    text: string;
    font?: SkFont | null;
    labelRenderer?: AxisLabelRenderer;
}) => AxisLabelDimensions;
