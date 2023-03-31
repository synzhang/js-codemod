export default function transformer (file, api) {
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
      const newIdLiteral = idLiteral.replace(LOCALE_KEY_REGEX, '_')

      if (hasChainedFormatCall) {
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
        path.replace(j.callExpression(j.identifier('formatMessage'), [
          j.objectExpression([
            j.property('init', j.identifier('id'), j.stringLiteral(newIdLiteral))
          ]),
        ]))
      }
    })

  return $j.toSource()
}
