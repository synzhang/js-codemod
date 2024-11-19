import fillInTranslation from 'util/fillInTranslation'

const App = () => {
  return (
    <>
      {fillInTranslation(__('Hello _'), [
        <span className='colorful'>{'World!'}</span>,
      ])}
    </>
  )
}