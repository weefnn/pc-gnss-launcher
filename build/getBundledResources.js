/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

const { rmSync } = require('fs');
const path = require('path');
const { default: bundleApps } = require('./bundleApps');
const { default: getJlink } = require('./getJlink');

exports.default = async () => {
    rmSync(path.join('resources', 'prefetched'), {
        force: true,
        recursive: true,
    });

    // GNSS launcher default: do not depend on Nordic prefetch resources.
    if (process.env.PCGNSS_BUNDLE_NORDIC !== '1') {
        return;
    }

    await Promise.allSettled([getJlink(), bundleApps()]);
};
