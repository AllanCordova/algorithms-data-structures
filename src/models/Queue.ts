class DoublyNode<T> {
  public value: T;
  public next: DoublyNode<T> | null = null;
  public prev: DoublyNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

export default class Queue<T> {
  private _head: DoublyNode<T> | null = null;
  private _tail: DoublyNode<T> | null = null;

  private _size: number = 0;

  public queue(value: T): void {
    const newNode = new DoublyNode(value);

    if (!this._head) {
      this._head = newNode;
      this._tail = newNode;
    } else if (this._tail) {
      this._tail.next = newNode;
      newNode.prev = this._tail;
      this._tail = newNode;
    }

    this._size++;
  }

  public dequeue(): T | undefined {
    if (!this._head) {
      return undefined;
    }

    const dequeuedValue = this._head.value;

    this._head = this._head.next;

    if (this._head) {
      this._head.prev = null;
    } else {
      this._tail = null;
    }

    this._size--;
    return dequeuedValue;
  }

  public isEmpty(): boolean {
    return this._head === null;
  }

  public peek(): T | undefined {
    if (this.isEmpty()) return undefined;

    return this._head!.value;
  }

  public getSize(): number {
    return this._size;
  }
}
