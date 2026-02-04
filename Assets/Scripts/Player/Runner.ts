import { GameEvent } from '../GameEvent';
import { ScreenButton } from '../UI/ScreenButton';
import { delay } from '../Helpers/Timer';
import { getComponent } from '../Helpers/GetComponent';

export enum RunnerState { Idle = "Idle", Run = "Run", Jump = "Jump", Roll = "Roll" }
const IdleClip = "Idle";
const StartClip = "StartRun";
const RunClip = "Run";
const JumpClip = "Jump";
const RollClip = "Roll";
const DieClip = "Die";
const DieIdleClip = "DieIdle";

@component
export class Runner extends BaseScriptComponent {

    @input
    animator: AnimationPlayer;

    @input
    leftBtn: SceneObject;
    @input
    rightBtn: SceneObject;
    @input
    jumpBtn: SceneObject;
    @input
    rollBtn: SceneObject;

    @input
    speed: number = 1;
    @input
    speedGrow: number = 0.05;
    @input
    xLineOffset: number = 1;
    @input
    hp: number = 3;
    @input
    dieTimeout: number = 0;

    private leftButton: ScreenButton;
    private rightButton: ScreenButton;
    private jumpButton: ScreenButton;
    private rollButton: ScreenButton;

    private transform: Transform;
    private state: RunnerState;
    private timeElapsed: number = 0;
    private linePosition: number = 0;
    private currentHp: number;

    private initialPos: vec3;
    private initialRot: quat;
    private initialHp: number;

    onAwake(): void {
        this.state = RunnerState.Idle;
        this.transform = this.getTransform();
        this.initialPos = this.transform.getWorldPosition();
        this.initialRot = this.transform.getWorldRotation();
        this.initialHp = this.hp;
        this.onRestart();

        this.leftButton = getComponent<ScreenButton>(this.leftBtn);
        this.rightButton = getComponent<ScreenButton>(this.rightBtn);
        this.jumpButton = getComponent<ScreenButton>(this.jumpBtn);
        this.rollButton = getComponent<ScreenButton>(this.rollBtn);

        this.createEvent("OnStartEvent").bind(() => this.onStart());
        this.createEvent("OnDestroyEvent").bind(() => this.onDestroy());
        this.createEvent("UpdateEvent").bind((e) => this.onUpdate(e));

        GameEvent.Start.add(() => this.onPlayButton());
        GameEvent.Restart.add(() => this.onRestart());
    }

    onStart(): void {
        this.leftButton.triggerEvent.add(() => this.onLeftClick());
        this.rightButton.triggerEvent.add(() => this.onRightClick());
        this.jumpButton.triggerEvent.add(() => this.onJumpClick());
        this.rollButton.triggerEvent.add(() => this.onRollClick());
    }

    onDestroy(): void {
        GameEvent.Start.remove(() => this.onPlayButton());
        GameEvent.Restart.remove(() => this.onRestart());

        this.leftButton.triggerEvent.remove(() => this.onLeftClick());
        this.rightButton.triggerEvent.remove(() => this.onRightClick());
        this.jumpButton.triggerEvent.remove(() => this.onJumpClick());
        this.rollButton.triggerEvent.remove(() => this.onRollClick());
    }

    onPlayButton(): void {
        const clip = this.animator.getClip(StartClip);
        this.animator.playClip(StartClip);

        delay(this, clip.duration).then(() => {
            this.transform.setLocalRotation(quat.fromEulerAngles(0, Math.PI, 0));
            this.animator.playClip(RunClip);
            this.state = RunnerState.Run;
        });
    }

    onRestart(): void {
        this.currentHp = this.initialHp;
        this.timeElapsed = 0;
        this.linePosition = 0;
        this.transform.setWorldPosition(this.initialPos);
        this.transform.setWorldRotation(this.initialRot);

        this.animator.stopAll();
        this.state = RunnerState.Idle;
        this.animator.playClip(IdleClip);

        GameEvent.OnHpChange.emit(this.currentHp);
    }

    onUpdate(event: UpdateEvent): void {
        if (this.state == RunnerState.Idle) return;

        const deltaTime = event.getDeltaTime();
        this.timeElapsed += deltaTime;

        const pos = this.transform.getWorldPosition();
        pos.x = this.linePosition * this.xLineOffset;
        pos.z -= this.speed + this.timeElapsed * this.speedGrow;
        this.transform.setWorldPosition(pos);
    }

    onLeftClick(): void {
        if (this.linePosition < 0) return;

        this.linePosition--;
    }

    onRightClick(): void {
        if (this.linePosition > 0) return;

        this.linePosition++;
    }

    onJumpClick(): void {
        if (this.state != RunnerState.Run)
            return;

        const clip = this.animator.getClip(JumpClip);
        this.animator.playClip(JumpClip);
        this.state = RunnerState.Jump;

        delay(this, clip.duration).then(() => {
            if (this.state != RunnerState.Jump)
                return;

            this.animator.playClip(RunClip);
            this.state = RunnerState.Run;
        });
    }

    onRollClick(): void {
        if (this.state != RunnerState.Run)
            return;

        const clip = this.animator.getClip(RollClip);
        this.animator.playClip(RollClip);
        this.state = RunnerState.Roll;

        delay(this, clip.duration).then(() => {
            if (this.state != RunnerState.Roll)
                return;

            this.animator.playClip(RunClip);
            this.state = RunnerState.Run;
        });
    }

    hitObstacle() {
        GameEvent.OnHpChange.emit(--this.currentHp);
        if (this.currentHp > 0)
            return;

        this.animator.stopAll();
        this.state = RunnerState.Idle;
        const dieClip = this.animator.getClip(DieClip);
        this.animator.playClip(dieClip.name);
        delay(this, dieClip.duration - 0.1).then(() => {
            this.animator.pauseClip(dieClip.name);
            // this.animator.playClip(DieIdleClip);
            delay(this, this.dieTimeout, () => GameEvent.Restart.emit());
        });
    }

    getState(): RunnerState {
        return this.state;
    }
}

