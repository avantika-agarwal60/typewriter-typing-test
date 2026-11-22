import { describe, it, expect} from "vitest";
import * as stats from "./stats.js";
describe ("stats", ()=>{
it("calculates instantaneous cps", ()=>{ expect(stats.instantCPS(1200,1000,0)).toBe(5)});
it("should return previous inst cps when gap is exactly 0", ()=> {expect(stats.instantCPS(2500,2500,5)).toBe(5)});
it("calculates instantaneous wpm", ()=> {expect(stats.instantWPM(4)).toBe(48)});
it("still computes a value for gaps over 2 seconds", () => {
    expect(stats.instantCPS(3500, 1000, 5)).toBeCloseTo(0.4);  
});
it("is 100% with no mistakes", () => {
        expect(stats.accuracy(20, 0)).toBe(100);
    });
it("ignores pauses over 2 seconds", () => {
    expect(stats.affectsAverage(2000)).toBe(true);
    expect(stats.affectsAverage(2001)).toBe(false);
});
it("avg WPM matches the expanded formula", () => {
    expect(stats.avgWPM(10, 2000)).toBeCloseTo((1000 * 60 * 10) / (2000 * 5));
});
it ("calculates avg cps", ()=>{expect(stats.avgCPS(500,250000)).toBe(2)});
it ("reduces wpm or cps to account for errors", ()=> {
    expect(stats.normalized(78,90)).toBe(70.2)
});
});