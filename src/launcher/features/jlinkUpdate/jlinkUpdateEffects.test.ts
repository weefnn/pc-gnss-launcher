/*
 * Copyright (c) 2026 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { inMain } from '../../../ipc/jlink';

import { checkForJLinkUpdate } from './jlinkUpdateEffects';

jest.mock('../../../ipc/jlink', () => ({
    inMain: {
        getJLinkState: jest.fn(),
    },
}));

describe('checkForJLinkUpdate', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        delete process.env.PCTOOL_DISABLE_JLINK;

        jest.mocked(inMain.getJLinkState).mockResolvedValue({
            status: 'not installed',
            versionToBeInstalled: '9.24a',
        } as never);
    });

    it('skips jlink checks by default for this fork', async () => {
        const dispatch = jest.fn();
        const getState = jest.fn();

        const result = await checkForJLinkUpdate({
            checkOnline: false,
        })(dispatch as never, getState as never, undefined as never);

        expect(result).toEqual({ isUpdateAvailable: false });
        expect(inMain.getJLinkState).not.toHaveBeenCalled();
        expect(dispatch).not.toHaveBeenCalled();
    });
});
