import formatMessage from 'util/formatMessage';
import React from 'react'

const Component = () => {
  const msg = formatMessage({
    id: 'hello__0__',
  }, {
    0: 'World',
  })
  const paragraph = formatMessage({
    id: 'hello__0___im___1__',
  }, {
    0: 'Bill',
    1: 'Steve',
  })

  return (
    <>
      <p>{msg}</p>
      <p>{paragraph}</p>
    </>
  )
}

export default Component
