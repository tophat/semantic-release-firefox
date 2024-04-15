const { vol } = require('memfs')
require('jest-mock-props').extend(jest)

const { verifyConditions } = require('../src')

describe('verifyConditions', () => {
    const firefoxApiKeySpy = jest.spyOnProp(process.env, 'FIREFOX_API_KEY')
    const firefoxSecretKeySpy = jest.spyOnProp(
        process.env,
        'FIREFOX_SECRET_KEY',
    )
    const extensionId = '{01234567-abcd-6789-cdef-0123456789ef}'
    const targetXpi = 'target-extension.xpi'

    beforeEach(() => {
        vol.reset()
        vol.fromJSON({
            'dist/manifest.json': `{
    "browser_specific_settings": {
        "gecko": {
            "id": "${extensionId}"
        }
    }
}`,
        })
        firefoxApiKeySpy.mockValueOnce('some-api-key')
        firefoxSecretKeySpy.mockValueOnce('shh-its-a-secret')
    })
    afterEach(() => {
        jest.resetAllMocks()
    })
    afterAll(() => {
        jest.restoreAllMocks()
    })

    it('fails if FIREFOX_API_KEY is missing from env', () => {
        firefoxApiKeySpy.mockReset()
        expect(() => verifyConditions({ extensionId, targetXpi })).toThrow(
            'FIREFOX_API_KEY is missing',
        )
    })

    it('fails if FIREFOX_SECRET_KEY is missing from env', () => {
        firefoxSecretKeySpy.mockReset()
        expect(() => verifyConditions({ extensionId, targetXpi })).toThrow(
            'FIREFOX_SECRET_KEY is missing',
        )
    })

    it('fails if extensionId is missing from options and from manifest.json', () => {
        vol.reset()
        vol.fromJSON({
            'dist/manifest.json': `{
    "browser_specific_settings": {
        "gecko": {
        }
    }
}`,
        })
        expect(() => verifyConditions({ targetXpi })).toThrow(
            'extension ID must be set',
        )
    })

    it('fails if extensionId is set from both options and from manifest.json', () => {
        expect(() => verifyConditions({ extensionId, targetXpi })).toThrow(
            'extension ID can only be set by either',
        )
    })

    it('fails if targetXpi is missing from options', () => {
        expect(() => verifyConditions({})).toThrow('targetXpi is missing')
    })

    it('fails if manifest.json file does not exist', () => {
        vol.reset()
        expect(() => verifyConditions({ targetXpi })).toThrow(
            'manifest.json was not found',
        )
    })

    it('succeeds if all conditions are met', () => {
        expect(() => verifyConditions({ targetXpi })).not.toThrow()
    })
})
