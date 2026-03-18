/*
 * Copyright (c) 2026 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { installJLink as install } from '@nordicsemiconductor/nrf-jlink-js';
import fs from 'fs';

import { getUnpackedBundledResourcePath } from './config';
import { installJLink } from './jlink';

jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    existsSync: jest.fn(),
    readdirSync: jest.fn(),
}));

jest.mock('@nordicsemiconductor/nrf-jlink-js', () => ({
    downloadAndInstallJLink: jest.fn(),
    getJLinkState: jest.fn(),
    installJLink: jest.fn(),
}));

jest.mock('./bundledJlink', () => '9.0.0');

jest.mock('./config', () => ({
    getUnpackedBundledResourcePath: jest.fn(),
}));

jest.mock('../ipc/jlinkProgress', () => ({
    inRenderer: {
        updateJLinkProgress: jest.fn(),
    },
}));

describe('installJLink', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.mocked(getUnpackedBundledResourcePath).mockReturnValue(
            '/tmp/prefetched/jlink',
        );
    });

    it('does not throw when offline bundled jlink folder is missing', async () => {
        jest.mocked(fs.existsSync).mockReturnValue(false);

        await expect(installJLink(true)).resolves.toBeUndefined();
        expect(install).not.toHaveBeenCalled();
    });
});
