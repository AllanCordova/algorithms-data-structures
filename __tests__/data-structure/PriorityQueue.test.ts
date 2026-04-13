import PriorityQueue from "../../src/models/PriorityQueue";
import { describe, expect, test } from "@jest/globals";
import { performance } from "node:perf_hooks";

type TestCase = {
  title: string;
  run: () => void;
};

const createDeterministicRandom = (seed: number) => {
  let t = seed;

  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), t | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);

    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
};

const removeFirstOccurrence = (arr: number[], value: number): void => {
  const index = arr.indexOf(value);
  if (index >= 0) {
    arr.splice(index, 1);
  }
};

const runWorkload = (size: number): number => {
  const queue = new PriorityQueue<number>();
  const random = createDeterministicRandom(2026 + size);

  const start = performance.now();

  for (let i = 0; i < size; i++) {
    const priority = Math.floor(random() * 100000);
    queue.enqueue(i, priority);
  }

  for (let i = 0; i < size; i++) {
    queue.dequeue();
  }

  return performance.now() - start;
};

describe("PriorityQueue", () => {
  const cases: TestCase[] = [
    {
      title: "starts empty with size 0",
      run: () => {
        const queue = new PriorityQueue<number>();

        expect(queue.getSize()).toBe(0);
      },
    },
    {
      title: "peek returns undefined for empty queue",
      run: () => {
        const queue = new PriorityQueue<number>();

        expect(queue.peek()).toBeUndefined();
      },
    },
    {
      title: "dequeue returns undefined for empty queue",
      run: () => {
        const queue = new PriorityQueue<number>();

        expect(queue.dequeue()).toBeUndefined();
      },
    },
    {
      title: "enqueue increases size",
      run: () => {
        const queue = new PriorityQueue<string>();

        queue.enqueue("task", 1);

        expect(queue.getSize()).toBe(1);
      },
    },
    {
      title: "peek returns highest-priority value",
      run: () => {
        const queue = new PriorityQueue<string>();

        queue.enqueue("low", 1);
        queue.enqueue("high", 5);

        expect(queue.peek()?.value).toBe("high");
      },
    },
    {
      title: "peek does not remove root node",
      run: () => {
        const queue = new PriorityQueue<number>();

        queue.enqueue(1, 1);
        queue.enqueue(2, 2);

        expect(queue.peek()?.priority).toBe(2);
        expect(queue.peek()?.priority).toBe(2);
        expect(queue.getSize()).toBe(2);
      },
    },
    {
      title: "dequeue returns highest-priority node",
      run: () => {
        const queue = new PriorityQueue<number>();

        queue.enqueue(1, 1);
        queue.enqueue(2, 3);
        queue.enqueue(3, 2);

        const node = queue.dequeue();

        expect(node?.value).toBe(2);
        expect(node?.priority).toBe(3);
      },
    },
    {
      title: "dequeue order is non-increasing by priority",
      run: () => {
        const queue = new PriorityQueue<number>();

        queue.enqueue(1, 10);
        queue.enqueue(2, 50);
        queue.enqueue(3, 20);
        queue.enqueue(4, 40);
        queue.enqueue(5, 30);

        const priorities = [
          queue.dequeue()?.priority,
          queue.dequeue()?.priority,
          queue.dequeue()?.priority,
          queue.dequeue()?.priority,
          queue.dequeue()?.priority,
        ];

        expect(priorities).toEqual([50, 40, 30, 20, 10]);
      },
    },
    {
      title: "supports negative priorities",
      run: () => {
        const queue = new PriorityQueue<string>();

        queue.enqueue("a", -10);
        queue.enqueue("b", -1);
        queue.enqueue("c", -5);

        expect(queue.dequeue()?.value).toBe("b");
        expect(queue.dequeue()?.value).toBe("c");
        expect(queue.dequeue()?.value).toBe("a");
      },
    },
    {
      title: "supports zero priority",
      run: () => {
        const queue = new PriorityQueue<number>();

        queue.enqueue(1, 0);
        queue.enqueue(2, -1);

        expect(queue.dequeue()?.priority).toBe(0);
      },
    },
    {
      title: "handles duplicate priorities",
      run: () => {
        const queue = new PriorityQueue<string>();

        queue.enqueue("a", 5);
        queue.enqueue("b", 5);
        queue.enqueue("c", 5);

        const first = queue.dequeue();
        const second = queue.dequeue();
        const third = queue.dequeue();

        expect(first?.priority).toBe(5);
        expect(second?.priority).toBe(5);
        expect(third?.priority).toBe(5);
      },
    },
    {
      title: "size decreases after dequeue",
      run: () => {
        const queue = new PriorityQueue<number>();

        queue.enqueue(1, 1);
        queue.enqueue(2, 2);
        queue.dequeue();

        expect(queue.getSize()).toBe(1);
      },
    },
    {
      title: "can be reused after being emptied",
      run: () => {
        const queue = new PriorityQueue<number>();

        queue.enqueue(1, 1);
        queue.dequeue();

        queue.enqueue(2, 10);

        expect(queue.peek()?.value).toBe(2);
      },
    },
    {
      title: "works with boolean values including false",
      run: () => {
        const queue = new PriorityQueue<boolean>();

        queue.enqueue(false, 2);
        queue.enqueue(true, 1);

        expect(queue.dequeue()?.value).toBe(false);
        expect(queue.dequeue()?.value).toBe(true);
      },
    },
    {
      title: "works with null values",
      run: () => {
        const queue = new PriorityQueue<number | null>();

        queue.enqueue(null, 1);
        queue.enqueue(5, 2);

        expect(queue.dequeue()?.value).toBe(5);
        expect(queue.dequeue()?.value).toBeNull();
      },
    },
    {
      title: "preserves object identity for values",
      run: () => {
        const queue = new PriorityQueue<{ id: number }>();
        const objectA = { id: 1 };
        const objectB = { id: 2 };

        queue.enqueue(objectA, 1);
        queue.enqueue(objectB, 10);

        expect(queue.dequeue()?.value).toBe(objectB);
        expect(queue.dequeue()?.value).toBe(objectA);
      },
    },
    {
      title: "maintains heap property after multiple enqueues",
      run: () => {
        const queue = new PriorityQueue<number>();

        for (let i = 0; i < 40; i++) {
          queue.enqueue(i, i);
        }

        const heap = (
          queue as unknown as { _heap: Array<{ priority: number }> }
        )._heap;

        for (let index = 1; index < heap.length; index++) {
          const parentIndex = Math.floor((index - 1) / 2);
          expect(heap[parentIndex].priority).toBeGreaterThanOrEqual(
            heap[index].priority,
          );
        }
      },
    },
    {
      title: "dequeue on single element empties the queue",
      run: () => {
        const queue = new PriorityQueue<number>();

        queue.enqueue(10, 10);

        expect(queue.dequeue()?.value).toBe(10);
        expect(queue.getSize()).toBe(0);
        expect(queue.peek()).toBeUndefined();
      },
    },
    {
      title: "interleaved enqueue and dequeue keeps max-priority semantics",
      run: () => {
        const queue = new PriorityQueue<number>();

        queue.enqueue(1, 1);
        queue.enqueue(2, 3);
        expect(queue.dequeue()?.priority).toBe(3);

        queue.enqueue(3, 2);
        queue.enqueue(4, 5);
        expect(queue.dequeue()?.priority).toBe(5);
        expect(queue.dequeue()?.priority).toBe(2);
        expect(queue.dequeue()?.priority).toBe(1);
      },
    },
    {
      title: "works when priorities are decimal numbers",
      run: () => {
        const queue = new PriorityQueue<string>();

        queue.enqueue("a", 1.5);
        queue.enqueue("b", 1.2);
        queue.enqueue("c", 2.1);

        expect(queue.dequeue()?.value).toBe("c");
        expect(queue.dequeue()?.value).toBe("a");
        expect(queue.dequeue()?.value).toBe("b");
      },
    },
    {
      title: "supports Number.MAX_SAFE_INTEGER priority",
      run: () => {
        const queue = new PriorityQueue<string>();

        queue.enqueue("normal", 10);
        queue.enqueue("max", Number.MAX_SAFE_INTEGER);

        expect(queue.dequeue()?.value).toBe("max");
      },
    },
    {
      title: "supports Number.MIN_SAFE_INTEGER priority",
      run: () => {
        const queue = new PriorityQueue<string>();

        queue.enqueue("min", Number.MIN_SAFE_INTEGER);
        queue.enqueue("normal", 0);

        expect(queue.dequeue()?.value).toBe("normal");
        expect(queue.dequeue()?.value).toBe("min");
      },
    },
    {
      title: "multiple peeks remain consistent across operations",
      run: () => {
        const queue = new PriorityQueue<number>();

        queue.enqueue(1, 1);
        queue.enqueue(2, 2);

        expect(queue.peek()?.value).toBe(2);
        expect(queue.peek()?.value).toBe(2);

        queue.dequeue();

        expect(queue.peek()?.value).toBe(1);
      },
    },
    {
      title: "dequeue sequence ends with undefined when exhausted",
      run: () => {
        const queue = new PriorityQueue<number>();

        queue.enqueue(1, 1);
        queue.enqueue(2, 2);

        queue.dequeue();
        queue.dequeue();

        expect(queue.dequeue()).toBeUndefined();
      },
    },
    {
      title: "tracks size correctly through mixed operations",
      run: () => {
        const queue = new PriorityQueue<number>();

        queue.enqueue(1, 1);
        queue.enqueue(2, 2);
        queue.enqueue(3, 3);
        expect(queue.getSize()).toBe(3);

        queue.dequeue();
        expect(queue.getSize()).toBe(2);

        queue.enqueue(4, 4);
        expect(queue.getSize()).toBe(3);
      },
    },
  ];

  for (let datasetIndex = 0; datasetIndex < 40; datasetIndex++) {
    cases.push({
      title: `random dataset keeps global priority order #${datasetIndex + 1}`,
      run: () => {
        const queue = new PriorityQueue<number>();
        const random = createDeterministicRandom(1000 + datasetIndex);
        const priorities: number[] = [];

        const size = 20 + (datasetIndex % 15);

        for (let i = 0; i < size; i++) {
          const priority = Math.floor(random() * 200) - 100;
          priorities.push(priority);
          queue.enqueue(i, priority);
        }

        const dequeuedPriorities: number[] = [];
        while (queue.getSize() > 0) {
          const node = queue.dequeue();
          dequeuedPriorities.push(node?.priority ?? -Infinity);
        }

        const expected = [...priorities].sort((a, b) => b - a);
        expect(dequeuedPriorities).toEqual(expected);
      },
    });
  }

  for (let sequenceIndex = 0; sequenceIndex < 25; sequenceIndex++) {
    cases.push({
      title: `interleaved operations preserve max at root #${sequenceIndex + 1}`,
      run: () => {
        const queue = new PriorityQueue<number>();
        const random = createDeterministicRandom(3000 + sequenceIndex);
        const referencePriorities: number[] = [];

        for (let step = 0; step < 60; step++) {
          const shouldEnqueue =
            referencePriorities.length === 0 || random() > 0.35;

          if (shouldEnqueue) {
            const priority = Math.floor(random() * 150) - 75;
            queue.enqueue(step, priority);
            referencePriorities.push(priority);
          } else {
            const expectedMax = Math.max(...referencePriorities);
            const dequeued = queue.dequeue();

            expect(dequeued?.priority).toBe(expectedMax);
            removeFirstOccurrence(referencePriorities, expectedMax);
          }

          if (referencePriorities.length === 0) {
            expect(queue.peek()).toBeUndefined();
          } else {
            const expectedMax = Math.max(...referencePriorities);
            expect(queue.peek()?.priority).toBe(expectedMax);
          }

          expect(queue.getSize()).toBe(referencePriorities.length);
        }

        while (referencePriorities.length > 0) {
          const expectedMax = Math.max(...referencePriorities);
          expect(queue.dequeue()?.priority).toBe(expectedMax);
          removeFirstOccurrence(referencePriorities, expectedMax);
        }

        expect(queue.getSize()).toBe(0);
      },
    });
  }

  for (let heapIndex = 0; heapIndex < 8; heapIndex++) {
    cases.push({
      title: `heap invariant survives enqueue/dequeue cycles #${heapIndex + 1}`,
      run: () => {
        const queue = new PriorityQueue<number>();
        const random = createDeterministicRandom(5000 + heapIndex);

        for (let step = 0; step < 120; step++) {
          queue.enqueue(step, Math.floor(random() * 1000) - 500);
        }

        for (let step = 0; step < 40; step++) {
          queue.dequeue();
        }

        for (let step = 0; step < 40; step++) {
          queue.enqueue(step + 1000, Math.floor(random() * 1000) - 500);
        }

        const heap = (
          queue as unknown as { _heap: Array<{ priority: number }> }
        )._heap;

        for (let index = 1; index < heap.length; index++) {
          const parentIndex = Math.floor((index - 1) / 2);
          expect(heap[parentIndex].priority).toBeGreaterThanOrEqual(
            heap[index].priority,
          );
        }
      },
    });
  }

  expect(cases).toHaveLength(98);

  test.each(cases)("$title", ({ run }) => {
    run();
  });

  test("performance: handles 30k enqueues + 30k dequeues within a practical limit", () => {
    const elapsedMs = runWorkload(30000);

    expect(elapsedMs).toBeLessThan(8000);
  }, 20000);

  test("performance: scaled workload grows in sub-quadratic time", () => {
    const small = runWorkload(3000);
    const large = runWorkload(12000);
    const ratio = large / Math.max(small, 1);

    // For Binary Heap, growth should be far below O(n^2); allow a wide margin for CI noise.
    expect(ratio).toBeLessThan(12);
    expect(large).toBeLessThan(8000);
  }, 20000);
});
