export function fibonacci(n: number, cache: Map<number, number>): number {
  if (cache.has(n)) {
    return cache.get(n)!;
  }

  if (n == 0) return 0;
  if (n == 1) return 1;

  const response = fibonacci(n - 1, cache) + fibonacci(n - 2, cache);
  cache.set(n, response);

  return response;
}

// export function fibonacci(n: number): number {
//   if (n == 0) return 0;
//   if (n == 1) return 1;

//   return fibonacci(n - 1) + fibonacci(n - 2);
// }
