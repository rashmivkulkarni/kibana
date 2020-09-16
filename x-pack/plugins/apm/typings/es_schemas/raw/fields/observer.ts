/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

export interface Observer {
  ephemeral_id?: string;
  hostname?: string;
  id?: string;
  name?: string;
  type?: string;
  version: string;
  version_major: number;
}
