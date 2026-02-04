import { RunnerTrigger } from './RunnerTrigger';
// import { Runner } from '../Player/Runner';
import { GameEvent } from '../GameEvent';

@component
export class Reward extends RunnerTrigger {
    onTrigger(runner, triggerType: string): void {
        this.getSceneObject().enabled = false;
        GameEvent.RewardGet.emit();
    }
}
