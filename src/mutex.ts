import { Queue } from "./queue";

type VoidFunction = () => void | Promise<void>;

export class Mutex {
    private isLocked: boolean;
    private queue: Queue<VoidFunction>;
    
    public constructor(){
        this.queue = new Queue<VoidFunction>();
        this.isLocked = false;
    }

    async acquire() {
        const lockPromise = new Promise<VoidFunction>((resolve, _) => {
            const tryToAcquireLock = async() => {
                if(!this.isLocked) {
                    this.isLocked = true;
                    resolve(() => this.unlock());
                } else {
                    this.queue.enqueue(tryToAcquireLock);
                }
            }
            tryToAcquireLock();
        });
        return lockPromise;
    }

    async unlock() {
        this.isLocked = false;
        if(!this.queue.isEmpty()) {
            const next = this.queue.dequeue() as Function;
            await next();
        }
    }
}