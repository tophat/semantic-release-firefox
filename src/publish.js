const fs = require('fs')
const path = require('path')

const webExt = require('web-ext')
const { signAddon: defaultAddonSigner } = require('sign-addon')

const { allowedChannels, requiredOptions } = require('./constants')
const { verifyOptions } = require('./utils')

const publish = async (options) => {
    // This will create an unsigned xpi from sourceDir folder (dist) it will
    // then pass the unsigned xpi to the signing api, mozilla will validate the
    // xpi and sign it if it's legitimate. They will give us back a signed xpi
    // which will be placed into artifactsDir
    // If there's an error with the validation, webExt sign will log a link to
    // the console which will lead to the validation page which should contain
    // detailed reasons why the extension was rejected
    const { extensionId, artifactsDir, channel, sourceDir, targetXpi } =
        verifyOptions(options, requiredOptions).verified

    const { FIREFOX_API_KEY, FIREFOX_SECRET_KEY } = process.env

    const signAddon = async (params) => {
        const unsignedXpiFile = path.join(artifactsDir, `unsigned-${targetXpi}`)
        fs.writeFileSync(unsignedXpiFile, fs.readFileSync(params.xpiPath))
        const result = await defaultAddonSigner(params)
        if (
            channel === allowedChannels.LISTED &&
            !result.success &&
            result.errorCode === 'ADDON_NOT_AUTO_SIGNED'
        ) {
            result.success = true
            result.downloadedFiles = result.downloadedFiles || [unsignedXpiFile]
        }
        return result
    }

    const signArgs = {
        apiKey: FIREFOX_API_KEY,
        apiSecret: FIREFOX_SECRET_KEY,
        artifactsDir,
        channel,
        sourceDir,
    }

    if (extensionId) {
        signArgs.id = extensionId
    }

    const { downloadedFiles } = await webExt.cmd.sign(signArgs, { signAddon })
    const [xpiFile] = downloadedFiles
    fs.renameSync(xpiFile, path.join(artifactsDir, targetXpi))
}

module.exports = {
    publish,
}
