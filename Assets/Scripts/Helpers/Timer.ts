export function delay(script: BaseScriptComponent, seconds: number, callback: Function = null): Promise<void> {
    return new Promise(resolve => {
        let elapsed = 0;
        const updateEvent = script.createEvent("UpdateEvent");
        
        updateEvent.bind((event) => {
            elapsed += event.getDeltaTime();
            if (elapsed >= seconds) {
                updateEvent.enabled = false;
                resolve();
                callback?.call(this);
            }
        });
    });
}