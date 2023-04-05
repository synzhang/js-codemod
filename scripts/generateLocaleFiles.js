const path = require('path')
const fsPromises = require('fs/promises')
const { generateKey } = require('../utils')

const transform = (json) => {
  const { en, cn } = Object.entries(json)
    .reduce((result, [key, value]) => {
      const newKey = generateKey(key)

      result.en[newKey] = key.trim()
      result.cn[newKey] = value

      return result
    }, {
      en: {},
      cn: {}
    })

  return { en, cn }
}

const run = async () => {
  try {
    const filePath = path.resolve(__dirname, '../locale/cn/translation.json')
    const file = await fsPromises.readFile(filePath)
    const json = JSON.parse(file)
    const { en, cn } = transform(json)

    await Promise
      .all([
        fsPromises.mkdir(path.join(__dirname, '../locale/en'), { recursive: true }),
        fsPromises.mkdir(path.join(__dirname, '../locale/cn'), { recursive: true })
      ])

    const transformedEnFilePath = path.resolve(__dirname, '../locale/en/data.json')
    const transformedCnFilePath = path.resolve(__dirname, '../locale/cn/data.json')

    await Promise
      .all([
        fsPromises.writeFile(transformedEnFilePath, JSON.stringify(en)),
        fsPromises.writeFile(transformedCnFilePath, JSON.stringify(cn))
      ])
  } catch (e) {
    console.error(e)
  }
}

run()