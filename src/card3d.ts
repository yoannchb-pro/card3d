import Config from "../types/config";
import EventListener from "../types/eventListener";

//Register all intance of 3dcard element
const Card3dElements: { element: HTMLElement; instance: Card3d }[] = [];

/**
 * Parse boolean from attribute
 * @param str
 * @returns
 */
function parseBooleanAttribute(str: string): boolean {
  return str !== null && str !== undefined && (str === "" || str === "true");
}

/**
 * Parse float from attribute
 * @param str
 * @returns
 */
function parseFloatAttrbiutes(str: string): number {
  const nb = parseFloat(str);
  return isNaN(nb) || typeof nb !== "number" ? undefined : nb;
}

class Card3d {
  private glareElement: HTMLElement;
  private focusElement: HTMLElement;
  private eventMouseMoove: EventListener;
  private eventMouseOut: EventListener;
  private eventDeviceOrientation: (
    this: HTMLElement,
    ev: DeviceOrientationEvent
  ) => any;

  constructor(private card3dElement: HTMLElement, public config?: Config) {
    //we register the element
    Card3dElements.push({ element: card3dElement, instance: this });

    //we set the config from the attributes
    if (!this.config) this.config = this.setConfigFromAttributes();

    //default config
    this.config = Object.assign(
      {
        delta: 10,
        perspective: 500,
        startX: 0,
        startY: 0,
        glareOpacity: 0.5,
        axis: "all",
        scale: 1,
      },
      this.config
    );

    //start the card listening to events
    if (!this.config.stop) this.start();
    else this.stop();
  }

  /**
   * Update config when attributes change
   */
  updateConfig() {
    this.config = this.setConfigFromAttributes();

    if (this.config.stop) {
      this.stop();
    } else {
      this.reset();
      this.start();
    }
  }

  /**
   * Set the configuration based on the attributes
   * @returns
   */
  private setConfigFromAttributes(): Config {
    const attr = this.card3dElement.dataset;

    const fullPageListening = parseBooleanAttribute(
      attr.card3dFullPageListening
    );
    const noReset = parseBooleanAttribute(attr.card3dNoReset);
    const glare = parseBooleanAttribute(attr.card3dGlare);
    const reverse = parseBooleanAttribute(attr.card3dReverse);
    const stop = parseBooleanAttribute(attr.card3dStop);
    const gyroscopie = parseBooleanAttribute(attr.card3dGyroscopie);

    const delta = parseFloatAttrbiutes(attr.card3dDelta) ?? 10;
    const perspective = parseFloatAttrbiutes(attr.card3dPerspective) ?? 500;
    const startX = parseFloatAttrbiutes(attr.card3dStartX) ?? 0;
    const startY = parseFloatAttrbiutes(attr.card3dStartY) ?? 0;
    const glareOpacity = parseFloatAttrbiutes(attr.card3dGlare) ?? 0.5;
    const scale = parseFloatAttrbiutes(attr.card3dScale) ?? 1;

    let axis: Config["axis"] = "all";
    if (attr.card3dAxis === "x") {
      axis = "x";
    } else if (attr.card3dAxis === "y") {
      axis = "y";
    }

    return {
      gyroscopie,
      stop,
      scale,
      delta,
      axis,
      noReset,
      reverse,
      fullPageListening,
      perspective,
      startX,
      startY,
      glare,
      glareOpacity,
    };
  }

  /**
   * Reset the card and stop events
   */
  stop() {
    Card3dElements.splice(
      Card3dElements.findIndex((e) => e.element === this.card3dElement),
      1
    );
    this.card3dElement.setAttribute("data-card3d-stop", "true");
    this.reset();
  }

  /**
   * Reset the card
   */
  reset() {
    this.card3dElement.style.transform = "";
    this.card3dElement.style.transition = "";
    this.focusElement.removeEventListener("mousemove", this.eventMouseMoove);
    this.focusElement.removeEventListener("mouseout", this.eventMouseOut);
    if (this.config.gyroscopie)
      window.removeEventListener(
        "deviceorientation",
        this.eventDeviceOrientation
      );
    if (this.glareElement) this.glareElement.remove();
  }

