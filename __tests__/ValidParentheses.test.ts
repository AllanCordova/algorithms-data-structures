import ValidParentheses from "../src/exercises/ValidParentheses";
import { describe, expect, test } from "@jest/globals";

describe("ValidParentheses.solve", () => {
  const solver = new ValidParentheses();

  test.each([
    {
      title: "returns true for empty string",
      exp: "",
      expected: true,
    },
    {
      title: "returns true for simple balanced parentheses",
      exp: "()",
      expected: true,
    },
    {
      title: "returns true for simple balanced brackets",
      exp: "[]",
      expected: true,
    },
    {
      title: "returns true for simple balanced braces",
      exp: "{}",
      expected: true,
    },
    {
      title: "returns true for mixed balanced sequence",
      exp: "()[]{}",
      expected: true,
    },
    {
      title: "returns true for nested balanced sequence",
      exp: "({[]})",
      expected: true,
    },
    {
      title: "returns false for wrong nesting order",
      exp: "([)]",
      expected: false,
    },
    {
      title: "returns false when opening tokens are left over",
      exp: "(((()",
      expected: false,
    },
    {
      title: "returns false for single opening token",
      exp: "(",
      expected: false,
    },
    {
      title: "returns false for single closing token",
      exp: ")",
      expected: false,
    },
    {
      title: "returns false when string starts with closing token",
      exp: "][]",
      expected: false,
    },
    {
      title: "returns false for long unbalanced sequence",
      exp: "{[()]}[({})](",
      expected: false,
    },
  ])("$title", ({ exp, expected }) => {
    expect(solver.solve(exp)).toBe(expected);
  });
});
