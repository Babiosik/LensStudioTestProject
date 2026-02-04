import { EventEmitter } from '../Helpers/Events';
@component
export class ScreenButton extends BaseScriptComponent {
    public triggerEvent: EventEmitter<void> = new EventEmitter<void>();

    private transform: ScreenTransform;
    private isPressed: boolean = false;

    onAwake(): void {
        this.transform = this.getSceneObject().getComponent("Component.ScreenTransform");
        this.createEvent("TouchStartEvent").bind(this.onTouchStart.bind(this));
        this.createEvent("TouchEndEvent").bind(this.onTouchEnd.bind(this));
    }

    private onTouchStart(event: TouchStartEvent): void {
        const touchPos = event.getTouchPosition();
        if (this.transform.containsScreenPoint(touchPos)) {
            this.isPressed = true;
            this.animatePress();
        }
    }

    private onTouchEnd(event: TouchEndEvent): void {
        if (this.isPressed) {
            this.isPressed = false;
            this.animateRelease();
            this.triggerEvent.emit();
        }
    }

    // private containsPoint(point: vec2): boolean {
    //     const center = this.transform.containsScreenPoint.getCenter();
    //     const size = this.transform.anchors.getSize();
    //     const min = center.sub(size.uniformScale(0.5));
    //     const max = center.add(size.uniformScale(0.5));
    //     print(`${size}//${min}/${max}/${point}`);
    //     return point.x >= min.x && point.x <= max.x &&
    //         point.y >= min.y && point.y <= max.y;
    // }

    private animatePress(): void {
        this.transform.scale = vec3.one().uniformScale(0.9);
    }

    private animateRelease(): void {
        this.transform.scale = vec3.one();
    }
}