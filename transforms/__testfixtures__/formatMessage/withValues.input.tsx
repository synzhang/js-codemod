import React from 'react'

const Component = () => {
  const msg = __('Hello {0}!').format('World')
  const paragraph = __('Hello {0}, Im\' {1}.').format('Bill', 'Steve')

  return (
    <>
      <p>{msg}</p>
      <p>{paragraph}</p>
    </>
  )
}

export default Component
