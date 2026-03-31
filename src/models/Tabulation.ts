export function fibonacci(n: number): number {
  if (n === 0) return 0;

  let current = 1;
  let next = 1;

  for (let i: number = 2; i < n; i++) {
    const aux = next;
    next += current;
    current = aux;
  }

  return next;
}
