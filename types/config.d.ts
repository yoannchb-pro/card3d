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

export default Config;
