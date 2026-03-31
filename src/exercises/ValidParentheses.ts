export default class ValidParentheses {
  public solve(exp: string): boolean {
    const stack: string[] = [];

    const matches = new Map<string, string>([
      [")", "("],
      ["}", "{"],
      ["]", "["],
    ]);

    for (const char of exp) {
      if (matches.has(char)) {
        const top = stack.pop();

        if (top !== matches.get(char)) {
          return false;
        }
      } else {
        stack.push(char);
      }
    }

    return stack.length === 0;
  }
}
