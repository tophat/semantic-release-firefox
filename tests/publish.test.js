const fs = require('fs')
const path = require('path')

const { vol } = require('memfs')
const { signAddon } = require('sign-addon')

const { publish } = require('../src')

describe('publish', () => {
    const mockManifestJSON = {
        manifest_version: 2,
        name: 'Mock Extension',
        version: '0.0.1',
    }
    const extensionId = '{01234567-abcd-6789-cdef-0123456789ef}'
    const targetXpi = 'target-extension.xpi'
    const mockOptions = {
        artifactsDir: 'mock_artifacts',
        channel: 'unlisted',
        manifestPath: 'manifest.json',
        sourceDir: 'mock_source',
    }
    const completeOptions = { extensionId, targetXpi, ...mockOptions }
    const mockAddonSignFailed = { success: false }
    const mockAddonSignSuccess = { success: true, id: extensionId }
    const clearMockArtifacts = () => {
        const actualFs = jest.requireActual('fs')
        if (actualFs.existsSync(mockOptions.artifactsDir)) {
            actualFs.rmdirSync(mockOptions.artifactsDir, { recursive: true })
        }
    }

    beforeAll(() => {
        jest.spyOn(console, 'log')
    })
    beforeEach(() => {
        vol.fromJSON({
            [path.join(mockOptions.sourceDir, mockOptions.manifestPath)]:
                JSON.stringify(mockManifestJSON),
        })
    })
    afterEach(() => {
        vol.reset()
        clearMockArtifacts()
        jest.clearAllMocks()
    })
    afterAll(() => {
        jest.restoreAllMocks()
    })

    it('fails if targetXpi is not given', () => {
        return expect(publish(mockOptions)).rejects.toThrow(
            'targetXpi is missing',
        )
    })

    it.each`
        signCase                                               | signResults
        ${'signing unsuccessful'}                              | ${mockAddonSignFailed}
        ${'auto signing unsuccessful and channel is unlisted'} | ${{ ...mockAddonSignFailed, errorCode: 'ADDON_NOT_AUTO_SIGNED' }}
    `('raises error if $signCase', ({ signResults }) => {
        signAddon.mockResolvedValueOnce(signResults)
        return expect(publish(completeOptions)).rejects.toThrow(
            'The extension could not be signed',
        )
    })

    it('uses unsigned xpi if auto signing unsuccessful and channel is listed', async () => {
        signAddon.mockResolvedValueOnce({
            ...mockAddonSignFailed,
            errorCode: 'ADDON_NOT_AUTO_SIGNED',
        })
        const targetXpiPath = path.join(mockOptions.artifactsDir, targetXpi)
        expect(fs.existsSync(targetXpiPath)).toBe(false)
        await publish({
            ...completeOptions,
            channel: 'listed',
        })
        expect(fs.existsSync(targetXpiPath)).toBe(true)
    })

    it('renames downloaded file to target xpi', async () => {
        const downloadedFile = 'mock_downloaded.xpi'
        const mockFileContent = 'some fake signed xpi'
        const downloadedFilePath = path.join(
            mockOptions.artifactsDir,
            downloadedFile,
        )
        vol.fromJSON({
            [downloadedFilePath]: mockFileContent,
        })
        signAddon.mockResolvedValueOnce({
            ...mockAddonSignSuccess,
            downloadedFiles: [downloadedFilePath],
        })
        const targetXpiPath = path.join(mockOptions.artifactsDir, targetXpi)
        expect(fs.existsSync(targetXpiPath)).toBe(false)
        await publish(completeOptions)
        expect(fs.readFileSync(targetXpiPath).toString()).toEqual(
            mockFileContent,
        )
    })
})
