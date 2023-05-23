import Card3dObserver from "core/observer";
import Card3dAttributesHandler from "core/attr-handler";
import { Card3d } from "core/card3d";

document.addEventListener("DOMContentLoaded", function () {
  Card3dAttributesHandler(document.querySelectorAll("[data-card3d]"));
  Card3dObserver();
});

export default Card3d;
