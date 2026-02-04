import { Runner } from '../Player/Runner';
import { getComponent } from '../Helpers/GetComponent';

@component
export class RunnerTrigger extends BaseScriptComponent {
    @input
    collider: ColliderComponent;
    @input
    triggerType: string = "Jump";

    private used: boolean = true;

    onAwake(): void {
        this.collider.onOverlapEnter.add((arg) => this.onOverlapEnter(arg));
    }

    onOverlapEnter(arg: OverlapEnterEventArgs): void {
        const sceneObject = arg.overlap.collider.getSceneObject();
        const runner = getComponent<Runner>(sceneObject);

        if (this.used || !runner)
            return;

        this.used = true;
        this.onTrigger(runner, this.triggerType);
    }

    reset(): void {
        this.used = false;
    }

    onTrigger(runner: Runner, triggerType: string): void { }
}
