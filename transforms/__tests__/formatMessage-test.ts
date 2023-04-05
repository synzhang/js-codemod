jest.autoMockOff()

const defineTest = require('jscodeshift/dist/testUtils').defineTest

const transformName = 'formatMessage'
const fixtures = [
  'basic',
  'withValues',
] as const

describe(transformName, () => {
  fixtures.forEach(fixture => {
    defineTest(__dirname, transformName, null, `${transformName}/${fixture}`, {
        parser: 'tsx',
      }
    )
  })
})
