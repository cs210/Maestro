"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lanceGg = require("lance-gg");

var _Asteroid = _interopRequireDefault(require("./../common/Asteroid"));

var _Bullet = _interopRequireDefault(require("./../common/Bullet"));

var _Ship = _interopRequireDefault(require("./../common/Ship"));

var _FinishLine = _interopRequireDefault(require("../common/FinishLine"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var ctx = null;
var game = null;
var canvas = null;

var AsteroidsRenderer = /*#__PURE__*/function (_Renderer) {
  _inherits(AsteroidsRenderer, _Renderer);

  var _super = _createSuper(AsteroidsRenderer);

  function AsteroidsRenderer(gameEngine, clientEngine) {
    var _this;

    _classCallCheck(this, AsteroidsRenderer);

    _this = _super.call(this, gameEngine, clientEngine);
    game = gameEngine; // Init canvas

    canvas = document.createElement('canvas');
    canvas.style.visibility = 'hidden';
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    document.body.insertBefore(canvas, document.getElementById('logo'));
    game.w = canvas.width;
    game.h = canvas.height;
    game.zoom = game.h / game.spaceHeight;
    if (game.w / game.spaceWidth < game.zoom) game.zoom = game.w / game.spaceWidth;
    ctx = canvas.getContext('2d');
    ctx.lineWidth = 2 / game.zoom;
    ctx.strokeStyle = ctx.fillStyle = 'white';
    ctx.shadowBlur = 10;
    ctx.shadowColor = "white";
    ctx.font = "0.2px ONEDAY";
    ctx.textAlign = "center";
    _this.viewer = false;
    _this.groupShipPID = null;
    return _this;
  }

  _createClass(AsteroidsRenderer, [{
    key: "showCanvas",
    value: function showCanvas() {
      canvas.style.visibility = 'visible';
    }
  }, {
    key: "draw",
    value: function draw(t, dt) {
      var _this2 = this;

      _get(_getPrototypeOf(AsteroidsRenderer.prototype), "draw", this).call(this, t, dt); // Clear the canvas


      ctx.clearRect(0, 0, game.w, game.h); // Transform the canvas
      // Note that we need to flip the y axis since Canvas pixel coordinates
      // goes from top to bottom, while physics does the opposite.

      ctx.save();
      ctx.translate(game.w / 2, game.h / 2); // Translate to the center
      // ctx.scale(game.zoom, -game.zoom);  // Zoom in and flip y axis

      ctx.scale(game.zoom, game.zoom); // original y flip doesnt allow for text
      // Draw all things

      this.drawBounds();
      game.world.forEachObject(function (id, obj) {
        if (obj instanceof _Ship["default"]) _this2.drawShip(obj.physicsObj, obj.playerId === _this2.groupShipPID, obj.name);else if (obj instanceof _Bullet["default"]) _this2.drawBullet(obj.physicsObj);else if (obj instanceof _FinishLine["default"]) _this2.drawFinishLine(obj.physicsObj);else if (obj instanceof _Asteroid["default"] && _this2.viewer) _this2.drawAsteroid(obj.physicsObj);
      }); // update status and restore

      this.updateStatus();
      ctx.restore();
    }
  }, {
    key: "updateStatus",
    value: function updateStatus() {
      var playerShip = this.gameEngine.world.queryObject({
        playerId: this.groupShipPID
      });

      if (!playerShip) {
        /*if (this.lives == undefined)
            document.getElementById('gameover').classList.remove('hidden');*/
        return;
      } // update lives if necessary


      if (playerShip.playerId === this.groupShipPID && this.lives != playerShip.lives) {
        document.getElementById('lives').innerHTML = 'Score: ' + playerShip.lives;
        this.lives = playerShip.lives;
      } // update winning if necessary


      if (playerShip.playerId === this.groupShipPID && playerShip.won) {//document.getElementById('gamewin').classList.remove('hidden');
        // this.lives++;
      }
    }
  }, {
    key: "removeInstructions",
    value: function removeInstructions() {
      document.getElementById('instructions').classList.add('hidden');
      document.getElementById('instructionsMobile').classList.add('hidden');
    }
  }, {
    key: "drawShip",
    value: function drawShip(body, special, name) {
      var radius = body.shapes[0].radius;

      if (special) {
        ctx.strokeStyle = ctx.fillStyle = "#18CAE6";
        ctx.shadowColor = "#18CAE6";
      }

      ctx.save();
      ctx.translate(body.position[0], body.position[1]); // Translate to the ship center

      ctx.fillText(name, 0, -0.5);
      ctx.rotate(body.angle); // Rotate to ship orientation

      ctx.beginPath();

      for (var j = 0; j < 3; j++) {
        var xv = body.shapes[0].vertices[j][0];
        var yv = body.shapes[0].vertices[j][1];
        if (j == 0) ctx.moveTo(xv, yv);else ctx.lineTo(xv, yv);
      }

      ctx.closePath();
      ctx.stroke();
      ctx.restore();
      ctx.strokeStyle = ctx.fillStyle = 'white';
      ctx.shadowColor = "white";
    }
  }, {
    key: "drawFinishLine",
    value: function drawFinishLine(body) {
      ctx.strokeStyle = ctx.fillStyle = "#FAF602";
      ctx.shadowColor = "#FAF602";
      ctx.save();
      ctx.translate(body.position[0], body.position[1]); // Translate to the center

      ctx.fillText("Finish", 0, 0); //ctx.rotate(.785);

      ctx.beginPath();

      for (var j = 0; j < game.numAsteroidVerts; j++) {
        var xv = body.verts[j][0];
        var yv = body.verts[j][1];
        if (j == 0) ctx.moveTo(xv, yv);else ctx.lineTo(xv, yv);
      }

      ctx.closePath();
      ctx.stroke();
      ctx.restore();
      ctx.strokeStyle = ctx.fillStyle = 'white';
      ctx.shadowColor = "white";
    }
  }, {
    key: "drawAsteroid",
    value: function drawAsteroid(body) {
      ctx.save();
      ctx.translate(body.position[0], body.position[1]); // Translate to the center

      ctx.beginPath();

      for (var j = 0; j < game.numAsteroidVerts; j++) {
        var xv = body.verts[j][0];
        var yv = body.verts[j][1];
        if (j == 0) ctx.moveTo(xv, yv);else ctx.lineTo(xv, yv);
      }

      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  }, {
    key: "drawBullet",
    value: function drawBullet(body) {
      ctx.beginPath();
      ctx.arc(body.position[0], body.position[1], game.bulletRadius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    }
  }, {
    key: "drawBounds",
    value: function drawBounds() {
      ctx.beginPath();
      ctx.moveTo(-game.spaceWidth / 2, -game.spaceHeight / 2);
      ctx.lineTo(-game.spaceWidth / 2, game.spaceHeight / 2);
      ctx.lineTo(game.spaceWidth / 2, game.spaceHeight / 2);
      ctx.lineTo(game.spaceWidth / 2, -game.spaceHeight / 2);
      ctx.lineTo(-game.spaceWidth / 2, -game.spaceHeight / 2);
      ctx.closePath();
      ctx.stroke();
    }
  }]);

  return AsteroidsRenderer;
}(_lanceGg.Renderer);

exports["default"] = AsteroidsRenderer;
//# sourceMappingURL=AsteroidsRenderer.js.map