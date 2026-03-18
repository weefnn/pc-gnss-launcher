/*
 * Copyright (c) 2015 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import path from 'path';

import { type DisplayedApp } from '../appsSlice';

const AppIcon: React.FC<{ app: DisplayedApp }> = ({ app }) => (
    <div className="core-app-icon">
        {app.iconPath ? (
            <img
                src={app.iconPath
                    .split(path.sep)
                    .map((val, index) =>
                        // Don't encode Windows `<drive>:`
                        process.platform === 'win32' && index === 0
                            ? val
                            : encodeURIComponent(val),
                    )
                    .join(path.sep)}
                alt=""
                draggable={false}
            />
        ) : (
            <div className="icon-replacement" />
        )}
    </div>
);
export default AppIcon;
