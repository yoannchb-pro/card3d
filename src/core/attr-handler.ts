import { findCardIndex, parseBooleanAttribute } from "../utils";
import { Card3d, Card3dElements } from "./card3d";

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

    new Card3d(card3d);
  }
}

export default Card3dAttributesHandler;
