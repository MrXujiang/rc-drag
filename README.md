## rc-drag

rc-drag is a react-based drag-and-zoom component library that provides a flexible drag configuration and allows us to scale from different angles. 

## Table of Contents

- [Demos](#demos)
- [Installation](#installation)
- [API](#api)
- [Usage](#usage)
- [Contribute](#contribute)
- [TODO List](#todo-list)

## Demos
<img src="./01.png" />

## Installation

``` bash
npm i @xlab/rc-drag
```
or
``` bash
yarn add @xlab/rc-drag
```

## API
|  参数  |  说明  |  类型  |  默认值  |
|  ---   |  ---  |  ---  |  ---  |
|  container  |  画布元素或者画布id (Canvas element or canvas id) |  HTMLElement | string  | document.body |
|  pos  |  画布初始化坐标 (The canvas initializes the coordinates)  |  [x:number, y:number]  |  [0, 0]  |
|  isStatic  |  是否禁止拖拽(Whether drag is prohibited)  | boolean |  false  |
|  zIndex  |  拖拽元素的层级 (Drag the level of the element)  |  number  |  1  |
|  close  |  todo  |  -  |  -  |
|  onClose  |  todo  |  -  |   - |


## usage

``` js
// 导入
import { Drag } from '@xlab/rc-drag'

<div id="box">
    <Drag container="#box">123</Drag>
    <Drag 
      container="#box" 
      pos={[0, 50]}
      size={[100, 100]}
    >
      <img src="https://github.com/MrXujiang/h5-Dooring/raw/master/public/logo.png" />
    </Drag>
</div>

```

## Contribute

If you have a feature request, please add it as an issue or make a pull request.

If you have a bug to report, please reproduce the bug in [issue]() to help
us easily isolate it.

## TODO List

- [ ] support rotate control
- [ ] support server-rendered apps