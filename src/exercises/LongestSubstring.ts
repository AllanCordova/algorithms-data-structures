export default class LongestSubstring {
  public solve(s: string): number {
    const map = new Map<string, number>();
    let max = 0;
    let start = 0;

    for (let end = 0; end < s.length; end++) {
      const char = s[end];

      if (map.has(char) && map.get(char)! >= start) {
        start = map.get(char)! + 1;
      }

      map.set(char, end);

      max = Math.max(max, end - start + 1);
    }

    return max;
  }
}

const lswrc = new LongestSubstring();

console.log(lswrc.solve("dvdf"));
