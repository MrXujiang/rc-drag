export const imports = {
  'src/components/index.mdx': () =>
    import(
      /* webpackPrefetch: true, webpackChunkName: "src-components-index" */ 'src/components/index.mdx'
    ),
}
