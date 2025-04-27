
type VoidFunction = () => void | Promise<void>;

export class Mutex {
    private queue: VoidFunction[];
    private isLocked: boolean;
    
    public constructor(){
        this.queue = [];
        this.isLocked = false;
    }

    async acquire() {
        const lockPromise = new Promise<VoidFunction>((resolve, _) => {
            const tryToAcquireLock = async() => {
                if(!this.isLocked) {
                    this.isLocked = true;
                    resolve(() => this.unlock());
                } else {
                    this.queue.push(tryToAcquireLock);
                }
            }
            tryToAcquireLock();
        });
        return lockPromise;
    }

    async unlock() {
        this.isLocked = false;
        if(this.queue.length > 0) {
            const next = this.queue.shift() as Function;
            await next();
        }
    }
}