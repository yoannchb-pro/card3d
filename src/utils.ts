import { Card3dElements } from "core/card3d";

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

/**
 * Find the card index
 * @param cardElement
 * @returns
 */
function findCardIndex(cardElement: HTMLElement | Node) {
  return Card3dElements.findIndex((e) => e.element === cardElement);
}

export { parseBooleanAttribute, parseFloatAttrbiutes, findCardIndex };
