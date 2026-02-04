import { RunnerTrigger } from './RunnerTrigger';
import { getComponent } from '../Helpers/GetComponent';

@component
export class MapSegment extends BaseScriptComponent {
    @input
    obstacles: SceneObject[]

    segmentIndex: number = 0;
    segmentLength: number = 12.0;

    private triggers: Map<string, RunnerTrigger>;

    onAwake(): void {
        this.triggers = new Map();
        for (const obst of this.obstacles) {
            obst.enabled = false;
            const trigger = getComponent<RunnerTrigger>(obst);
            if (trigger)
                this.triggers.set(obst.uniqueIdentifier, trigger);
        }
    }

    init(index: number): void {
        this.segmentIndex = index;
        this.getTransform().setLocalPosition(new vec3(0, 0, -this.segmentLength * this.segmentIndex));

        // this.obstacles = this.getSceneObject().children;
        let activeObstacles = 0;

        for (const obst of this.obstacles) {
            const isStartSegment = this.segmentIndex < 3;
            const hasLimitObstacles = activeObstacles < 4;
            const isRandomChoice = Math.random() < .2;

            obst.enabled = !isStartSegment && hasLimitObstacles && isRandomChoice;

            if (!obst.enabled)
                continue;
            
            // print(this.triggers.get(obst.uniqueIdentifier));
            this.triggers.get(obst.uniqueIdentifier).reset();

            activeObstacles++;
        }
    }
}