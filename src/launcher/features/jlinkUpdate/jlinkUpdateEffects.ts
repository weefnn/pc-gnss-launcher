/*
 * Copyright (c) 2022 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { inMain } from '../../../ipc/jlink';
import { type AppThunk } from '../../store';
import { updateAvailable } from './jlinkUpdateSlice';

const shouldCheckJLink = () => process.env.PCTOOL_DISABLE_JLINK === '0';

export const checkForJLinkUpdate =
    ({
        checkOnline,
    }: {
        checkOnline: boolean;
    }): AppThunk<Promise<{ isUpdateAvailable: boolean }>> =>
    dispatch => {
        if (!shouldCheckJLink()) {
            return Promise.resolve({ isUpdateAvailable: false });
        }

        return inMain.getJLinkState({ checkOnline }).then(s => {
            const isUpdateAvailable =
                s.status === 'not installed' ||
                s.status === 'should be updated';

            if (isUpdateAvailable) {
                dispatch(
                    updateAvailable({
                        versionToBeInstalled: s.versionToBeInstalled,
                        installedVersion:
                            s.status === 'should be updated'
                                ? s.installedVersion
                                : undefined,
                    }),
                );
            }

            return { isUpdateAvailable };
        });
    };
