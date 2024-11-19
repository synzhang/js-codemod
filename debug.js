const fs = require('fs')
const j = require('jscodeshift')
const { generateKey } = require('./utils/index')

// const $j = new j(`
// __('Hi!');
// __({ id: 'hi' });
// __('Hello {0}!').format('World');
// console.log(1);
// __('Hello {0}!').format('Syn');
// `)
const $j = new j(`
const App = props => {
  const { lang } = props
  const text = 'Syn'

  return (
    <div>
      <span>
        {__('Hi!')}
      </span>
      <span>
        {__('Hello {0}!').format('World')}
        {__('Hello {0}!').format(text)}
      </span>
    </div>
  )
}
`)
// const $j = new j(fs.readFileSync('./transforms/__testfixtures__/formatMessage/withValues.input.tsx').toString())

fs.writeFileSync(`./debug.json`, JSON.stringify($j.get('program', 'body').node))

$j
  .find(j.CallExpression, {
    callee: {
      name: '__',
    },
  })
  .forEach(path => {
    const isTransformed = path?.node?.arguments?.[0]?.type === 'ObjectExpression'

    if (isTransformed) return

    const hasChainedFormatCall =
      path.parentPath?.parentPath?.node?.type === 'CallExpression' &&
      !!path.parentPath?.parentPath?.node?.arguments?.length &&
      path.parentPath?.node?.type === 'MemberExpression' &&
      path.parentPath?.node?.property?.name === 'format'

    const idLiteral = path.value.arguments[0].value
    const newIdLiteral = generateKey(idLiteral)
    const printOptions = {
      lineTerminator: '',
      quote: 'single',
      tabWidth: 0,
    }

    if (hasChainedFormatCall) {
      // handle `__('Hello {0}').format('World')`
      const params = path.parentPath?.parentPath?.value?.arguments

      const node = j.callExpression(j.identifier('__'), [
        j.objectExpression([
          j.property('init', j.identifier('id'), j.stringLiteral(newIdLiteral)),
        ]),
        j.objectExpression(params.map((param, index) => (
          j.property('init', j.identifier(index.toString()), param)
        ))),
      ])

      path.parentPath.parentPath.replace(j(node).toSource(printOptions))
    } else {
      // handle `__('Hello')
      const node = j.callExpression(j.identifier('__'), [
        j.objectExpression([
          j.property('init', j.identifier('id'), j.stringLiteral(newIdLiteral)),
        ]),
      ])

      path.replace(j(node).toSource(printOptions))
    }

    // add `import formatMessage from 'util/formatMessage'` import statement
    const formatMessageImportDeclarations = $j.find(j.ImportDeclaration, {
      source: {
        value: 'util/__',
      },
    })

    if (!formatMessageImportDeclarations.length) {
      const newFormatMessageImportDeclaration = j.importDeclaration(
        [j.importDefaultSpecifier(j.identifier('__'))],
        j.stringLiteral('util/__')
      )

      $j.get().node.program.body.unshift(newFormatMessageImportDeclaration)
    }
  })

console.log($j.toSource({
  quote: 'single',
  trailingComma: true,
}))