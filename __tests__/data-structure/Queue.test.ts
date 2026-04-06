import Queue from "../../src/models/Queue";
import { describe, expect, test } from "@jest/globals";

describe("Queue", () => {
  test.each([
    {
      title: "starts empty",
      run: () => {
        const queue = new Queue<number>();

        expect(queue.isEmpty()).toBe(true);
      },
    },
    {
      title: "returns undefined when dequeue is called on an empty queue",
      run: () => {
        const queue = new Queue<number>();

        expect(queue.dequeue()).toBeUndefined();
      },
    },
    {
      title: "returns undefined when peek is called on an empty queue",
      run: () => {
        const queue = new Queue<number>();

        expect(queue.peek()).toBeUndefined();
      },
    },
    {
      title: "is no longer empty after one enqueue",
      run: () => {
        const queue = new Queue<number>();
        queue.queue(10);

        expect(queue.isEmpty()).toBe(false);
      },
    },
    {
      title: "peek returns the first enqueued value",
      run: () => {
        const queue = new Queue<number>();
        queue.queue(5);

        expect(queue.peek()).toBe(5);
      },
    },
    {
      title: "dequeue returns the first enqueued value",
      run: () => {
        const queue = new Queue<number>();
        queue.queue(12);

        expect(queue.dequeue()).toBe(12);
      },
    },
    {
      title: "becomes empty after dequeuing its only element",
      run: () => {
        const queue = new Queue<number>();
        queue.queue(8);
        queue.dequeue();

        expect(queue.isEmpty()).toBe(true);
      },
    },
    {
      title: "dequeues values in FIFO order with multiple elements",
      run: () => {
        const queue = new Queue<number>();
        queue.queue(1);
        queue.queue(2);
        queue.queue(3);

        expect(queue.dequeue()).toBe(1);
        expect(queue.dequeue()).toBe(2);
        expect(queue.dequeue()).toBe(3);
      },
    },
    {
      title: "keeps FIFO order for interleaved enqueue and dequeue operations",
      run: () => {
        const queue = new Queue<number>();
        queue.queue(1);
        queue.queue(2);

        expect(queue.dequeue()).toBe(1);

        queue.queue(3);
        queue.queue(4);

        expect(queue.dequeue()).toBe(2);
        expect(queue.dequeue()).toBe(3);
        expect(queue.dequeue()).toBe(4);
      },
    },
    {
      title: "peek does not remove the front element",
      run: () => {
        const queue = new Queue<number>();
        queue.queue(9);
        queue.queue(10);

        expect(queue.peek()).toBe(9);
        expect(queue.peek()).toBe(9);
        expect(queue.dequeue()).toBe(9);
      },
    },
    {
      title:
        "returns undefined when dequeuing more times than available elements",
      run: () => {
        const queue = new Queue<number>();
        queue.queue(1);

        expect(queue.dequeue()).toBe(1);
        expect(queue.dequeue()).toBeUndefined();
      },
    },
    {
      title: "remains empty after repeated dequeue on empty queue",
      run: () => {
        const queue = new Queue<number>();

        queue.dequeue();
        queue.dequeue();

        expect(queue.isEmpty()).toBe(true);
      },
    },
    {
      title: "can be reused after being fully dequeued",
      run: () => {
        const queue = new Queue<number>();
        queue.queue(1);
        queue.queue(2);

        queue.dequeue();
        queue.dequeue();

        queue.queue(3);

        expect(queue.peek()).toBe(3);
        expect(queue.dequeue()).toBe(3);
        expect(queue.isEmpty()).toBe(true);
      },
    },
    {
      title: "handles duplicated values correctly",
      run: () => {
        const queue = new Queue<number>();
        queue.queue(7);
        queue.queue(7);
        queue.queue(7);

        expect(queue.dequeue()).toBe(7);
        expect(queue.dequeue()).toBe(7);
        expect(queue.dequeue()).toBe(7);
      },
    },
    {
      title: "handles zero values correctly",
      run: () => {
        const queue = new Queue<number>();
        queue.queue(0);
        queue.queue(1);

        expect(queue.peek()).toBe(0);
        expect(queue.dequeue()).toBe(0);
        expect(queue.dequeue()).toBe(1);
      },
    },
    {
      title: "handles negative numbers correctly",
      run: () => {
        const queue = new Queue<number>();
        queue.queue(-5);
        queue.queue(-10);

        expect(queue.dequeue()).toBe(-5);
        expect(queue.dequeue()).toBe(-10);
      },
    },
    {
      title: "handles string values in FIFO order",
      run: () => {
        const queue = new Queue<string>();
        queue.queue("a");
        queue.queue("b");
        queue.queue("c");

        expect(queue.dequeue()).toBe("a");
        expect(queue.dequeue()).toBe("b");
        expect(queue.dequeue()).toBe("c");
      },
    },
    {
      title: "handles boolean values including false",
      run: () => {
        const queue = new Queue<boolean>();
        queue.queue(false);
        queue.queue(true);

        expect(queue.peek()).toBe(false);
        expect(queue.dequeue()).toBe(false);
        expect(queue.dequeue()).toBe(true);
      },
    },
    {
      title: "handles null values as valid queue entries",
      run: () => {
        const queue = new Queue<null | number>();
        queue.queue(null);
        queue.queue(2);

        expect(queue.dequeue()).toBeNull();
        expect(queue.dequeue()).toBe(2);
      },
    },
    {
      title: "preserves object reference identity",
      run: () => {
        const queue = new Queue<{ id: number }>();
        const first = { id: 1 };
        const second = { id: 2 };

        queue.queue(first);
        queue.queue(second);

        expect(queue.dequeue()).toBe(first);
        expect(queue.dequeue()).toBe(second);
      },
    },
    {
      title: "supports long operation sequence while preserving order",
      run: () => {
        const queue = new Queue<number>();

        for (let i = 0; i < 50; i++) {
          queue.queue(i);
        }

        for (let i = 0; i < 50; i++) {
          expect(queue.dequeue()).toBe(i);
        }

        expect(queue.isEmpty()).toBe(true);
      },
    },
    {
      title: "returns new front after dequeue",
      run: () => {
        const queue = new Queue<number>();
        queue.queue(11);
        queue.queue(22);

        queue.dequeue();

        expect(queue.peek()).toBe(22);
      },
    },
  ])("$title", ({ run }) => {
    run();
  });
});
