type Config = {
    glare?: boolean;
    glareOpacity?: number;
    perspective?: number;
    delta?: number;
    reverse?: boolean;
    noReset?: boolean;
    fullPageListening?: boolean;
    scale?: number;
    startX?: number;
    startY?: number;
    axis?: "x" | "y" | "all";
    stop?: boolean;
    gyroscopie?: boolean;
};
declare class Card3d {
    private card3dElement;
    config: Config;
    private glareElement;
    private focusElement;
    private gyroOrigin;
    private eventMouseMoove;
    private eventMouseOut;
    private eventDeviceOrientation;
    constructor(card3dElement: HTMLElement, config?: Config);
    /**
     * Update config
     * @param config
     */
    updateConfig(config?: Config): void;
    /**
     * Remove all event listener of the card
     */
    private removeEventListener;
    /**
     * Set all necessary event listener
     */
    private setupEventListener;
    /**
     * Handle device orientation event
     * @param event
     * @returns
     */
    private gyro;
    /**
     * Remove the card from the list, set attribute stop and reset it
     */
    stop(): void;
    /**
     * Reset the card style and remove event listener
     */
    reset(): void;
    /**
     * Apply the glare
     */
    applyGlare(): void;
    /**
     * Init the card by setting event and creating glare effect
     */
    start(): void;
    /**
     * Event that handle all mouse event
     * @param event
     * @returns
     */
    private mousemove;
    /**
     * Event that handle when mouse out of the card
     * @param event
     */
    private mouseout;
}
export { Card3d as default };
