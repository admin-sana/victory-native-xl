"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createParagraphLabelRenderer = void 0;
const react_1 = __importDefault(require("react"));
const react_native_skia_1 = require("@shopify/react-native-skia");
const PARAGRAPH_LAYOUT_WIDTH = 10000;
const removeUndefinedValues = (obj) => Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined));
const buildParagraph = ({ text, color, paragraphStyle, textStyle, typefaceFontProvider, }) => {
    const builder = typefaceFontProvider
        ? react_native_skia_1.Skia.ParagraphBuilder.Make(paragraphStyle, typefaceFontProvider)
        : react_native_skia_1.Skia.ParagraphBuilder.Make(paragraphStyle);
    const resolvedColor = color ? react_native_skia_1.Skia.Color(color) : textStyle === null || textStyle === void 0 ? void 0 : textStyle.color;
    const style = removeUndefinedValues(Object.assign(Object.assign({}, (textStyle !== null && textStyle !== void 0 ? textStyle : {})), { color: resolvedColor }));
    builder.pushStyle(style);
    builder.addText(text);
    const paragraph = builder.build();
    paragraph.layout(PARAGRAPH_LAYOUT_WIDTH);
    const width = Math.ceil(Math.max(paragraph.getLongestLine(), paragraph.getMaxIntrinsicWidth(), 0));
    const height = Math.ceil(paragraph.getHeight());
    if (width > 0) {
        paragraph.layout(width);
    }
    return {
        paragraph,
        width,
        height,
    };
};
const createParagraphLabelRenderer = ({ paragraphStyle, textStyle, typefaceFontProvider, } = {}) => ({
    measureText: (text) => {
        const { width, height } = buildParagraph({
            text,
            paragraphStyle,
            textStyle,
            typefaceFontProvider,
        });
        return { width, height };
    },
    render: ({ text, color, x, y, width }) => {
        const { paragraph } = buildParagraph({
            text,
            color,
            paragraphStyle,
            textStyle,
            typefaceFontProvider,
        });
        return <react_native_skia_1.Paragraph paragraph={paragraph} x={x} y={y} width={width}/>;
    },
});
exports.createParagraphLabelRenderer = createParagraphLabelRenderer;
