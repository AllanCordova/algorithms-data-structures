import Stack from "../../src/models/Stack";
import { describe, expect, test } from "@jest/globals";

describe("Stack", () => {
  test.each([
    {
      title: "starts empty",
      run: () => {
        const stack = new Stack<number>();

        expect(stack.peek()).toBeUndefined();
      },
    },
    {
      title: "returns undefined when pop is called on an empty stack",
      run: () => {
        const stack = new Stack<number>();

        expect(stack.pop()).toBeUndefined();
      },
    },
    {
      title: "returns undefined when peek is called on an empty stack",
      run: () => {
        const stack = new Stack<number>();

        expect(stack.peek()).toBeUndefined();
      },
    },
    {
      title: "peek returns the last pushed value",
      run: () => {
        const stack = new Stack<number>();
        stack.push(10);
        stack.push(20);

        expect(stack.peek()).toBe(20);
      },
    },
    {
      title: "pop returns the last pushed value",
      run: () => {
        const stack = new Stack<number>();
        stack.push(15);
        stack.push(25);

        expect(stack.pop()).toBe(25);
      },
    },
    {
      title: "pop removes the top element",
      run: () => {
        const stack = new Stack<number>();
        stack.push(1);
        stack.push(2);

        expect(stack.pop()).toBe(2);
        expect(stack.peek()).toBe(1);
      },
    },
    {
      title: "popping the only element leaves the stack empty",
      run: () => {
        const stack = new Stack<number>();
        stack.push(7);

        expect(stack.pop()).toBe(7);
        expect(stack.peek()).toBeUndefined();
      },
    },
    {
      title: "follows LIFO order for multiple pushes",
      run: () => {
        const stack = new Stack<number>();
        stack.push(1);
        stack.push(2);
        stack.push(3);

        expect(stack.pop()).toBe(3);
        expect(stack.pop()).toBe(2);
        expect(stack.pop()).toBe(1);
      },
    },
    {
      title: "keeps LIFO order with interleaved push and pop operations",
      run: () => {
        const stack = new Stack<number>();
        stack.push(1);
        stack.push(2);

        expect(stack.pop()).toBe(2);

        stack.push(3);
        stack.push(4);

        expect(stack.pop()).toBe(4);
        expect(stack.pop()).toBe(3);
        expect(stack.pop()).toBe(1);
      },
    },
    {
      title: "peek does not remove the top element",
      run: () => {
        const stack = new Stack<number>();
        stack.push(5);
        stack.push(6);

        expect(stack.peek()).toBe(6);
        expect(stack.peek()).toBe(6);
        expect(stack.pop()).toBe(6);
      },
    },
    {
      title:
        "returns undefined when popping more times than available elements",
      run: () => {
        const stack = new Stack<number>();
        stack.push(1);

        expect(stack.pop()).toBe(1);
        expect(stack.pop()).toBeUndefined();
      },
    },
    {
      title: "remains empty after repeated pop on empty stack",
      run: () => {
        const stack = new Stack<number>();

        stack.pop();
        stack.pop();

        expect(stack.peek()).toBeUndefined();
      },
    },
    {
      title: "can be reused after being fully popped",
      run: () => {
        const stack = new Stack<number>();
        stack.push(1);
        stack.push(2);

        stack.pop();
        stack.pop();

        stack.push(3);

        expect(stack.peek()).toBe(3);
        expect(stack.pop()).toBe(3);
      },
    },
    {
      title: "handles duplicated values correctly",
      run: () => {
        const stack = new Stack<number>();
        stack.push(7);
        stack.push(7);
        stack.push(7);

        expect(stack.pop()).toBe(7);
        expect(stack.pop()).toBe(7);
        expect(stack.pop()).toBe(7);
      },
    },
    {
      title: "handles zero values correctly",
      run: () => {
        const stack = new Stack<number>();
        stack.push(0);
        stack.push(1);

        expect(stack.peek()).toBe(1);
        expect(stack.pop()).toBe(1);
        expect(stack.pop()).toBe(0);
      },
    },
    {
      title: "handles negative numbers correctly",
      run: () => {
        const stack = new Stack<number>();
        stack.push(-5);
        stack.push(-10);

        expect(stack.pop()).toBe(-10);
        expect(stack.pop()).toBe(-5);
      },
    },
    {
      title: "handles string values in LIFO order",
      run: () => {
        const stack = new Stack<string>();
        stack.push("a");
        stack.push("b");
        stack.push("c");

        expect(stack.pop()).toBe("c");
        expect(stack.pop()).toBe("b");
        expect(stack.pop()).toBe("a");
      },
    },
    {
      title: "handles boolean values including false",
      run: () => {
        const stack = new Stack<boolean>();
        stack.push(false);
        stack.push(true);

        expect(stack.peek()).toBe(true);
        expect(stack.pop()).toBe(true);
        expect(stack.pop()).toBe(false);
      },
    },
    {
      title: "handles null values as valid stack entries",
      run: () => {
        const stack = new Stack<null | number>();
        stack.push(null);
        stack.push(2);

        expect(stack.pop()).toBe(2);
        expect(stack.pop()).toBeNull();
      },
    },
    {
      title: "preserves object reference identity",
      run: () => {
        const stack = new Stack<{ id: number }>();
        const first = { id: 1 };
        const second = { id: 2 };

        stack.push(first);
        stack.push(second);

        expect(stack.pop()).toBe(second);
        expect(stack.pop()).toBe(first);
      },
    },
    {
      title: "supports long operation sequence while preserving LIFO order",
      run: () => {
        const stack = new Stack<number>();

        for (let i = 0; i < 50; i++) {
          stack.push(i);
        }

        for (let i = 49; i >= 0; i--) {
          expect(stack.pop()).toBe(i);
        }

        expect(stack.peek()).toBeUndefined();
      },
    },
  ])("$title", ({ run }) => {
    run();
  });
});
