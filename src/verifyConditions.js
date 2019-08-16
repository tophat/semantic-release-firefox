const fs = require('fs')
const path = require('path')

const { maybeThrowErrors, verifyConfig } = require('./utils')

const verifyConditions = options => {
    const {
        options: { extensionId, sourceDir, manifestPath },
        errors,
    } = verifyConfig(options)
    const { FIREFOX_API_KEY, FIREFOX_SECRET_KEY } = process.env

    if (!FIREFOX_API_KEY) {
        errors.push('FIREFOX_API_KEY is missing from the environment')
    }

    if (!FIREFOX_SECRET_KEY) {
        errors.push('FIREFOX_SECRET_KEY is missing from the environment')
    }

    if (!extensionId) {
        errors.push(
            'No extensionId was specified in package.json, this would create a new extension instead of a new version.',
        )
    }

    const manifestExists = fs.existsSync(path.join(sourceDir, manifestPath))
    if (!manifestExists) {
        errors.push(
            `${manifestPath} was not found in ${sourceDir}, dist folder needs to exist to run`,
        )
    }

    maybeThrowErrors(errors)
}

module.exports = {
    verifyConditions,
}
