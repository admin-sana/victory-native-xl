import { type SkColor, type SkParagraphStyle, type SkTextStyle, type SkTypefaceFontProvider } from "@shopify/react-native-skia";
import type { AxisLabelRenderer } from "../../types";
export type CreateParagraphLabelRendererOptions = {
    paragraphStyle?: SkParagraphStyle;
    textStyle?: Omit<SkTextStyle, "color"> & {
        color?: SkColor;
    };
    typefaceFontProvider?: SkTypefaceFontProvider;
};
export declare const createParagraphLabelRenderer: ({ paragraphStyle, textStyle, typefaceFontProvider, }?: CreateParagraphLabelRendererOptions) => AxisLabelRenderer;
