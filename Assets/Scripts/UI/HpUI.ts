import { GameEvent } from '../GameEvent';

@component
export class HpUI extends BaseScriptComponent {
    @input
    hpObjects: SceneObject[];

    onAwake() {
        GameEvent.OnHpChange.add((hp) => this.updateHp(hp));
    }

    updateHp(hp: number): void {
        for (let i = 0; i < this.hpObjects.length; i++)
            this.hpObjects[i].enabled = i < hp;
    }
}
