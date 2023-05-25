import { findCardIndex, parseBooleanAttribute } from "utils";
import { Card3dElements } from "./card3d";
import {
  Card3dAttributesHandler,
  getConfigFromAttributes,
} from "./attr-handler";

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
        const cardIndex = findCardIndex(element);

        const isNewCard =
          parseBooleanAttribute(element.dataset?.card3d) && cardIndex === -1;
        const cardAlreadyExist = cardIndex !== -1;

        if (isNewCard) {
          addedNodes.push(element);
        } else if (cardAlreadyExist) {
          Card3dElements[cardIndex].instance.updateConfig(
            getConfigFromAttributes(Card3dElements[cardIndex].element)
          );
        }
      }

      //added nodes
      for (const addedNode of mutation.addedNodes) {
        addedNodes.push(addedNode as HTMLElement);
      }

      //removed nodes
      for (const removedNode of mutation.removedNodes) {
        const elementIndex = findCardIndex(removedNode);
        if (elementIndex !== -1) Card3dElements.splice(elementIndex, 1);
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

export default Card3dObserver;
