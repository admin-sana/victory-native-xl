"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLabelDimensions = void 0;
const getLabelDimensions = ({ text, font, labelRenderer, }) => {
    var _a, _b;
    if (labelRenderer)
        return labelRenderer.measureText(text);
    const width = (_a = font === null || font === void 0 ? void 0 : font.getGlyphWidths(font.getGlyphIDs(text)).reduce((sum, value) => sum + value, 0)) !== null && _a !== void 0 ? _a : 0;
    return {
        width,
        height: (_b = font === null || font === void 0 ? void 0 : font.getSize()) !== null && _b !== void 0 ? _b : 0,
    };
};
exports.getLabelDimensions = getLabelDimensions;
