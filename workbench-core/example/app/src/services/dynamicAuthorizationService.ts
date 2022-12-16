/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { DynamicAuthorizationService, WBCGroupManagementPlugin } from '@aws/workbench-core-authorization';

import { userManagementService } from './userManagementService';

export const dynamicAuthorizationService = new DynamicAuthorizationService(
  new WBCGroupManagementPlugin(userManagementService)
);
