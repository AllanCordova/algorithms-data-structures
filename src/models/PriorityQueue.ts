class PriorityNode<T> {
  constructor(
    public value: T,
    public priority: number,
  ) {}
}

export default class PriorityQueue<T> {
  private _heap: PriorityNode<T>[] = [];

  private getParentIndex(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  private getLeftChildIndex(index: number): number {
    return 2 * index + 1;
  }

  private getRightChildIndex(index: number): number {
    return 2 * index + 2;
  }

  public getSize(): number {
    return this._heap.length;
  }

  public peek(): PriorityNode<T> | undefined {
    if (this.getSize() === 0) return undefined;
    return this._heap[0];
  }

  public enqueue(value: T, priority: number): void {
    const newNode = new PriorityNode(value, priority);

    this._heap.push(newNode);

    this.bubbleUp();
  }

  private bubbleUp(): void {
    let currentIndex = this.getSize() - 1;

    while (currentIndex > 0) {
      let parentIndex = this.getParentIndex(currentIndex);

      const currentNode = this._heap[currentIndex];
      const parentNode = this._heap[parentIndex];

      if (currentNode.priority <= parentNode.priority) {
        break;
      }

      this._heap[currentIndex] = parentNode;
      this._heap[parentIndex] = currentNode;

      currentIndex = parentIndex;
    }
  }

  public dequeue(): PriorityNode<T> | undefined {
    if (this.getSize() === 0) return undefined;

    const maxNode = this._heap[0];

    const lastNode = this._heap.pop();

    if (this.getSize() > 0 && lastNode) {
      this._heap[0] = lastNode;
      this.sinkDown();
    }

    return maxNode;
  }

  private sinkDown(): void {
    let currentIndex = 0;
    const length = this.getSize();
    const currentElement = this._heap[0];

    while (true) {
      let leftChildIndex = this.getLeftChildIndex(currentIndex);
      let rightChildIndex = this.getRightChildIndex(currentIndex);

      let leftChild: PriorityNode<T> | undefined;
      let rightChild: PriorityNode<T> | undefined;
      let swapIndex: number | null = null;

      if (leftChildIndex < length) {
        leftChild = this._heap[leftChildIndex];
        if (leftChild.priority > currentElement.priority) {
          swapIndex = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        rightChild = this._heap[rightChildIndex];

        if (
          (swapIndex === null &&
            rightChild.priority > currentElement.priority) ||
          (swapIndex !== null &&
            leftChild &&
            rightChild.priority > leftChild.priority)
        ) {
          swapIndex = rightChildIndex;
        }
      }

      if (swapIndex === null) break;

      this._heap[currentIndex] = this._heap[swapIndex];
      this._heap[swapIndex] = currentElement;

      currentIndex = swapIndex;
    }
  }
}
