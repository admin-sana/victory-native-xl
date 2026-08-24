"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XAxisDefaults = exports.XAxis = void 0;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_native_skia_1 = require("@shopify/react-native-skia");
const getOffsetFromAngle_1 = require("../../utils/getOffsetFromAngle");
const boundsToClip_1 = require("../../utils/boundsToClip");
const tickHelpers_1 = require("../../utils/tickHelpers");
const getLabelDimensions_1 = require("../../utils/getLabelDimensions");
const XAxis = ({ xScale: xScaleProp, yScale, axisSide = "bottom", yAxisSide = "left", labelPosition = "outset", labelRotate, tickCount = tickHelpers_1.DEFAULT_TICK_COUNT, tickValues, labelOffset = 2, labelColor = "#000000", lineWidth = react_native_1.StyleSheet.hairlineWidth, lineColor = "hsla(0, 0%, 0%, 0.25)", font, labelRenderer, formatXLabel = (label) => String(label), ix = [], isNumericalData, linePathEffect, chartBounds, enableRescaling, zoom, }) => {
    var _a;
    const xScale = zoom ? zoom.rescaleX(xScaleProp) : xScaleProp;
    const [y1 = 0, y2 = 0] = yScale.domain();
    const fontSize = (_a = font === null || font === void 0 ? void 0 : font.getSize()) !== null && _a !== void 0 ? _a : 0;
    const scaleForXTicks = enableRescaling ? xScale : xScaleProp;
    const xTicksNormalized = enableRescaling
        ? (0, tickHelpers_1.exactTicksFromScale)(scaleForXTicks, tickCount)
        : tickValues
            ? (0, tickHelpers_1.downsampleTicks)(tickValues, tickCount)
            : (0, tickHelpers_1.exactTicksFromScale)(xScaleProp, tickCount);
    const xAxisNodes = xTicksNormalized.map((tick) => {
        const p1 = (0, react_native_skia_1.vec)(xScale(tick), yScale(y2));
        const p2 = (0, react_native_skia_1.vec)(xScale(tick), yScale(y1));
        const val = isNumericalData ? tick : ix[tick];
        const contentX = formatXLabel(val);
        const { width: labelWidth, height: labelHeight } = (0, getLabelDimensions_1.getLabelDimensions)({
            text: contentX,
            font,
            labelRenderer,
        });
        // Paragraph-rendered labels: anchor to the right side of the gridline and
        // clamp the trailing label inside chartBounds so the last tick never overflows.
        const labelX = labelRenderer
            ? Math.max(chartBounds.left, Math.min(xScale(tick), chartBounds.right - (labelWidth !== null && labelWidth !== void 0 ? labelWidth : 0)))
            : xScale(tick) - (labelWidth !== null && labelWidth !== void 0 ? labelWidth : 0) / 2;
        const canFitLabelContent = labelRenderer
            ? xScale(tick) >= chartBounds.left && xScale(tick) <= chartBounds.right
            : xScale(tick) >= chartBounds.left &&
                xScale(tick) <= chartBounds.right &&
                (yAxisSide === "left"
                    ? labelX + labelWidth < chartBounds.right
                    : chartBounds.left < labelX);
        const labelY = (() => {
            if (labelRenderer) {
                if (axisSide === "bottom" && labelPosition === "outset") {
                    return chartBounds.bottom + labelOffset;
                }
                if (axisSide === "bottom" && labelPosition === "inset") {
                    return yScale(y2) - labelOffset - labelHeight;
                }
                if (axisSide === "top" && labelPosition === "outset") {
                    return yScale(y1) - labelOffset - labelHeight;
                }
                return yScale(y1) + labelOffset;
            }
            // bottom, outset
            if (axisSide === "bottom" && labelPosition === "outset") {
                return chartBounds.bottom + labelOffset + fontSize;
            }
            // bottom, inset
            if (axisSide === "bottom" && labelPosition === "inset") {
                return yScale(y2) - labelOffset;
            }
            // top, outset
            if (axisSide === "top" && labelPosition === "outset") {
                return yScale(y1) - labelOffset;
            }
            // top, inset
            return yScale(y1) + fontSize + labelOffset;
        })();
        // Calculate origin and translate for label rotation
        const { origin, rotateOffset } = (() => {
            let rotateOffset = 0;
            let origin;
            // return defaults if no labelRotate is provided
            if (!labelRotate)
                return { origin, rotateOffset };
            if (axisSide === "bottom" && labelPosition === "outset") {
                // bottom, outset
                origin = labelRenderer
                    ? (0, react_native_skia_1.vec)(labelX + labelWidth / 2, labelY + labelHeight / 2)
                    : (0, react_native_skia_1.vec)(labelX + labelWidth / 2, labelY);
                rotateOffset = Math.abs((labelWidth / 2) * (0, getOffsetFromAngle_1.getOffsetFromAngle)(labelRotate));
            }
            else if (axisSide === "bottom" && labelPosition === "inset") {
                // bottom, inset
                origin = labelRenderer
                    ? (0, react_native_skia_1.vec)(labelX + labelWidth / 2, labelY + labelHeight / 2)
                    : (0, react_native_skia_1.vec)(labelX + labelWidth / 2, labelY);
                rotateOffset = -Math.abs((labelWidth / 2) * (0, getOffsetFromAngle_1.getOffsetFromAngle)(labelRotate));
            }
            else if (axisSide === "top" && labelPosition === "inset") {
                // top, inset
                origin = labelRenderer
                    ? (0, react_native_skia_1.vec)(labelX + labelWidth / 2, labelY + labelHeight / 2)
                    : (0, react_native_skia_1.vec)(labelX + labelWidth / 2, labelY - fontSize / 4);
                rotateOffset = Math.abs((labelWidth / 2) * (0, getOffsetFromAngle_1.getOffsetFromAngle)(labelRotate));
            }
            else {
                // top, outset
                origin = labelRenderer
                    ? (0, react_native_skia_1.vec)(labelX + labelWidth / 2, labelY + labelHeight / 2)
                    : (0, react_native_skia_1.vec)(labelX + labelWidth / 2, labelY - fontSize / 4);
                rotateOffset = -Math.abs((labelWidth / 2) * (0, getOffsetFromAngle_1.getOffsetFromAngle)(labelRotate));
            }
            return { origin, rotateOffset };
        })();
        return (<react_1.default.Fragment key={`x-tick-${tick}`}>
        {lineWidth > 0 ? (<react_native_skia_1.Group clip={(0, boundsToClip_1.boundsToClip)(chartBounds)}>
            <react_native_skia_1.Line p1={p1} p2={p2} color={lineColor} strokeWidth={lineWidth}>
              {linePathEffect ? linePathEffect : null}
            </react_native_skia_1.Line>
          </react_native_skia_1.Group>) : null}
        {(font || labelRenderer) && labelWidth && canFitLabelContent ? (<react_native_skia_1.Group transform={[{ translateY: rotateOffset }]}>
            {labelRenderer ? (<react_native_skia_1.Group transform={[
                        {
                            rotate: (Math.PI / 180) * (labelRotate !== null && labelRotate !== void 0 ? labelRotate : 0),
                        },
                    ]} origin={origin}>
                {labelRenderer.render({
                        text: contentX,
                        color: labelColor,
                        x: labelX,
                        y: labelY,
                        width: labelWidth,
                        height: labelHeight,
                        rotation: labelRotate !== null && labelRotate !== void 0 ? labelRotate : 0,
                        origin,
                    })}
              </react_native_skia_1.Group>) : (<react_native_skia_1.Text transform={[
                        {
                            rotate: (Math.PI / 180) * (labelRotate !== null && labelRotate !== void 0 ? labelRotate : 0),
                        },
                    ]} origin={origin} color={labelColor} text={contentX} font={font !== null && font !== void 0 ? font : null} y={labelY} x={labelX}/>)}
          </react_native_skia_1.Group>) : null}
        <></>
      </react_1.default.Fragment>);
    });
    return xAxisNodes;
};
exports.XAxis = XAxis;
exports.XAxisDefaults = {
    lineColor: "hsla(0, 0%, 0%, 0.25)",
    lineWidth: react_native_1.StyleSheet.hairlineWidth,
    tickCount: 5,
    labelOffset: 2,
    axisSide: "bottom",
    yAxisSide: "left",
    labelPosition: "outset",
    formatXLabel: (label) => String(label),
    labelColor: "#000000",
    labelRotate: 0,
};
