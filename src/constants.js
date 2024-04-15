const allowedChannels = {
    LISTED: 'listed',
    UNLISTED: 'unlisted',
}

const defaultOptions = {
    artifactsDir: './artifacts',
    channel: allowedChannels.UNLISTED,
    manifestPath: 'manifest.json',
    sourceDir: 'dist',
}

const requiredOptions = {
    targetXpi:
        'Omitting this would leave the xpi file unnamed when it is returned from mozilla.',
}

const requiredEnvs = {
    FIREFOX_API_KEY: 'Firefox api key used in webext sign command.',
    FIREFOX_SECRET_KEY: 'Firefox api secret used in webext signing.',
}

module.exports = {
    allowedChannels,
    defaultOptions,
    requiredEnvs,
    requiredOptions,
}
