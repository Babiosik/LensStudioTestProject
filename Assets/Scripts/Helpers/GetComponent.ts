export function getComponent<T extends BaseScriptComponent>(obj: SceneObject): T | null {
    return obj.getComponent("ScriptComponent") as T;
}