import TwoSum from "../src/exercises/TwoSum";
import { describe, expect, test } from "@jest/globals";

describe("TwoSum.solve", () => {
  const solver = new TwoSum();

  test.each([
    {
      title: "returns indices for a basic pair",
      nums: [2, 7, 11, 15],
      target: 9,
      expected: [0, 1],
    },
    {
      title: "returns indices when pair appears later in the list",
      nums: [1, 3, 4, 2],
      target: 6,
      expected: [2, 3],
    },
    {
      title: "handles duplicated numbers as valid pair",
      nums: [3, 3],
      target: 6,
      expected: [0, 1],
    },
    {
      title: "handles zero as part of the answer",
      nums: [0, 4, 3, 0],
      target: 0,
      expected: [0, 3],
    },
    {
      title: "handles negative numbers",
      nums: [-3, 4, 3, 90],
      target: 0,
      expected: [0, 2],
    },
    {
      title: "handles negative target",
      nums: [-5, -2, -8, 1],
      target: -7,
      expected: [0, 1],
    },
    {
      title: "returns first valid pair based on one-pass lookup",
      nums: [1, 2, 3, 4],
      target: 5,
      expected: [1, 2],
    },
    {
      title: "does not reuse the same element twice",
      nums: [3, 2, 4],
      target: 6,
      expected: [1, 2],
    },
    {
      title: "returns empty array when no pair exists",
      nums: [1, 2, 3],
      target: 100,
      expected: [],
    },
    {
      title: "returns empty array for single-element array",
      nums: [42],
      target: 42,
      expected: [],
    },
    {
      title: "returns empty array for empty array",
      nums: [],
      target: 10,
      expected: [],
    },
    {
      title: "handles large numbers",
      nums: [1_000_000, 2, 999_998],
      target: 1_000_000,
      expected: [1, 2],
    },
  ])("$title", ({ nums, target, expected }) => {
    expect(solver.solve(nums, target)).toEqual(expected);
  });
});
