import { GameEvent } from '../GameEvent';
import { MapSegment } from "./MapSegment";
import { getComponent } from '../Helpers/GetComponent';

@component
export class MapPoolManager extends BaseScriptComponent {
    @input segmentPrefab: ObjectPrefab;
    @input player: SceneObject;
    @input poolSize: number = 10;
    @input despawnDistance: number = -20;

    private pool: MapSegment[] = [];
    private playerTransform: Transform;
    private nextSpawnIndex: number = 0;

    onAwake(): void {
        this.playerTransform = this.player.getTransform();
        this.initializePool();
        this.createEvent("UpdateEvent").bind(() => this.onUpdate());
        GameEvent.Restart.add(() => this.onRestart());
    }

    onUpdate(): void {
        this.updateSegments();
    }

    onRestart(): void {
        this.nextSpawnIndex = 0;
        for (const seg of this.pool)
            seg.init(this.nextSpawnIndex++);
    }

    private initializePool(): void {
        for (let i = 0; i < this.poolSize; i++) {
            const segmentObj = this.segmentPrefab.instantiate(this.getSceneObject());
            const segment = getComponent<MapSegment>(segmentObj);

            segment.init(this.nextSpawnIndex++);
            this.pool.push(segment);
        }
    }

    private updateSegments(): void {
        const playerZ = this.playerTransform.getWorldPosition().z;

        const nextDestroyIndex = this.nextSpawnIndex % this.poolSize;
        const nextSegment = this.pool[nextDestroyIndex];
        const segmentZ = nextSegment.getTransform().getWorldPosition().z;

        if (segmentZ > playerZ - this.despawnDistance)
            nextSegment.init(this.nextSpawnIndex++);
    }
}