import Config from "../types/config";
import {
  findCardIndex,
  parseBooleanAttribute,
  parseFloatAttrbiutes,
} from "../utils";
import { Card3d, defaultConfig } from "./card3d";

/**
 * Set the configuration based on the attributes
 * @returns
 */
function getConfigFromAttributes(element: HTMLElement): Config {
  const attr = element.dataset;

  const fullPageListening = parseBooleanAttribute(attr.card3dFullPageListening);
  const noReset = parseBooleanAttribute(attr.card3dNoReset);
  const glare = parseBooleanAttribute(attr.card3dGlare);
  const reverse = parseBooleanAttribute(attr.card3dReverse);
  const stop = parseBooleanAttribute(attr.card3dStop);
  const gyroscopie = parseBooleanAttribute(attr.card3dGyroscopie);

  const delta = parseFloatAttrbiutes(attr.card3dDelta) ?? defaultConfig.delta;
  const perspective =
    parseFloatAttrbiutes(attr.card3dPerspective) ?? defaultConfig.perspective;
  const startX =
    parseFloatAttrbiutes(attr.card3dStartX) ?? defaultConfig.startX;
  const startY =
    parseFloatAttrbiutes(attr.card3dStartY) ?? defaultConfig.startY;
  const glareOpacity =
    parseFloatAttrbiutes(attr.card3dGlare) ?? defaultConfig.glareOpacity;
  const scale = parseFloatAttrbiutes(attr.card3dScale) ?? defaultConfig.scale;

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
 * Check the card and create the card
 * @param card3dList
 * @returns
 */
function Card3dAttributesHandler(
  card3dList: HTMLElement[] | NodeListOf<HTMLElement>
) {
  for (const card3d of card3dList) {
    const alreadySetup = findCardIndex(card3d) !== -1;
    const isNotCard3d = card3d.dataset?.card3d === undefined;
    const isStopped = parseBooleanAttribute(card3d.dataset?.card3dStop);

    if (alreadySetup || isStopped || isNotCard3d) continue;

    new Card3d(card3d, getConfigFromAttributes(card3d));
  }
}

export { Card3dAttributesHandler, getConfigFromAttributes };
