class QueueNode<T> {
    public prev: QueueNode<T> | null = null;
    public next: QueueNode<T> | null = null;

    constructor(public data: T) {}
}

export class Queue<T> {
    private head: QueueNode<T> | null = null;
    private tail: QueueNode<T> | null = null;

    constructor() {}

    enqueue(data: T) {
        const newNode = new QueueNode(data);

        if (this.tail === null) {
            this.head = this.tail = newNode;
        } else {
            this.tail.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
        }
    }

    dequeue(): T | null {
        if (this.head === null) {
            return null;
        }

        const currentNode = this.head;
        this.head = this.head.next;

        if (this.head) {
            this.head.prev = null;
        } else {
            this.tail = null;
        }

        const data = currentNode.data;
        currentNode.next = currentNode.prev = null;
        return data;
    }

    isEmpty(): boolean {
        return this.head === null;
    }
}
