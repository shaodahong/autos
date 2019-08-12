module.exports = (id, partialIdentifier, configFiles) => {
  const { resolveProjectPath } = require('../../lib/utils')

  const cacheDirectory = resolveProjectPath(`node_modules/.cache/${id}`)
  const fs = require('fs')
  const hash = require('hash-sum')

  const variables = {
    partialIdentifier
  }

  if (configFiles) {
    const readConfig = file => {
      const absolutePath = resolveProjectPath(file)
      if (fs.existsSync(absolutePath)) {
        if (absolutePath.endsWith('.js')) {
          try {
            return JSON.stringify(require(absolutePath))
          } catch (e) {
            return fs.readFileSync(absolutePath, 'utf-8')
          }
        } else {
          return fs.readFileSync(absolutePath, 'utf-8')
        }
      }
    }
    if (!Array.isArray(configFiles)) {
      configFiles = [configFiles]
    }
    for (const file of configFiles) {
      const content = readConfig(file)
      if (content) {
        variables.configFiles = content.replace(/\r\n?/g, '\n')
        break
      }
    }
  }

  const cacheIdentifier = hash(variables)
  return { cacheDirectory, cacheIdentifier }
}