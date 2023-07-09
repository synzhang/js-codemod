const { generateKey } = require('../utils')

module.exports = function transformer (file, api) {
  const j = api.jscodeshift
  const $j = j(file.source)

  $j
    .find(j.CallExpression, {
      callee: {
        name: '__'
      }
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
      // keep transformed object literals in one line to
      // avoid some coding style problems
      const printOptions = {
        lineTerminator: '',
        quote: 'single',
        tabWidth: 0,
      }

      if (hasChainedFormatCall) {
        // handle `__('Hello {0}').format('World')`
        const params = path.parentPath?.parentPath?.value?.arguments
        const node = j.callExpression(j.identifier('formatMessage'), [
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
        const node = j.callExpression(j.identifier('formatMessage'), [
          j.objectExpression([
            j.property('init', j.identifier('id'), j.stringLiteral(newIdLiteral)),
          ]),
        ])

        path.replace(j(node).toSource(printOptions))
      }

      // add `import formatMessage from 'util/formatMessage'` import statement
      const formatMessageImportDeclarations = $j.find(j.ImportDeclaration, {
        source: {
          value: 'util/formatMessage'
        }
      })

      if (!formatMessageImportDeclarations.length) {
        const newFormatMessageImportDeclaration = j.importDeclaration(
          [j.importDefaultSpecifier(j.identifier('formatMessage'))],
          j.stringLiteral('util/formatMessage')
        )

        $j.get().node.program.body.unshift(newFormatMessageImportDeclaration)
      }
    })

  return $j.toSource({
    quote: 'single',
    trailingComma: true,
  })
}
