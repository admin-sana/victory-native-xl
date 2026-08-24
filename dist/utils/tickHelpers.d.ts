import type { ScaleLinear, ScaleLogarithmic } from "d3-scale";
export declare const DEFAULT_TICK_COUNT = 5;
/**
 * Exactly `count` evenly-spaced numeric ticks between the extents of `domain`
 * (order-independent: uses min/max of the two endpoints).
 * Unlike d3's `linear.ticks(n)`, this always returns length `count` when count ≥ 1
 * and the domain span is positive.
 */
export declare const exactLinearTicksFromDomain: (domain: [number, number], count: number) => number[];
/**
 * Exact tick count on linear scales; defers to d3's `.ticks()` on logarithmic scales.
 */
export declare const exactTicksFromScale: (scale: ScaleLinear<number, number> | ScaleLogarithmic<number, number>, count: number) => number[];
export declare const downsampleTicks: (tickValues: number[], tickCount: number) => number[];
export declare const getDomainFromTicks: (tickValues: number[] | undefined) => [number, number] | undefined;
