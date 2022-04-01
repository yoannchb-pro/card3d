# card3d
Create beautilful 3d card like vanilla-tilt js

## Inspired

Inspired from vanilla tilt js just for fun

## how to ?

<img src="./assets/Animation.gif" alt="GIF ANIMATION"></img>

## Update
v1.0.4
-Forgot to push dist directory ;)

v1.0.3
- Added observer

## NPM
```
npm i card3d
```
```js
//Node.js
const Card3d = require("card3d");

//Vue.js example
import Card3d from "card3d/dist/card3d.js";
Vue.use(Card3d);

//should be a querySelector not querySelectorAll
const card = new Card3d(document.querySelector('.card'), {
    glare: 0.7,
});
//equal to do <div class="card" data-card3d data-card3d-glare="0.7"></div>

//methods
card.stop();
card.start();
```

## CDN
```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/yoannchb-pro/Card3d/dist/card3d.min.js"></script>
```

## GITHUB
```html
<script type="text/javascript" src="./dist/card3d.js"></script>
```

## Documentation

- [Documentation on the github page](https://yoannchb-pro.github.io/card3d/index.html)