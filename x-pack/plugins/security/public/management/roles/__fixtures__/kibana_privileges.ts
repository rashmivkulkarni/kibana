/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { KibanaFeature } from '../../../../../features/public';
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
import { featuresPluginMock } from '../../../../../features/server/mocks';
import type { SecurityLicenseFeatures } from '../../../../common/licensing';
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
import { Actions } from '../../../../server/authorization';
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
import { privilegesFactory } from '../../../../server/authorization/privileges';
import { KibanaPrivileges } from '../model';

export const createRawKibanaPrivileges = (
  features: KibanaFeature[],
  { allowSubFeaturePrivileges = true } = {}
) => {
  const featuresService = featuresPluginMock.createSetup();
  featuresService.getKibanaFeatures.mockReturnValue(features);

  const licensingService = {
    getFeatures: () => ({ allowSubFeaturePrivileges } as SecurityLicenseFeatures),
    getType: () => 'basic' as const,
  };

  return privilegesFactory(
    new Actions('unit_test_version'),
    featuresService,
    licensingService
  ).get();
};

export const createKibanaPrivileges = (
  features: KibanaFeature[],
  { allowSubFeaturePrivileges = true } = {}
) => {
  return new KibanaPrivileges(
    createRawKibanaPrivileges(features, { allowSubFeaturePrivileges }),
    features
  );
};
