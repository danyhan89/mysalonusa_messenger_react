
const cleanupProps = (props, CmpPropTypes) => {
  props = { ...props }

  Object.keys(CmpPropTypes).forEach(propName => {
    delete props[propName]
  })

  return props
}

export default cleanupProps