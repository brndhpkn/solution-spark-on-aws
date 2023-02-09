/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

/* eslint-disable no-new */
import * as cdk from 'aws-cdk-lib';
import { Aspects } from 'aws-cdk-lib';
import { AwsSolutionsChecks, NagSuppressions } from 'cdk-nag';
import { SWBStack } from './SWBStack';

const app: cdk.App = new cdk.App();
const stack: SWBStack = new SWBStack(app);
Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));

NagSuppressions.addStackSuppressions(stack, [
  {
    id: 'AwsSolutions-COG1',
    reason:
      "By design. Users are encouraged to change the Security Mode to what best suits their organization's needs"
  },
  {
    id: 'AwsSolutions-COG2',
    reason:
      "By design. Users are encouraged to change the Security Mode to what best suits their organization's needs"
  },
  {
    id: 'AwsSolutions-COG3',
    reason:
      "By design. Users are encouraged to change the Security Mode to what best suits their organization's needs"
  },
  {
    id: 'AwsSolutions-EC23',
    reason: 'By design, users can access the ALB domain from any machine IP'
  },
  {
    id: 'AwsSolutions-APIG1',
    reason: 'TODO:triage come back and fill the suppression reason'
  },
  {
    id: 'AwsSolutions-APIG2',
    reason: 'TODO:triage come back and fill the suppression reason'
  },
  {
    id: 'AwsSolutions-APIG3',
    reason: 'TODO:triage come back and fill the suppression reason'
  },
  {
    id: 'AwsSolutions-APIG4',
    reason: 'TODO:triage come back and fill the suppression reason'
  },
  {
    id: 'AwsSolutions-APIG6',
    reason: 'TODO:triage come back and fill the suppression reason'
  },
  {
    id: 'AwsSolutions-COG4',
    reason: 'TODO:triage come back and fill the suppression reason'
  },
  {
    id: 'AwsSolutions-DDB3',
    reason: 'TODO:triage come back and fill the suppression reason'
  },
  {
    id: 'AwsSolutions-IAM4',
    reason: 'TODO:triage come back and fill the suppression reason'
  },
  {
    id: 'AwsSolutions-IAM5',
    reason: 'TODO:triage come back and fill the suppression reason'
  },
  {
    id: 'AwsSolutions-KMS5',
    reason: 'TODO:triage come back and fill the suppression reason'
  },
  {
    id: 'AwsSolutions-L1',
    reason: 'TODO:triage come back and fill the suppression reason'
  },
  {
    id: 'AwsSolutions-S1',
    reason: 'TODO:triage come back and fill the suppression reason'
  },
  {
    id: 'AwsSolutions-S2',
    reason: 'TODO:triage come back and fill the suppression reason'
  },
  {
    id: 'AwsSolutions-S3',
    reason: 'TODO:triage come back and fill the suppression reason'
  },
  {
    id: 'AwsSolutions-S5',
    reason: 'TODO:triage come back and fill the suppression reason'
  },
  {
    id: 'AwsSolutions-S10',
    reason: 'TODO:triage come back and fill the suppression reason'
  },
  // ------ Below are warnings created by Solutions pipeline CFN nag
  {
    id: 'W68',
    reason: 'TODO: Enable on Usage plan for API Gateway'
  },
  {
    id: 'W33',
    reason: 'TODO: EC2 Subnet should not have MapPublicIpOnLaunch set to true'
  },
  {
    id: 'W55',
    reason: 'TODO: Elastic Load Balancer V2 Listener SslPolicy should use TLS 1.2'
  },
  {
    id: 'W12',
    reason: 'TODO: IAM policy should not allow * resource'
  },
  {
    id: 'W29',
    reason: 'TODO: Security Groups found egress with port range instead of just a single port'
  },
  {
    id: 'W9',
    reason: 'TODO: Security Groups found with ingress cidr that is not /32'
  },
  {
    id: 'W2',
    reason:
      'TODO: Security Groups found with cidr open to world on ingress.  This should never be true on instance.  Permissible on ELB.'
  }
]);

app.synth();
