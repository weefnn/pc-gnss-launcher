/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import {
    describeError,
    ErrorDialogActions,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import { inMain } from '../../../ipc/apps';
import { inMain as sources } from '../../../ipc/sources';
import type { AppThunk } from '../../store';
import { handleAppsWithErrors } from '../apps/appsEffects';
import { addDownloadableApps, setAllLocalApps } from '../apps/appsSlice';
import { getShouldCheckForUpdatesAtStartup } from '../settings/settingsSlice';
import { handleSourcesWithErrors } from '../sources/sourcesEffects';
import { setSources } from '../sources/sourcesSlice';
import {
    type ProcessStep,
    runRemainingProcessStepsSequentially,
} from './thunkProcess';
import { startUpdateProcess } from './updateProcess';

const loadSources: ProcessStep = async dispatch => {
    try {
        dispatch(setSources(await sources.getSources()));
    } catch (error) {
        dispatch(
            ErrorDialogActions.showDialog(
                `Unable to load settings: ${describeError(error)}`,
            ),
        );
    }
};

export const loadApps: ProcessStep = async dispatch => {
    try {
        dispatch(setAllLocalApps(await inMain.getLocalApps()));

        const { apps, appsWithErrors, sourcesWithErrors } =
            await inMain.getDownloadableApps();

        dispatch(addDownloadableApps(apps));
        dispatch(handleAppsWithErrors(appsWithErrors));
        dispatch(handleSourcesWithErrors(sourcesWithErrors));
    } catch (error) {
        dispatch(ErrorDialogActions.showDialog(describeError(error)));
    }
};

let currentProcessSteps: ProcessStep[] = [];

export const startLauncherInitialisation =
    (): AppThunk => (dispatch, getState) => {
        currentProcessSteps = [loadSources, loadApps];

        if (getShouldCheckForUpdatesAtStartup(getState())) {
            currentProcessSteps.push(startUpdateProcess(false));
        }

        dispatch(continueLauncherInitialisation());
    };

export const continueLauncherInitialisation = (): AppThunk => dispatch => {
    dispatch(runRemainingProcessStepsSequentially(currentProcessSteps));
};