  /**
   * Init the card by setting event and creating glare effect
   */
  start() {
    const card3dElement = this.card3dElement;

    //set the focus element for full page listening
    this.focusElement = card3dElement;
    if (this.config.fullPageListening) this.focusElement = document.body;

    if (this.config.glare) {
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
      card3dElement.appendChild(this.glareElement);
    }

    this.eventMouseMoove = (event: MouseEvent) => this.mousemove(event);
    this.eventMouseOut = (event: MouseEvent) => this.mouseout(event);

    //event setup
    this.focusElement.addEventListener("mousemove", this.eventMouseMoove);
    if (!this.config.noReset) {
      this.focusElement.addEventListener("mouseout", this.eventMouseOut);
    }
    if (this.config.gyroscopie) {
      this.eventDeviceOrientation = (event: DeviceOrientationEvent) => {
        const rotateZ = event.beta,
          rotateX = event.gamma;
        if (typeof rotateX !== "number" || typeof rotateZ !== "number") return;
        this.mousemove({
          clientY: Math.min(rotateZ / 45, 1),
          clientX: Math.min(rotateX / 45, 1),
          gyroscopie: true,
        });
      };
      window.addEventListener("deviceorientation", this.eventDeviceOrientation);
    }

    card3dElement.style.overflow = "hidden";
    card3dElement.style.willChange = "transform";
    card3dElement.style.transform = `
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
  mousemove(
    event:
      | MouseEvent
      | { clientX: number; clientY: number; gyroscopie: boolean }
  ) {
    const config = this.config;

    if (!this.card3dElement.isConnected || !this.focusElement.isConnected) {
      this.stop();
      return;
    }

    const reverse = config.reverse ? 1 : -1;

    this.card3dElement.style.transition = "";

    const rect = this.card3dElement.getBoundingClientRect();

    const middleWidth = rect.width / 2;
    const middleHeight = rect.height / 2;
    const middleX = rect.left + middleWidth;
    const middleY = rect.top + middleHeight;

    const x = (middleX - event.clientX) * -1;
    const y = middleY - event.clientY;

    let finalX: number = 0,
      finalY: number = 0;

    if (config.axis.toLowerCase() !== "y")
      finalX =
        (x /
          (this.focusElement !== this.card3dElement
            ? window.innerWidth / 2
            : rect.width / 2)) *
        config.delta;

    if (config.axis.toLowerCase() !== "x")
      finalY =
        (y /
          (this.focusElement !== this.card3dElement
            ? window.innerHeight / 2
            : rect.height / 2)) *
        config.delta;

    //we simulate mousse position
    if ("gyroscopie" in event) {
      finalX = event.clientX * config.delta;
      finalY = event.clientY * config.delta;
    }

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
  mouseout(event: MouseEvent) {
    this.card3dElement.style.transition = "0.5s ease";
    this.card3dElement.style.transform = "";
    if (this.glareElement) this.glareElement.style.opacity = "0";
  }
}

/**
 * Check the card and create the card
 * @param card3dList
 * @returns
 */
function Card3dAttributesHandler(
  card3dList: HTMLElement[] | NodeListOf<HTMLElement>
) {
  for (const card3d of card3dList) {
    //check element is a card3d
    if (
      Card3dElements.findIndex((e) => e.element === card3d) !== -1 ||
      card3d.dataset?.card3d === undefined
    ) {
      continue;
    }

    //we dont create the card if by default it stopped
    const isStopped = parseBooleanAttribute(card3d.dataset.card3dStop);
    if (isStopped) return;

    new Card3d(card3d);
  }
}

/**
 * Create the observer to add new card, remove card or change card on attribute change
 */
function Card3dObserver() {
  const observerDOM = new MutationObserver(function (mutations) {
    const addedNodes: HTMLElement[] = [];

    for (const mutation of mutations ?? []) {
      //attributes changed
      if (
        mutation.type === "attributes" &&
        mutation.attributeName.includes("data-card3d")
      ) {
        const element = mutation.target as HTMLElement;
        const cardIndex = Card3dElements.findIndex(
          (e) => e.element === element
        );

        if (
          parseBooleanAttribute(element.dataset?.card3d) &&
          cardIndex === -1
        ) {
          console.log(element);
          addedNodes.push(element);
        } else if (cardIndex !== -1) {
          Card3dElements[cardIndex].instance.updateConfig();
        }
      }

      //added nodes
      for (const addedNode of mutation.addedNodes) {
        addedNodes.push(addedNode as HTMLElement);
      }

      //nodes removed
      for (const removedNode of mutation.removedNodes) {
        const elementIndex = Card3dElements.findIndex(
          (e) => e.element === (removedNode as HTMLElement)
        );
        if (elementIndex !== -1) {
          Card3dElements.splice(elementIndex, 1);
        }
      }
    }

    if (addedNodes.length > 0) Card3dAttributesHandler(addedNodes);
  });

  observerDOM.observe(window.document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
  });
}

//When dom loaded we init the observer and the card already present
document.addEventListener("DOMContentLoaded", function () {
  Card3dAttributesHandler(document.querySelectorAll("[data-card3d]"));
  Card3dObserver();
});

export default Card3d;
