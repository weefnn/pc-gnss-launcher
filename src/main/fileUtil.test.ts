/*
 * Copyright (c) 2026 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import fs from 'fs';

import { listDirectories } from './fileUtil';

jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    existsSync: jest.fn(),
    readdirSync: jest.fn(),
    statSync: jest.fn(),
    lstatSync: jest.fn(),
    unlinkSync: jest.fn(),
}));

describe('listDirectories', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deletes broken symlinks and continues without throwing ENOENT', () => {
        jest.mocked(fs.existsSync).mockReturnValue(true);
        jest.mocked(fs.readdirSync).mockReturnValue([
            'pc-gnss-terminal',
            'valid-app',
            '.hidden-app',
        ] as unknown as ReturnType<typeof fs.readdirSync>);
        jest.mocked(fs.statSync).mockImplementation(path => {
            if (path === '/apps/local/pc-gnss-terminal') {
                const error = Object.assign(new Error('ENOENT'), {
                    code: 'ENOENT',
                });
                throw error;
            }

            return {
                isDirectory: () => true,
            } as unknown as ReturnType<typeof fs.statSync>;
        });
        jest.mocked(fs.lstatSync).mockImplementation(
            path =>
                ({
                    isSymbolicLink: () =>
                        path === '/apps/local/pc-gnss-terminal',
                }) as unknown as ReturnType<typeof fs.lstatSync>,
        );

        let result: string[] = [];
        expect(() => {
            result = listDirectories('/apps/local');
        }).not.toThrow();
        expect(fs.unlinkSync).toHaveBeenCalledWith(
            '/apps/local/pc-gnss-terminal',
        );
        expect(result).toEqual(['valid-app']);
    });
});
