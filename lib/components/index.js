"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

require("./index.css");

/*  react drag
/*  author : xuxiaoxi
/*  date   : 2021-1-3 20:10:41
/*  last   : 2021-1-3 20:10:41
*/

/**
 * 自由拖拽组件
 * @param {container} 画布元素或者画布id
 * @param {pos} 画布初始化坐标
 * @param {size} 元素宽高
 * @param {isStatic} 是否禁止拖拽
 * @param {zIndex} 层级
 * @param {onDragStart} 鼠标拖拽开始
 * @param {onDragStop} 鼠标拖拽结束
 */
function Drag(props) {
  var _props$container = props.container,
      container = _props$container === void 0 ? document.body : _props$container,
      _props$pos = props.pos,
      pos = _props$pos === void 0 ? [0, 0] : _props$pos,
      _props$size = props.size,
      size = _props$size === void 0 ? [100, 100] : _props$size,
      _props$zIndex = props.zIndex,
      zIndex = _props$zIndex === void 0 ? 1 : _props$zIndex,
      _props$isStatic = props.isStatic,
      isStatic = _props$isStatic === void 0 ? false : _props$isStatic,
      children = props.children,
      onDragStart = props.onDragStart,
      onDragStop = props.onDragStop;

  var _useState = (0, _react.useState)({
    left: pos[0],
    top: pos[1],
    width: size[0],
    height: size[1],
    zIndex: zIndex
  }),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      style = _useState2[0],
      setStyle = _useState2[1];

  var dragBox = (0, _react.useRef)(null);
  var points = ['e', 'w', 's', 'n', 'ne', 'nw', 'se', 'sw']; // init origin positon

  var oriPos = (0, _react.useRef)({
    top: 0,
    left: 0,
    cX: 0,
    cY: 0
  });
  var isDown = (0, _react.useRef)(false);
  var direction = (0, _react.useRef)(); // mousedown

  var _onMouseDown = function onMouseDown(dir, e) {
    // stop the event bubbles
    e.stopPropagation(); // set layer level
    // setStyle(prev => ({...prev, zIndex: 9999}))
    // save direction

    direction.current = dir;
    isDown.current = true;
    var cY = e.clientY;
    var cX = e.clientX;
    oriPos.current = Object.assign(Object.assign({}, style), {
      cX: cX,
      cY: cY
    });
    onDragStart && onDragStart(oriPos.current);
  };

  var _onTouchStart = function onTouchStart(dir, e) {
    // stop the event bubbles
    e.stopPropagation(); // set layer level
    // setStyle(prev => ({...prev, zIndex: 9999}))
    // save direction

    direction.current = dir;
    isDown.current = true;
    console.log(e.targetTouches[0]);
    var cY = e.targetTouches[0].pageY;
    var cX = e.targetTouches[0].pageX;
    oriPos.current = Object.assign(Object.assign({}, style), {
      cX: cX,
      cY: cY
    });
    onDragStart && onDragStart(oriPos.current);
  };

  var onTouchMove = (0, _react.useCallback)(function (e) {
    // stop the event bubbles
    e.stopPropagation(); // Determine if the mouse is holding down

    if (!isDown.current) return;
    var y = e.targetTouches[0].pageY;
    var x = e.targetTouches[0].pageX;
    var newStyle = transform(direction.current, oriPos.current, {
      x: x,
      y: y
    });
    setStyle(newStyle);
  }, []); // move mouse

  var onMouseMove = (0, _react.useCallback)(function (e) {
    // Determine if the mouse is holding down
    if (!isDown.current) return;
    var newStyle = transform(direction.current, oriPos.current, {
      x: e.clientX,
      y: e.clientY
    });
    setStyle(newStyle);
  }, []); // The mouse is lifted

  var onMouseUp = (0, _react.useCallback)(function (e) {
    isDown.current = false;
    onDragStop && onDragStop(style);
  }, [style]);

  var getTanDeg = function getTanDeg(tan) {
    var result = Math.atan(tan) / (Math.PI / 180);
    result = Math.round(result);
    return result;
  };

  function transform(direction, oriPos, pos) {
    var _a, _b;

    var style = Object.assign({}, oriPos);
    var offsetX = pos.x - oriPos.cX;
    var offsetY = pos.y - oriPos.cY;

    switch (direction) {
      // move
      case 'move':
        // element position and offset
        var top = oriPos.top + offsetY;
        var left = oriPos.left + offsetX;
        var width = ((_a = dragBox.current) === null || _a === void 0 ? void 0 : _a.offsetWidth) || 0;
        var height = ((_b = dragBox.current) === null || _b === void 0 ? void 0 : _b.offsetHeight) || 0; // Limit the height of the artboard - the height of the element - that must be moved within this range

        style.top = Math.max(0, Math.min(top, height - style.height));
        style.left = Math.max(0, Math.min(left, width - style.width));
        break;
      // east

      case 'e':
        // Drag to the right to add width
        style.width += offsetX;
        return style;
      // west

      case 'w':
        // Increase the width, position synchronization left shift
        style.width -= offsetX;
        style.left += offsetX;
        return style;
      // south

      case 's':
        style.height += offsetY;
        return style;
      // north

      case 'n':
        style.height -= offsetY;
        style.top += offsetY;
        break;
      // northeast

      case 'ne':
        style.height -= offsetY;
        style.top += offsetY;
        style.width += offsetX;
        break;
      // northwest

      case 'nw':
        style.height -= offsetY;
        style.top += offsetY;
        style.width -= offsetX;
        style.left += offsetX;
        break;
      // southeast

      case 'se':
        style.height += offsetY;
        style.width += offsetX;
        break;
      // southwest

      case 'sw':
        style.height += offsetY;
        style.width -= offsetX;
        style.left += offsetX;
        break;

      case 'rotate':
        // The center point of the element, x, y, is calculated as the coordinate origin first
        var x = style.width / 2 + style.left;
        var y = style.height / 2 + style.top; // The current mouse coordinates

        var x1 = pos.x;
        var y1 = pos.y; // Using triangular functions, there are bugs to optimize

        style.transform = "rotate(".concat(getTanDeg((y1 - y) / (x1 - x)), "deg)");
        break;
    }

    return style;
  }

  (0, _react.useEffect)(function () {
    dragBox.current = (0, _typeof2.default)(container) === 'object' ? container : document.querySelector(container);

    if (['relative', 'absolute', 'fixed'].indexOf(dragBox.current.style.position) < 0) {
      dragBox.current.style.position = 'relative';
    }
  }, []);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "drag-item-wrap"
  }, isStatic ? /*#__PURE__*/_react.default.createElement("div", {
    className: "x-drag-item",
    style: style
  }, children) : /*#__PURE__*/_react.default.createElement("div", {
    className: "x-drag-item",
    style: style,
    onMouseDown: function onMouseDown(e) {
      return _onMouseDown('move', e);
    },
    onMouseUp: onMouseUp,
    onMouseMove: onMouseMove,
    onTouchStart: function onTouchStart(e) {
      return _onTouchStart('move', e);
    },
    onTouchMove: onTouchMove,
    onTouchEnd: onMouseUp
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "x-drag-item-child"
  }, children), !isStatic && points.map(function (item) {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: (0, _classnames.default)('control-point', "point-".concat(item)),
      key: item,
      onMouseDown: function onMouseDown(e) {
        return _onMouseDown(item, e);
      },
      onTouchStart: function onTouchStart(e) {
        return _onTouchStart(item, e);
      }
    });
  })));
}

var _default = /*#__PURE__*/(0, _react.memo)(Drag);

exports.default = _default;