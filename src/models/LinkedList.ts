class DoublyNode<T> {
  public value: T;
  public next: DoublyNode<T> | null = null;
  public prev: DoublyNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

export default class DoublyLinkedList<T> {
  private head: DoublyNode<T> | null = null;
  private tail: DoublyNode<T> | null = null;

  public push(value: T): void {
    const newNode = new DoublyNode(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else if (this.tail) {
      this.tail.next = newNode;

      newNode.prev = this.tail;

      this.tail = newNode;
    }
  }

  public printForward(): void {
    let current = this.head;
    const values: T[] = [];

    while (current) {
      values.push(current.value);
      current = current.next;
    }

    console.log(values.join(" <-> "));
  }

  public printBackward(): void {
    let current = this.tail;
    const values: T[] = [];

    while (current) {
      values.push(current.value);
      current = current.prev;
    }

    console.log(values.join(" <-> "));
  }
}
