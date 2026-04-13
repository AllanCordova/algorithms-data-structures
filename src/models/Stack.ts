class DoublyNode<T> {
  public value: T;
  public next: DoublyNode<T> | null = null;
  public prev: DoublyNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

export default class Stack<T> {
  private _head: DoublyNode<T> | null = null;
  private _tail: DoublyNode<T> | null = null;

  public push(value: T): void {
    const newNode = new DoublyNode(value);

    if (!this._head) {
      this._head = newNode;
      this._tail = newNode;
    } else if (this._tail) {
      this._tail.next = newNode;
      newNode.prev = this._tail;
      this._tail = newNode;
    }
  }

  public pop(): T | undefined {
    if (!this._tail) {
      return undefined;
    }

    const popValue = this._tail.value;

    this._tail = this._tail.prev;

    if (this._tail) {
      this._tail.next = null;
    } else {
      this._head = null;
    }

    return popValue;
  }

  public peek(): T | undefined {
    if (!this._tail) return undefined;

    return this._tail.value;
  }
}
