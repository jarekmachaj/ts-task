import { hasOneOf } from "./Utils";

describe("utils.hasOneOf", () => {
    test("should return true when set has one of values in array", () => {
        const result = hasOneOf(new Set<string>(["one", "two", "three", "four"]), ["three", "none", "xx"]);
        expect(result).toEqual(true);
    });

    test("should return true when has all values in array", () => {
        const result = hasOneOf(new Set<string>(["one", "two", "three", "four"]), ["one", "two", "three", "four"]);
        expect(result).toEqual(true);
    });

    test("should return false when set has none of values in array", () => {
        const result = hasOneOf(new Set<string>(["one", "two", "three", "four"]), ["zero", "none", "xx"]);
        expect(result).toEqual(false);
    });
});