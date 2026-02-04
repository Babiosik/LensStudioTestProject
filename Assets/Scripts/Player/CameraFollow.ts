@component
export class CameraFollow extends BaseScriptComponent {
    @input target: SceneObject;
    @input offset: vec3 = new vec3(0, 5, -10);
    @input smoothSpeed: number = 1;

    private cameraTransform: Transform;
    private targetTransform: Transform;

    onAwake(): void {
        this.cameraTransform = this.getTransform();
        this.targetTransform = this.target.getTransform();

        this.createEvent("LateUpdateEvent").bind(() => this.onLateUpdate());
    }

    onLateUpdate(): void {
        const targetPos = this.targetTransform.getWorldPosition();
        const desiredPos = targetPos.add(this.offset);
        const currentPos = this.cameraTransform.getWorldPosition();
        
        const newPos = vec3.lerp(currentPos, desiredPos, this.smoothSpeed * getDeltaTime());
        this.cameraTransform.setWorldPosition(newPos);
    }
}