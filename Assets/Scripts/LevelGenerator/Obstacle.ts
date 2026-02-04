import { RunnerTrigger } from './RunnerTrigger';
import { Runner } from '../Player/Runner';

@component
export class Obstacle extends RunnerTrigger {
    @input
    renderer: RenderMeshVisual;
    @input
    hitMaterial: Material;

    private baseMaterial: Material;

    onAwake(): void {
        super.onAwake();
        this.baseMaterial = this.renderer.mainMaterial;
    }

    reset(): void {
        super.reset();
        this.renderer.mainMaterial = this.baseMaterial;
    }

    onTrigger(runner: Runner, avoidType: string): void {
        if (runner.getState().toString() == avoidType)
            return;
        
        this.renderer.mainMaterial = this.hitMaterial;
        runner.hitObstacle();
    }
}
