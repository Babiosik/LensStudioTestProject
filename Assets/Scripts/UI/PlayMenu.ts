import { GameEvent } from '../GameEvent';
import { ScreenButton } from './ScreenButton';
import { getComponent } from '../Helpers/GetComponent';

@component
export class PlayMenu extends BaseScriptComponent {
    @input
    playButtonObject: SceneObject;
    private playButton: ScreenButton;

    onAwake() {
        this.playButton = getComponent<ScreenButton>(this.playButtonObject);

        this.createEvent("OnStartEvent").bind(() => this.onStart());
        GameEvent.Restart.add(() => this.show());
    }

    onStart(): void {
        this.playButton?.triggerEvent?.add(() => this.onPlayClick());
    }

    onPlayClick(): void {
        this.hide();
        GameEvent.Start.emit();
    }

    public hide(): void {
        this.getSceneObject().enabled = false;
    }

    public show(): void {
        this.getSceneObject().enabled = true;
    }
}
