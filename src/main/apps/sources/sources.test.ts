/*
 * Copyright (c) 2026 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import fs from 'fs';

import { getAppsRootDir, getBundledResourcePath } from '../../config';
import { ensureBundledSourceExists } from './sources';

jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    existsSync: jest.fn(),
    copyFileSync: jest.fn(),
    readdirSync: jest.fn(),
}));

jest.mock('../../config', () => ({
    getAppsRootDir: jest.fn(),
    getBundledResourcePath: jest.fn(),
    getNodeModulesDir: jest.fn(),
}));

describe('ensureBundledSourceExists', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        jest.mocked(getAppsRootDir).mockReturnValue('/tmp/apps');
        jest.mocked(getBundledResourcePath).mockImplementation(
            (...paths: string[]) => `/tmp/${paths.join('/')}`,
        );
    });

    it('does not throw when prefetched folder is missing', () => {
        jest.mocked(fs.existsSync).mockImplementation(
            path => path !== '/tmp/prefetched',
        );
        jest.mocked(fs.readdirSync).mockImplementation(() => {
            const error = Object.assign(new Error('ENOENT'), {
                code: 'ENOENT',
            });
            throw error;
        });

        expect(() => ensureBundledSourceExists()).not.toThrow();
    });
});
