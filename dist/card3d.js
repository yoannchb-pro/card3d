(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Card3d = factory());
})(this, (function () { 'use strict';

  const Card3dElements = [];
  const defaultConfig = {
      delta: 10,
      perspective: 500,
      startX: 0,
      startY: 0,
      glareOpacity: 0.5,
      axis: "all",
      scale: 1,
  };
  class Card3d {
      constructor(card3dElement, config) {
          this.card3dElement = card3dElement;
          this.config = config;
          this.gyroOrigin = null;
          Card3dElements.push({ element: card3dElement, instance: this });
          if (!this.config)
              this.config = this.setConfigFromAttributes();
          this.config = Object.assign({}, defaultConfig, this.config);
          if (!this.config.stop)
              this.start();
          else
              this.stop();
      }
      /**
       * Update config when attributes change
       */
      updateConfig() {
          this.config = this.setConfigFromAttributes();
          if (this.config.stop) {
              this.stop();
          }
          else {
              this.reset();
              this.start();
          }
      }
      /**
       * Set the configuration based on the attributes
       * @returns
       */
      setConfigFromAttributes() {
          var _a, _b, _c, _d, _e, _f;
          const attr = this.card3dElement.dataset;
          const fullPageListening = parseBooleanAttribute(attr.card3dFullPageListening);
          const noReset = parseBooleanAttribute(attr.card3dNoReset);
          const glare = parseBooleanAttribute(attr.card3dGlare);
          const reverse = parseBooleanAttribute(attr.card3dReverse);
          const stop = parseBooleanAttribute(attr.card3dStop);
          const gyroscopie = parseBooleanAttribute(attr.card3dGyroscopie);
          const delta = (_a = parseFloatAttrbiutes(attr.card3dDelta)) !== null && _a !== void 0 ? _a : defaultConfig.delta;
          const perspective = (_b = parseFloatAttrbiutes(attr.card3dPerspective)) !== null && _b !== void 0 ? _b : defaultConfig.perspective;
          const startX = (_c = parseFloatAttrbiutes(attr.card3dStartX)) !== null && _c !== void 0 ? _c : defaultConfig.startX;
          const startY = (_d = parseFloatAttrbiutes(attr.card3dStartY)) !== null && _d !== void 0 ? _d : defaultConfig.startY;
          const glareOpacity = (_e = parseFloatAttrbiutes(attr.card3dGlare)) !== null && _e !== void 0 ? _e : defaultConfig.glareOpacity;
          const scale = (_f = parseFloatAttrbiutes(attr.card3dScale)) !== null && _f !== void 0 ? _f : defaultConfig.scale;
          let axis = "all";
          if (attr.card3dAxis === "x") {
              axis = "x";
          }
          else if (attr.card3dAxis === "y") {
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
       * Remove all event listener of the card
       */
      removeEventListener() {
          this.focusElement.removeEventListener("mousemove", this.eventMouseMoove);
          this.focusElement.removeEventListener("mouseout", this.eventMouseOut);
          if (this.config.gyroscopie)
              window.removeEventListener("deviceorientation", this.eventDeviceOrientation);
      }
      /**
       * Set all necessary event listener
       */
      setupEventListener() {
          this.eventMouseMoove = (event) => this.mousemove(event);
          this.eventMouseOut = () => this.mouseout();
          this.focusElement.addEventListener("mousemove", this.eventMouseMoove);
          if (!this.config.noReset) {
              this.focusElement.addEventListener("mouseout", this.eventMouseOut);
          }
          if (this.config.gyroscopie) {
              this.eventDeviceOrientation = (event) => this.gyro(event);
              window.addEventListener("deviceorientation", this.eventDeviceOrientation);
          }
      }
      /**
       * Handle device orientation event
       * @param event
       * @returns
       */
      gyro(event) {
          const rotateZ = event.beta, rotateX = event.gamma;
          if (typeof rotateX !== "number" || typeof rotateZ !== "number")
              return;
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
          if (this.glareElement)
              this.glareElement.remove();
          this.removeEventListener();
      }
      /**
       * Apply the glare
       */
      applyGlare() {
          this.glareElement = document.createElement("span");
          this.glareElement.setAttribute("style", `
        will-change: transform;
        position: absolute;
        background-image: linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%);
        pointer-event: none; 
        transform-origin: 0% 0%;
        transform: translate(-50%, -50%) rotate(180deg);
        opacity: 0;
        z-index: 999;
        `);
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
          if (this.config.glare)
              this.applyGlare();
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
      mousemove(event) {
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
          const width = this.focusElement !== this.card3dElement
              ? window.innerWidth / 2
              : rect.width / 2;
          const height = this.focusElement !== this.card3dElement
              ? window.innerHeight / 2
              : rect.height / 2;
          let finalX = 0, finalY = 0;
          if ("gyroscopie" in event) {
              if (!this.gyroOrigin) {
                  this.gyroOrigin = {
                      x: event.clientX,
                      y: event.clientY,
                  };
              }
              finalX = (this.gyroOrigin.x - event.clientX) * config.delta;
              finalY = (this.gyroOrigin.y - event.clientY) * config.delta;
          }
          else {
              if (config.axis !== "y") {
                  finalX = (x / width) * config.delta;
              }
              if (config.axis !== "x") {
                  finalY = (y / height) * config.delta;
              }
          }
          //we update the glare
          if (config.glare) {
              const angle = Math.atan2(event.clientX - middleX, -(event.clientY - middleY)) *
                  (180 / Math.PI);
              const glareSize = (rect.width > rect.height ? rect.width : rect.height) * 2;
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
      mouseout() {
          this.card3dElement.style.transition = "0.5s ease";
          this.card3dElement.style.transform = "";
          if (this.glareElement)
              this.glareElement.style.opacity = "0";
      }
  }

  /**
   * Parse boolean from attribute
   * @param str
   * @returns
   */
  function parseBooleanAttribute(str) {
      return str !== null && str !== undefined && (str === "" || str === "true");
  }
  /**
   * Parse float from attribute
   * @param str
   * @returns
   */
  function parseFloatAttrbiutes(str) {
      const nb = parseFloat(str);
      return isNaN(nb) || typeof nb !== "number" ? undefined : nb;
  }
  /**
   * Find the card index
   * @param cardElement
   * @returns
   */
  function findCardIndex(cardElement) {
      return Card3dElements.findIndex((e) => e.element === cardElement);
  }

  /**
   * Check the card and create the card
   * @param card3dList
   * @returns
   */
  function Card3dAttributesHandler(card3dList) {
      var _a, _b;
      for (const card3d of card3dList) {
          const alreadySetup = findCardIndex(card3d) !== -1;
          const isNotCard3d = ((_a = card3d.dataset) === null || _a === void 0 ? void 0 : _a.card3d) === undefined;
          const isStopped = parseBooleanAttribute((_b = card3d.dataset) === null || _b === void 0 ? void 0 : _b.card3dStop);
          if (alreadySetup || isStopped || isNotCard3d)
              continue;
          new Card3d(card3d);
      }
  }

  /**
   * Create the observer to add new card, remove card or change card on attribute change
   */
  function Card3dObserver() {
      const observerDOM = new MutationObserver(function (mutations) {
          var _a;
          const addedNodes = [];
          for (const mutation of mutations !== null && mutations !== void 0 ? mutations : []) {
              //attributes changed
              if (mutation.type === "attributes" &&
                  mutation.attributeName.includes("data-card3d")) {
                  const element = mutation.target;
                  const cardIndex = findCardIndex(element);
                  const isNewCard = parseBooleanAttribute((_a = element.dataset) === null || _a === void 0 ? void 0 : _a.card3d) && cardIndex === -1;
                  const cardAlreadyExist = cardIndex !== -1;
                  if (isNewCard) {
                      addedNodes.push(element);
                  }
                  else if (cardAlreadyExist) {
                      Card3dElements[cardIndex].instance.updateConfig();
                  }
              }
              //added nodes
              for (const addedNode of mutation.addedNodes) {
                  addedNodes.push(addedNode);
              }
              //removed nodes
              for (const removedNode of mutation.removedNodes) {
                  const elementIndex = findCardIndex(removedNode);
                  if (elementIndex !== -1)
                      Card3dElements.splice(elementIndex, 1);
              }
          }
          if (addedNodes.length > 0)
              Card3dAttributesHandler(addedNodes);
      });
      observerDOM.observe(window.document.documentElement, {
          childList: true,
          subtree: true,
          attributes: true,
      });
  }

  document.addEventListener("DOMContentLoaded", function () {
      Card3dAttributesHandler(document.querySelectorAll("[data-card3d]"));
      Card3dObserver();
  });

  return Card3d;

}));
//# sourceMappingURL=card3d.js.map
