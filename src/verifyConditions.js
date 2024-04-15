const fs = require('fs')
const path = require('path')

const { requiredEnvs, requiredOptions } = require('./constants')
const { maybeThrowErrors, verifyOptions } = require('./utils')

const verifyConditions = (options) => {
    const { verified, errors } = verifyOptions(options, requiredOptions, false)
    errors.push(...verifyOptions(process.env, requiredEnvs, false).errors)
    const { extensionId, manifestPath, sourceDir } = verified
    const joinedManifestPath = path.join(sourceDir, manifestPath)
    const manifestExists = fs.existsSync(joinedManifestPath)
    if (!manifestExists) {
        errors.push(
            `${manifestPath} was not found in ${sourceDir}, path does not exist.`,
        )
    } else {
        const manifest = fs.readFileSync(joinedManifestPath, 'utf-8')
        const manifestJson = JSON.parse(manifest)
        const hasManifestId =
            manifestJson &&
            manifestJson.browser_specific_settings &&
            manifestJson.browser_specific_settings.gecko &&
            manifestJson.browser_specific_settings.gecko.id

        if (!extensionId && !hasManifestId) {
            errors.push(
                'extension ID must be set in manifest.json or as extensionId config',
            )
        }

        if (extensionId && hasManifestId) {
            errors.push(
                'extension ID can only be set by either manifest.json or extensionId config',
            )
        }
    }

    maybeThrowErrors(errors)
}

module.exports = {
    verifyConditions,
}
