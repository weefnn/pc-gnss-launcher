/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import {
    describeError,
    ErrorDialogActions,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import type { AppThunk } from '../../store';
import { downloadLatestAppInfos as downloadLatestAppInfosEffect } from '../apps/appsEffects';
import { checkForLauncherUpdate as checkForLauncherUpdateEffect } from '../launcherUpdate/launcherUpdateEffects';
import { showUpdateCheckComplete } from '../settings/settingsSlice';
import {
    type ProcessStep,
    runRemainingProcessStepsSequentially,
} from './thunkProcess';

const checkForLauncherUpdate: ProcessStep = async dispatch => {
    if (process.env.NODE_ENV !== 'development') {
        await dispatch(checkForLauncherUpdateEffect());
    }
};

const downloadLatestAppInfo =
    (showDialogOnComplete: boolean): ProcessStep =>
    async dispatch => {
        try {
            await dispatch(downloadLatestAppInfosEffect());
            if (showDialogOnComplete) {
                dispatch(showUpdateCheckComplete());
            }
        } catch (error) {
            dispatch(
                ErrorDialogActions.showDialog(
                    `Unable to check for updates: ${describeError(error)}`,
                ),
            );
        }
    };

let currentProcessSteps: ProcessStep[] = [];

export const startUpdateProcess =
    (showDialogOnComplete: boolean): AppThunk =>
    dispatch => {
        currentProcessSteps = [
            checkForLauncherUpdate,
            downloadLatestAppInfo(showDialogOnComplete),
        ];
        dispatch(continueUpdateProcess());
    };

export const continueUpdateProcess = (): AppThunk => dispatch => {
    dispatch(runRemainingProcessStepsSequentially(currentProcessSteps));
};
