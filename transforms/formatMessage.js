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
      const hasChainedFormatCall =
        path.parentPath?.parentPath?.node?.type === 'CallExpression' &&
        !!path.parentPath?.parentPath?.node?.arguments?.length &&
        path.parentPath?.node?.type === 'MemberExpression' &&
        path.parentPath?.node?.property?.name === 'format'

      const idLiteral = path.value.arguments[0].value
      const newIdLiteral = generateKey(idLiteral)

      if (hasChainedFormatCall) {
        // handle `__('Hello {0}').format('World')`
        const params = path.parentPath?.parentPath?.value?.arguments

        path.parentPath.parentPath.replace(j.callExpression(j.identifier('formatMessage'), [
          j.objectExpression([
            j.property('init', j.identifier('id'), j.stringLiteral(newIdLiteral))
          ]),
          j.objectExpression(params.map((param, index) => (
            j.property('init', j.identifier(index.toString()), param)
          )))
        ]))
      } else {
        // handle `__('Hello')
        path.replace(j.callExpression(j.identifier('formatMessage'), [
          j.objectExpression([
            j.property('init', j.identifier('id'), j.stringLiteral(newIdLiteral))
          ]),
        ]))
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

  return $j.toSource({ quote: 'single' })
}
