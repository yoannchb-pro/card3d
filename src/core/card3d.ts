import { findCardIndex } from "utils";
import Config from "../types/config";
import EventListener from "../types/eventListener";

const Card3dElements: { element: HTMLElement; instance: Card3d }[] = [];

const defaultConfig = {
  delta: 10,
  perspective: 500,
  startX: 0,
  startY: 0,
  glareOpacity: 0.5,
  axis: "all",
  scale: 1,
} as const satisfies Config;

class Card3d {
  private glareElement: HTMLElement;
  private focusElement: HTMLElement;

  private gyroOrigin: { x: number; y: number } = null;

  private eventMouseMoove: EventListener<MouseEvent>;
  private eventMouseOut: EventListener<MouseEvent>;
  private eventDeviceOrientation: EventListener<DeviceOrientationEvent>;

  constructor(private card3dElement: HTMLElement, public config: Config = {}) {
    Card3dElements.push({ element: card3dElement, instance: this });

    this.config = Object.assign({}, defaultConfig, this.config);

    if (!this.config.stop) this.start();
    else this.stop();
  }

  /**
   * Update config
   * @param config
   */
  updateConfig(config: Config = {}) {
    this.config = Object.assign({}, defaultConfig, config);

    if (this.config.stop) {
      this.stop();
    } else {
      this.stop();
      this.start();
    }
  }

  /**
   * Remove all event listener of the card
   */
  private removeEventListener() {
    this.focusElement.removeEventListener("mousemove", this.eventMouseMoove);
    this.focusElement.removeEventListener("mouseout", this.eventMouseOut);
    if (this.config.gyroscopie)
      window.removeEventListener(
        "deviceorientation",
        this.eventDeviceOrientation
      );
  }

  /**
   * Set all necessary event listener
   */
  private setupEventListener() {
    this.eventMouseMoove = (event: MouseEvent) => this.mousemove(event);
    this.eventMouseOut = () => this.mouseout();

    this.focusElement.addEventListener("mousemove", this.eventMouseMoove);
    if (!this.config.noReset) {
      this.focusElement.addEventListener("mouseout", this.eventMouseOut);
    }

    if (this.config.gyroscopie) {
      this.eventDeviceOrientation = (event: DeviceOrientationEvent) =>
        this.gyro(event);
      window.addEventListener("deviceorientation", this.eventDeviceOrientation);
    }
  }

  /**
   * Handle device orientation event
   * @param event
   * @returns
   */
  private gyro(event: DeviceOrientationEvent) {
    const rotateZ = event.beta,
      rotateX = event.gamma;

    if (typeof rotateX !== "number" || typeof rotateZ !== "number") return;

    this.mousemove({
      clientY: rotateZ / 45,
      clientX: rotateX / 45,
      gyroscopie: true,
    });
  }

  /**
   * Remove the card from the list, set attribute stop and reset it
   */
  stop() {
    const cardIndex = findCardIndex(this.card3dElement);
    Card3dElements.splice(cardIndex, 1);
    this.card3dElement.setAttribute("data-card3d-stop", "true");
    this.reset();
  }

  /**
   * Reset the card style and remove event listener
   */
  reset() {
    this.card3dElement.style.transform = "";
    this.card3dElement.style.transition = "";

    if (this.glareElement) this.glareElement.remove();

    this.removeEventListener();
  }

  /**
   * Apply the glare
   */
  applyGlare() {
    this.glareElement = document.createElement("span");
    this.glareElement.setAttribute(
      "style",
      `
        will-change: transform;
        position: absolute;
        background-image: linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%);
        pointer-event: none; 
        transform-origin: 0% 0%;
        transform: translate(-50%, -50%) rotate(180deg);
        opacity: 0;
        z-index: 999;
        `
    );
    this.card3dElement.appendChild(this.glareElement);
  }

  /**
   * Init the card by setting event and creating glare effect
   */
  start() {
    this.focusElement = this.config.fullPageListening
      ? document.body
      : this.card3dElement;

    this.setupEventListener();
    if (this.config.glare) this.applyGlare();

    this.card3dElement.style.overflow = "hidden";
    this.card3dElement.style.willChange = "transform";
    this.card3dElement.style.transform = `
        perspective(500px) 
        rotateX(${this.config.startY}deg) 
        rotateY(${this.config.startX}deg)
        `;
  }

  /**
   * Event that handle all mouse event
   * @param event
   * @returns
   */
  private mousemove(
    event:
      | MouseEvent
      | { clientX: number; clientY: number; gyroscopie: boolean }
  ) {
    if (!this.card3dElement.isConnected || !this.focusElement.isConnected) {
      this.stop();
      return;
    }

    this.card3dElement.style.transition = "";

    const config = this.config;
    const reverse = config.reverse ? 1 : -1;

    const rect = this.card3dElement.getBoundingClientRect();

    const middleWidth = rect.width / 2;
    const middleHeight = rect.height / 2;
    const middleX = rect.left + middleWidth;
    const middleY = rect.top + middleHeight;

    const x = (middleX - event.clientX) * -1;
    const y = middleY - event.clientY;

    const width =
      this.focusElement !== this.card3dElement
        ? window.innerWidth / 2
        : rect.width / 2;
    const height =
      this.focusElement !== this.card3dElement
        ? window.innerHeight / 2
        : rect.height / 2;

    let finalX: number = 0,
      finalY: number = 0;

    if ("gyroscopie" in event) {
      if (!this.gyroOrigin) {
        this.gyroOrigin = {
          x: event.clientX,
          y: event.clientY,
        };
      }

      finalX = (this.gyroOrigin.x - event.clientX) * config.delta;
      finalY = (this.gyroOrigin.y - event.clientY) * config.delta;
    } else {
      if (config.axis !== "y") {
        finalX = (x / width) * config.delta;
      }

      if (config.axis !== "x") {
        finalY = (y / height) * config.delta;
      }
    }

    //we update the glare
    if (config.glare) {
      const angle =
        Math.atan2(event.clientX - middleX, -(event.clientY - middleY)) *
        (180 / Math.PI);
      const glareSize =
        (rect.width > rect.height ? rect.width : rect.height) * 2;
      this.glareElement.style.opacity = config.glareOpacity.toString();
      this.glareElement.style.left = "50%";
      this.glareElement.style.top = "50%";
      this.glareElement.style.width = glareSize + "px";
      this.glareElement.style.height = glareSize + "px";
      this.glareElement.style.transform = `rotate(${angle}deg) translate(-50%, -50%)`;
      this.glareElement.style.display = "block";
    }

    //we apply the transformation to the card
    this.card3dElement.style.transform = `
        perspective(${config.perspective}px) 
        rotateX(${finalY * reverse}deg) 
        rotateY(${finalX * reverse}deg)
        scale(${config.scale})
        `;
  }

  /**
   * Event that handle when mouse out of the card
   * @param event
   */
  private mouseout() {
    this.card3dElement.style.transition = "0.5s ease";
    this.card3dElement.style.transform = "";
    if (this.glareElement) this.glareElement.style.opacity = "0";
  }
}

export { Card3d, Card3dElements, defaultConfig };
