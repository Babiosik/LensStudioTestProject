import { GameEvent } from '../GameEvent';
import { ScreenButton } from './ScreenButton';
import { getComponent } from '../Helpers/GetComponent';

@component
export class NewScript extends BaseScriptComponent {
    @input
    restartButtonObject: SceneObject;
    private restartButton: ScreenButton;

    onAwake() {
        this.restartButton = getComponent<ScreenButton>(this.restartButtonObject);

        this.createEvent("OnStartEvent").bind(() => this.onStart());

        GameEvent.Start.add(() => this.show());
        GameEvent.Restart.add(() => this.hide());
        GameEvent.OnHpChange.add((hp) => this.onChangeHp(hp));
    }

    onStart(): void {
        this.hide();
        this.restartButton?.triggerEvent?.add(() => this.onRestartClick());
    }

    onRestartClick(): void {
        this.hide();
        GameEvent.Restart.emit();
    }

    onChangeHp(hp: number): void {
        if (hp <= 0)
            this.hide();
    }

    public hide(): void {
        this.getSceneObject().enabled = false;
    }

    public show(): void {
        this.getSceneObject().enabled = true;
    }
}
