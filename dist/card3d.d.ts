/// <reference types="config.d.ts" />
import Config from "../types/config";
declare class Card3d {
    private card3dElement;
    config?: Config;
    private glareElement;
    private focusElement;
    private eventMouseMoove;
    private eventMouseOut;
    private eventDeviceOrientation;
    constructor(card3dElement: HTMLElement, config?: Config);
    /**
     * Update config when attributes change
     */
    /**
     * Update config when attributes change
     */
    updateConfig(): void;
    /**
     * Set the configuration based on the attributes
     * @returns
     */
    /**
     * Set the configuration based on the attributes
     * @returns
     */
    private setConfigFromAttributes;
    /**
     * Reset the card and stop events
     */
    /**
     * Reset the card and stop events
     */
    stop(): void;
    /**
     * Reset the card
     */
    /**
     * Reset the card
     */
    reset(): void;
    /**
     * Init the card by setting event and creating glare effect
     */
    /**
     * Init the card by setting event and creating glare effect
     */
    start(): void;
    /**
     * Event that handle all mouse event
     * @param event
     * @returns
     */
    /**
     * Event that handle all mouse event
     * @param event
     * @returns
     */
    mousemove(event: MouseEvent | {
        clientX: number;
        clientY: number;
        gyroscopie: boolean;
    }): void;
    /**
     * Event that handle when mouse out of the card
     * @param event
     */
    /**
     * Event that handle when mouse out of the card
     * @param event
     */
    mouseout(event: MouseEvent): void;
}
export { Card3d as default };
