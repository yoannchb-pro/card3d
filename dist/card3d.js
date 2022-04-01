'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var Card3dElements = [];

var Card3d = /*#__PURE__*/function () {
  function Card3d(element, conf) {
    _classCallCheck(this, Card3d);

    this.verify(element);
    this.$e = element;
    Card3dElements.push(element);
    this.setConfiguration(conf);
    this.start(false);
  }

  _createClass(Card3d, [{
    key: "verify",
    value: function verify(element) {
      if (!element) throw "[CARD3D] You should give a dom element to the constructor !";
      if (element.length != undefined) throw "[CARD3D] 'element' should be one element !";
    }
  }, {
    key: "setConfiguration",
    value: function setConfiguration() {
      var conf = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.$e.setAttribute('data-card3d', '');
      var keys = Object.keys(conf);

      for (var _i = 0, _keys = keys; _i < _keys.length; _i++) {
        var key = _keys[_i];
        this.$e.setAttribute("data-card3d-".concat(key.toLowerCase()), conf[key].toString());
      }
    }
  }, {
    key: "start",
    value: function start() {
      var _this = this;

      var resetStop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var e = this.$e;
      if (resetStop) e.removeAttribute('data-card3d-stop');
      var focus = e;
      var config = e.dataset;
      var fullPage = config.card3dFullPageListening && JSON.parse(config.card3dFullPageListening);
      if (fullPage) focus = document.body;
      var perspective = config.card3dPerspective && parseFloat(config.card3dPerspective) ? parseFloat(config.card3dPerspective) : 500;
      var startPositionX = config.card3dStartX && parseFloat(config.card3dStartX) ? parseFloat(config.card3dStartX) : 0;
      var startPositionY = config.card3dStartY && parseFloat(config.card3dStartY) ? parseFloat(config.card3dStartY) : 0; //glare element

      var glare = config.card3dGlare != null && config.card3dGlare != undefined;
      var glareOpacity = glare && parseFloat(config.card3dGlare) ? parseFloat(config.card3dGlare) : 0.5;
      var gl = document.createElement('span');
      gl.style = "\n        will-change: transform;\n        position: absolute;\n        background-image: linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%);\n        pointer-event: none; \n        transform-origin: 0% 0%;\n        transform: translate(-50%, -50%) rotate(180deg);\n        opacity: 0;\n        z-index: 999;\n        ";
      e.appendChild(gl);
      this.$gl = gl;
      this.$focus = focus;

      this.$eventMoove = function (event) {
        return _this.mousemove(event, focus, config, e, gl, perspective, glare, glareOpacity);
      };

      this.$eventOut = function (event) {
        return _this.mouseout(event, e, gl);
      }; //event setup


      focus.addEventListener('mousemove', this.$eventMoove);
      var reset = config.card3dReset && JSON.parse(config.card3dReset);

      if (reset || config.card3dReset == null || config.card3dReset == undefined) {
        focus.addEventListener('mouseout', this.$eventOut);
      }

      e.style.overflow = "hidden";
      e.style.willChange = "transform";
      e.style.transform = "\n        perspective(500px) \n        rotateX(".concat(startPositionY, "deg) \n        rotateY(").concat(startPositionX, "deg)\n        ");
    }
  }, {
    key: "mousemove",
    value: function mousemove(event, focus, config, e, gl, perspective, glare, glareOpacity) {
      //config
      var stopC = config.card3dStop && JSON.parse(config.card3dStop);

      if (stopC || !e.isConnected || !focus.isConnected) {
        this.stop();
        return;
      }

      var reverse = config.card3dReverse && JSON.parse(config.card3dReverse) ? 1 : -1;
      var axis = config.card3dAxis ? config.card3dAxis : 'all';
      var scale = config.card3dScale && parseFloat(config.card3dScale) ? parseFloat(config.card3dScale) : 1;
      var delta = config.card3dDelta && parseFloat(config.card3dDelta) ? parseFloat(config.card3dDelta) : 10; //end

      e.style.transition = "";
      var rect = e.getBoundingClientRect();
      var middleWidth = rect.width / 2;
      var middleHeight = rect.height / 2;
      var middleX = rect.left + middleWidth;
      var middleY = rect.top + middleHeight;
      var x = (middleX - event.clientX) * -1;
      var y = middleY - event.clientY;
      var finalX = x / (focus != e ? window.innerWidth / 2 : rect.width / 2) * delta;
      var finalY = y / (focus != e ? window.innerHeight / 2 : rect.height / 2) * delta;

      if (axis.toLowerCase() == 'x') {
        finalY = 0;
      } else if (axis.toLowerCase() == 'y') {
        finalX = 0;
      } //glare


      if (glare) {
        var angle = Math.atan2(event.clientX - middleX, -(event.clientY - middleY)) * (180 / Math.PI);
        var glareSize = (rect.width > rect.height ? rect.width : rect.height) * 2;
        gl.style.opacity = glareOpacity;
        gl.style.left = "50%";
        gl.style.top = "50%";
        gl.style.width = glareSize + "px";
        gl.style.height = glareSize + "px";
        gl.style.transform = "rotate(".concat(angle, "deg) translate(-50%, -50%)");
        gl.style.display = "block";
      }

      e.style.transform = "\n        perspective(".concat(perspective, "px) \n        rotateX(").concat(finalY * reverse, "deg) \n        rotateY(").concat(finalX * reverse, "deg)\n        scale(").concat(scale, ")\n        ");
    }
  }, {
    key: "mouseout",
    value: function mouseout(event, e, gl) {
      e.style.transition = "0.5s ease";
      e.style.transform = "";
      gl.style.opacity = "0";
    }
  }, {
    key: "stop",
    value: function stop() {
      this.$e.setAttribute('data-card3d-stop', 'true');
      this.$focus.removeEventListener('mousemove', this.$eventMoove);
      this.$focus.removeEventListener('mouseout', this.$eventMoove);
      this.$gl.remove();
      Card3dElements.splice(Card3dElements.indexOf(this.$e), 1);
    }
  }]);

  return Card3d;
}(); //HANDLER ATTRIBUTE


function Card3dAttributesHandler() {
  var elements = document.querySelectorAll('[data-card3d]');
  elements.forEach(function (el) {
    if (Card3dElements.indexOf(el) != -1 || !el.getAttribute) {
      return;
    }

    try {
      var stopC = el.dataset.card3dStop && JSON.parse(el.dataset.card3dStop);
      if (stopC) return;
      new Card3d(el);
    } catch (e) {}
  });
} //OBSERVER


function Card3dObserver() {
  function getMutationObserver() {
    return window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
  }

  var MutationObserver = getMutationObserver();
  var observerDOM = new MutationObserver(function (mutations) {
    if (!mutations) return;
    Card3dAttributesHandler();
  });
  observerDOM.observe(window.document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    removedNodes: true
  });
} //DOM LOADED


document.addEventListener('DOMContentLoaded', function () {
  Card3dObserver();
  Card3dAttributesHandler();
});
if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) == "object") module.exports = Card3d;