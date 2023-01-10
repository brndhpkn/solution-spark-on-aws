#!/usr/bin/env node

/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { App, Aspects } from 'aws-cdk-lib';
import { AwsSolutionsChecks } from 'cdk-nag';
import { AppRegister } from './app-registry';
import { ExampleStack } from './example-stack';

const app: App = new cdk.App();

// eslint-disable-next-line no-new
const exampleStack: ExampleStack = new ExampleStack(app, 'ExampleStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  }
});

// eslint-disable-next-line no-new
new AppRegister(exampleStack, exampleStack.stackId, {
  solutionId: 'E001',
  solutionName: 'ExampleApp',
  solutionVersion: '0.0.1',
  attributeGroupName: 'ExampleApp-Metadata',
  applicationType: 'External',
  appRegistryApplicationName: 'ExampleApp'
});

Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));
