/*  react drag
/*  author : xuxiaoxi
/*  date   : 2021-1-3 20:10:41
/*  last   : 2021-1-3 20:10:41
*/

import React, { ReactNode, useState, useRef, useEffect, useCallback, memo } from 'react'
import classnames from 'classnames'
import './index.less'

export interface IProps {
  container: HTMLElement | string;
  isStatic: boolean;
  pos: [number, number];
  size: [number, number];
  zIndex: number;
  children: ReactNode;
  onDragStart: (params) => void;
  onDragStop: (params) => void;
}

interface OriPos {
  left: number;
  top: number;
  cX: number;
  cY: number;
  [name:string]: any;
}

type PosMap = 'e' | 'w' | 's' | 'n' | 'ne' | 'nw' | 'se' | 'sw' | 'move' | 'rotate' | undefined;


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
function Drag(props:IProps) {
  const {
    container = document.body,
    pos = [0,0],
    size = [100, 100],
    zIndex = 1,
    isStatic = false,
    children,
    onDragStart,
    onDragStop
  } = props

  const [style, setStyle] = useState({
    left: pos[0],
    top: pos[1],
    width: size[0],
    height: size[1],
    zIndex
  })

  const dragBox = useRef<HTMLElement | null>(null);
  const points = ['e', 'w', 's', 'n', 'ne', 'nw', 'se', 'sw']

  // init origin positon
  const oriPos = useRef<OriPos>({
    top: 0, // element position
    left: 0,
    cX: 0, // mouse position
    cY: 0,
  })
  const isDown = useRef(false)
  const direction = useRef<PosMap>()

  // mousedown
  const onMouseDown = (dir:PosMap, e:React.MouseEvent<HTMLElement>) => {
    // stop the event bubbles
    e.stopPropagation();
    // save direction
    direction.current = dir;
    isDown.current = true;

    const cY = e.clientY;
    const cX = e.clientX;
    oriPos.current = {
      ...style,
      cX, cY
    }
    onDragStart && onDragStart(oriPos.current)
  }

  // move mouse
  const onMouseMove = useCallback((e) => {
    // Determine if the mouse is holding down
    if (!isDown.current) return
    let newStyle = transform(direction.current, oriPos.current, e);
    setStyle(newStyle as any)
  }, [])

  // The mouse is lifted
  const onMouseUp = useCallback((e) => {
    isDown.current = false;
    onDragStop && onDragStop(style)
  }, [style])

  const getTanDeg = (tan:number) => {
    var result = Math.atan(tan) / (Math.PI / 180);
    result = Math.round(result);
    return result;
  }

  function transform(direction: PosMap, oriPos:OriPos, e:React.MouseEvent<HTMLElement>) {
    const style = {...oriPos}
    const offsetX = e.clientX - oriPos.cX;
    const offsetY = e.clientY - oriPos.cY;

    switch (direction) {
      // move
      case 'move' :
          // element position and offset
          const top = oriPos.top + offsetY;
          const left = oriPos.left + offsetX;
          const width = dragBox.current?.offsetWidth || 0;
          const height = dragBox.current?.offsetHeight || 0;
          // Limit the height of the artboard - the height of the element - that must be moved within this range
          style.top = Math.max(0, Math.min(top, height - style.height));
          style.left = Math.max(0, Math.min(left, width - style.width));
          break
      // east
      case 'e':
          // Drag to the right to add width
          style.width += offsetX;
          return style
      // west
      case 'w':
        // Increase the width, position synchronization left shift
        style.width -= offsetX;
        style.left += offsetX;
        return style
      // south
      case 's':
          style.height += offsetY;
          return style
      // north
      case 'n':
          style.height -= offsetY;
          style.top += offsetY;
          break
      // northeast
      case 'ne':
          style.height -= offsetY;
          style.top += offsetY;
          style.width += offsetX;
          break
      // northwest
      case 'nw':
          style.height -= offsetY;
          style.top += offsetY;
          style.width -= offsetX;
          style.left += offsetX; 
          break
      // southeast
      case 'se':
          style.height += offsetY;
          style.width += offsetX;
          break
      // southwest
      case 'sw':
          style.height += offsetY;
          style.width -= offsetX;
          style.left += offsetX;
          break
      case 'rotate':
        // The center point of the element, x, y, is calculated as the coordinate origin first
        const x = style.width / 2 + style.left;
        const y = style.height / 2 + style.top;
        // The current mouse coordinates
        const x1 = e.clientX;
        const y1 = e.clientY;
        // Using triangular functions, there are bugs to optimize
        style.transform = `rotate(${getTanDeg((y1 - y) / (x1 - x))}deg)`;
        break
    }
    return style
  }

  useEffect(() => {
    dragBox.current = (typeof container === 'object' ? container : document.querySelector(container)) as HTMLElement;
    if(['relative', 'absolute', 'fixed'].indexOf(dragBox.current.style.position) < 0) {
      dragBox.current.style.position = 'relative';
    }
  }, [])
  
  return <div className="drag-item-wrap">
    {
      isStatic ? <div className="x-drag-item" style={style}>{ children }</div>
        :
        <div className="x-drag-item" style={style} onMouseDown={(e) => onMouseDown('move', e)} onMouseUp={onMouseUp} onMouseMove={onMouseMove}>
          <div className="x-drag-item-child">{ children }</div>
          {
            !isStatic && points.map(item => <div className={classnames('control-point', `point-${item}`)} key={item} onMouseDown={(e:React.MouseEvent<HTMLElement>) => onMouseDown(item as PosMap, e)}></div>)
          }
        </div>
    }
  </div>
}

export default memo(Drag)

