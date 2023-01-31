/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

export interface DeleteParams {
  key: { [key: string]: unknown };
  params?: {
    condition?: string;
    names?: { [key: string]: string };
    values?: { [key: string]: unknown };
    return?: 'NONE' | 'ALL_OLD';
    capacity?: 'INDEXES' | 'TOTAL' | 'NONE';
    metrics?: 'NONE' | 'SIZE';
  };
}
