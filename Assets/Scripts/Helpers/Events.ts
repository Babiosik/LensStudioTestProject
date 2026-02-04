type EventCallback<T> = (data: T) => void;

export class EventEmitter<T> {
    private listeners: EventCallback<T>[] = [];

    add(listener: EventCallback<T>): void {
        this.listeners.push(listener);
    }

    remove(listener: EventCallback<T>): void {
        const index = this.listeners.indexOf(listener);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }

    emit(data: T): void {
        for (const listener of this.listeners) {
            listener?.(data);
        }
    }

    clear(): void {
        this.listeners = [];
    }
}