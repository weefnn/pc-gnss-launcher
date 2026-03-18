/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import WithScrollbarContainer from '../../util/WithScrollbarContainer';
import Updates from './Cards/Updates';
import UsageStatistics from './Cards/UsageStatistics';
import UpdateCheckCompleteDialog from './UpdateCheckCompleteDialog';

export default () => (
    <WithScrollbarContainer>
        <div className="settings-pane-container">
            <Updates />
            <UsageStatistics />

            <UpdateCheckCompleteDialog />
        </div>
    </WithScrollbarContainer>
);
