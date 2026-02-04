import { EventEmitter } from './Helpers/Events'

export class GameEvent {
    static Start: EventEmitter<void> = new EventEmitter();
    static Restart: EventEmitter<void> = new EventEmitter();

    static OnHpChange: EventEmitter<number> = new EventEmitter();
    static RewardGet: EventEmitter<void> = new EventEmitter();
}