"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformInputData = void 0;
const getOffsetFromAngle_1 = require("../../utils/getOffsetFromAngle");
const tickHelpers_1 = require("../../utils/tickHelpers");
const asNumber_1 = require("../../utils/asNumber");
const getLabelDimensions_1 = require("../../utils/getLabelDimensions");
const makeScale_1 = require("./makeScale");
/**
 * This is a fatty. Takes raw user input data, and transforms it into a format
 *  that's easier for us to consume. End result looks something like:
 *  {
 *    ix: [1, 2, 3], // input x values
 *    ox: [10, 20, 30], // canvas x values
 *    y: {
 *      high: { i: [3, 4, 5], o: [30, 40, 50] },
 *      low: { ... }
 *    }
 *  }
 *  This form allows us to easily e.g. do a binary search to find closest output x index
 *   and then map that into each of the other value lists.
 */
const transformInputData = ({ data: _data, xKey, yKeys, outputWindow, domain, domainPadding, xAxis, yAxes, viewport, labelRotate, axisScales, }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const data = [..._data];
    const { xAxisScale = "linear", yAxisScale = "linear" } = axisScales || {};
    // Determine if xKey data is numerical
    const isNumericalData = data.every((datum) => typeof datum[xKey] === "number");
    // and sort if it is
    if (isNumericalData) {
        data.sort((a, b) => +a[xKey] - +b[xKey]);
    }
    // // Set up our y-output data structure
    const y = yKeys.reduce((acc, k) => {
        acc[k] = { i: [], o: [] };
        return acc;
    }, {});
    const rawChartWidth = outputWindow.xMax - outputWindow.xMin;
    const xTickValues = xAxis === null || xAxis === void 0 ? void 0 : xAxis.tickValues;
    const xTicks = xAxis === null || xAxis === void 0 ? void 0 : xAxis.tickCount;
    const tickDomainsX = (0, tickHelpers_1.getDomainFromTicks)(xTickValues);
    const ix = data.map((datum) => datum[xKey]);
    const ixNum = ix.map((val, i) => (isNumericalData ? val : i));
    // For non‐numeric (ordinal) data, use the index values
    // if user provides a domain- use that as our min/max
    // if tickValues are provided- we use that instead
    // if we find min/max of y values across all yKeys- and use that for yrange instead
    const ixMin = isNumericalData
        ? (0, asNumber_1.asNumber)((_c = (_b = (_a = domain === null || domain === void 0 ? void 0 : domain.x) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : tickDomainsX === null || tickDomainsX === void 0 ? void 0 : tickDomainsX[0]) !== null && _c !== void 0 ? _c : ixNum.at(0))
        : 0;
    const ixMax = isNumericalData
        ? (0, asNumber_1.asNumber)((_f = (_e = (_d = domain === null || domain === void 0 ? void 0 : domain.x) === null || _d === void 0 ? void 0 : _d[1]) !== null && _e !== void 0 ? _e : tickDomainsX === null || tickDomainsX === void 0 ? void 0 : tickDomainsX[1]) !== null && _f !== void 0 ? _f : ixNum.at(-1))
        : ixNum.length - 1;
    const xTempScale = (0, makeScale_1.makeScale)({
        inputBounds: ixMin === ixMax ? [ixMin - 1, ixMax + 1] : [ixMin, ixMax],
        outputBounds: [0, rawChartWidth],
        axisScale: xAxisScale,
    });
    // Exact tick count on linear X (same as Y / zoom-rescaled axes); log uses d3 .ticks().
    const xTicksCount = xTicks !== null && xTicks !== void 0 ? xTicks : tickHelpers_1.DEFAULT_TICK_COUNT;
    const xTicksNormalized = xTickValues
        ? (0, tickHelpers_1.downsampleTicks)(xTickValues, xTicksCount)
        : (0, tickHelpers_1.exactTicksFromScale)(xTempScale, xTicksCount);
    const xLabelMeasurements = xTicksNormalized.map((xTick) => {
        const labelValue = xAxis.formatXLabel
            ? xAxis.formatXLabel(xTick)
            : String(xTick);
        return (0, getLabelDimensions_1.getLabelDimensions)({
            text: String(labelValue),
            font: xAxis.font,
            labelRenderer: xAxis.labelRenderer,
        });
    });
    const maxXLabel = Math.max(0, ...xLabelMeasurements.map((measurement) => measurement.width));
    const maxXLabelHeight = Math.max(0, ...xLabelMeasurements.map((measurement) => measurement.height));
    // workt with adjustedoutputwindow isntead of directly
    // working with outpuwidnow
    const adjustedOutputWindow = Object.assign({}, outputWindow);
    if (labelRotate && xAxis.labelPosition === "outset") {
        const rotateOffset = Math.abs(maxXLabel * (0, getOffsetFromAngle_1.getOffsetFromAngle)(labelRotate));
        if (xAxis.axisSide === "bottom") {
            adjustedOutputWindow.yMax -= rotateOffset;
        }
        else if (xAxis.axisSide === "top") {
            adjustedOutputWindow.yMin += rotateOffset;
        }
    }
    // 1. Set up our y axes first...
    // Transform data for each y-axis configuration
    const yAxesTransformed = (_g = (yAxes !== null && yAxes !== void 0 ? yAxes : [{}])) === null || _g === void 0 ? void 0 : _g.map((yAxis) => {
        var _a, _b, _c, _d, _e, _f, _g;
        const yTickValues = yAxis.tickValues;
        const yTicks = yAxis.tickCount;
        const tickDomainsY = yAxis.domain
            ? yAxis.domain
            : (0, tickHelpers_1.getDomainFromTicks)(yAxis.tickValues);
        const yKeysForAxis = (_a = yAxis.yKeys) !== null && _a !== void 0 ? _a : yKeys;
        const yMin = (_d = (_c = (_b = domain === null || domain === void 0 ? void 0 : domain.y) === null || _b === void 0 ? void 0 : _b[0]) !== null && _c !== void 0 ? _c : tickDomainsY === null || tickDomainsY === void 0 ? void 0 : tickDomainsY[0]) !== null && _d !== void 0 ? _d : Math.min(...yKeysForAxis.map((key) => {
            return data.reduce((min, curr) => {
                if (typeof curr[key] !== "number")
                    return min;
                return Math.min(min, curr[key]);
            }, Infinity);
        }));
        const yMax = (_g = (_f = (_e = domain === null || domain === void 0 ? void 0 : domain.y) === null || _e === void 0 ? void 0 : _e[1]) !== null && _f !== void 0 ? _f : tickDomainsY === null || tickDomainsY === void 0 ? void 0 : tickDomainsY[1]) !== null && _g !== void 0 ? _g : Math.max(...yKeysForAxis.map((key) => {
            return data.reduce((max, curr) => {
                if (typeof curr[key] !== "number")
                    return max;
                return Math.max(max, curr[key]);
            }, -Infinity);
        }));
        // Set up our y-scale, notice how domain is "flipped" because
        //  we're moving from cartesian to canvas coordinates
        // Also, if single data point, manually add upper & lower bounds so chart renders properly
        const yScaleDomain = (yMax === yMin ? [yMax + 1, yMin - 1] : [yMax, yMin]);
        const yScaleRange = (() => {
            var _a, _b;
            const xTickCount = (_a = (typeof (yAxis === null || yAxis === void 0 ? void 0 : yAxis.tickCount) === "number"
                ? yAxis === null || yAxis === void 0 ? void 0 : yAxis.tickCount
                : xAxis === null || xAxis === void 0 ? void 0 : xAxis.tickCount)) !== null && _a !== void 0 ? _a : 0;
            const yLabelOffset = (_b = yAxis.labelOffset) !== null && _b !== void 0 ? _b : 0;
            const xAxisSide = xAxis === null || xAxis === void 0 ? void 0 : xAxis.axisSide;
            const xLabelPosition = xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelPosition;
            if (xAxisSide === "bottom" && xLabelPosition === "outset") {
                return [
                    adjustedOutputWindow.yMin,
                    adjustedOutputWindow.yMax +
                        (xTickCount > 0 ? -maxXLabelHeight - yLabelOffset * 2 : 0),
                ];
            }
            if (xAxisSide === "top" && xLabelPosition === "outset") {
                return [
                    adjustedOutputWindow.yMin +
                        (xTickCount > 0 ? maxXLabelHeight + yLabelOffset * 2 : 0),
                    adjustedOutputWindow.yMax,
                ];
            }
            return [adjustedOutputWindow.yMin, adjustedOutputWindow.yMax];
        })();
        const yScale = (0, makeScale_1.makeScale)({
            inputBounds: yScaleDomain,
            outputBounds: yScaleRange,
            // Reverse viewport y values since canvas coordinates increase downward
            viewport: (viewport === null || viewport === void 0 ? void 0 : viewport.y) ? [viewport.y[1], viewport.y[0]] : yScaleDomain,
            // `nice()` expands the domain to round numbers and yields ~tickCount ticks
            // instead of exactly tickCount; disabled so explicit tickValues / tickCount
            // are honored and top/bottom segments line up with the data domain.
            isNice: false,
            padEnd: typeof domainPadding === "number"
                ? domainPadding
                : domainPadding === null || domainPadding === void 0 ? void 0 : domainPadding.bottom,
            padStart: typeof domainPadding === "number" ? domainPadding : domainPadding === null || domainPadding === void 0 ? void 0 : domainPadding.top,
            axisScale: yAxisScale,
        });
        const yData = yKeysForAxis.reduce((acc, key) => {
            acc[key] = {
                i: data.map((datum) => datum[key]),
                o: data.map((datum) => typeof datum[key] === "number"
                    ? yScale(datum[key])
                    : datum[key]),
            };
            return acc;
        }, {});
        // Honor an explicit tickCount exactly: evenly distribute `yTicks` values
        // across the data domain instead of relying on d3's `scale.ticks(n)`,
        // which only returns ~n "nice" values.
        const yTicksNormalized = yTickValues
            ? (0, tickHelpers_1.downsampleTicks)(yTickValues, yTicks)
            : typeof yTicks === "number" && yTicks > 0
                ? yTicks === 1
                    ? [(yMin + yMax) / 2]
                    : Array.from({ length: yTicks }, (_, i) => yMin + ((yMax - yMin) * i) / (yTicks - 1))
                : (0, tickHelpers_1.exactTicksFromScale)(yScale, yTicks !== null && yTicks !== void 0 ? yTicks : tickHelpers_1.DEFAULT_TICK_COUNT);
        yKeys.forEach((yKey) => {
            if (yKeysForAxis.includes(yKey)) {
                y[yKey].i = data.map((datum) => datum[yKey]);
                y[yKey].o = data.map((datum) => (typeof datum[yKey] === "number"
                    ? yScale(datum[yKey])
                    : datum[yKey]));
            }
        });
        const maxYLabel = Math.max(0, ...yTicksNormalized.map((yTick) => {
            var _a;
            return (0, getLabelDimensions_1.getLabelDimensions)({
                text: ((_a = yAxis === null || yAxis === void 0 ? void 0 : yAxis.formatYLabel) === null || _a === void 0 ? void 0 : _a.call(yAxis, yTick)) || String(yTick),
                font: yAxis.font,
                labelRenderer: yAxis.labelRenderer,
            }).width;
        }));
        return {
            yScale,
            yTicksNormalized,
            yData,
            maxYLabel,
        };
    });
    // 2. Then set up our x axis...
    // Determine the x-output range based on yAxes/label options
    const oRange = (() => {
        let xMinAdjustment = 0;
        let xMaxAdjustment = 0;
        yAxes === null || yAxes === void 0 ? void 0 : yAxes.forEach((axis, index) => {
            var _a, _b;
            const yTickCount = axis.tickCount;
            const yLabelPosition = axis.labelPosition;
            const yAxisSide = axis.axisSide;
            const yLabelOffset = axis.labelOffset;
            // Calculate label width for this axis
            const labelWidth = (_b = (_a = yAxesTransformed[index]) === null || _a === void 0 ? void 0 : _a.maxYLabel) !== null && _b !== void 0 ? _b : 0;
            // Adjust xMin or xMax based on the axis side and label position
            // make ajdustments  for label rotation here
            if (yAxisSide === "left" && yLabelPosition === "outset") {
                xMinAdjustment += yTickCount > 0 ? labelWidth + yLabelOffset : 0;
            }
            else if (yAxisSide === "right" && yLabelPosition === "outset") {
                xMaxAdjustment += yTickCount > 0 ? -labelWidth - yLabelOffset : 0;
            }
        });
        // Return the adjusted output range
        return [
            adjustedOutputWindow.xMin + xMinAdjustment,
            adjustedOutputWindow.xMax + xMaxAdjustment,
        ];
    })();
    const xInputBounds = ixMin === ixMax ? [ixMin - 1, ixMax + 1] : [ixMin, ixMax];
    const xScale = (0, makeScale_1.makeScale)({
        // if single data point, manually add upper & lower bounds so chart renders properly
        inputBounds: xInputBounds,
        outputBounds: oRange,
        viewport: (_h = viewport === null || viewport === void 0 ? void 0 : viewport.x) !== null && _h !== void 0 ? _h : xInputBounds,
        padStart: typeof domainPadding === "number" ? domainPadding : domainPadding === null || domainPadding === void 0 ? void 0 : domainPadding.left,
        padEnd: typeof domainPadding === "number" ? domainPadding : domainPadding === null || domainPadding === void 0 ? void 0 : domainPadding.right,
        axisScale: xAxisScale,
    });
    const finalXTicksNormalized = isNumericalData
        ? xTickValues
            ? (0, tickHelpers_1.downsampleTicks)(xTickValues, xTicksCount)
            : (0, tickHelpers_1.exactTicksFromScale)(xScale, xTicksCount)
        : ixNum;
    const ox = ixNum.map((x) => xScale(x));
    return {
        ix,
        y,
        isNumericalData,
        ox,
        xScale,
        xTicksNormalized: finalXTicksNormalized,
        // conform to type NonEmptyArray<T>
        yAxes: [yAxesTransformed[0], ...yAxesTransformed.slice(1)],
    };
};
exports.transformInputData = transformInputData;
