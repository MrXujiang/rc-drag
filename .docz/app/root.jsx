import React from 'react'
import { Link, Router, Routes, useDataServer } from 'docz'
import { hot } from 'react-hot-loader'
import Theme from '/Users/apple/Documents/zm/rc-drag/node_modules/docz-theme-umi/es/index.js'

import { imports } from './imports'
import database from './db.json'

const Root = () => {
  useDataServer('ws://127.0.0.1:60505')
  return (
    <Theme linkComponent={Link} db={database}>
      <Routes imports={imports} />
    </Theme>
  )
}

export default hot(module)(Root)
