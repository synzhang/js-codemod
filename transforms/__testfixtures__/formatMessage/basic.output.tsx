import formatMessage from 'util/formatMessage';
import React from 'react'

const Component = () => {
  const msg = formatMessage({
    id: 'hello_world',
  })

  return (
    <>
      {msg}
    </>
  )
}

export default Component
