/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { IVpc, SubnetSelection } from 'aws-cdk-lib/aws-ec2';
import { ApplicationLoadBalancer } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export interface SWBApplicationLoadBalancerProps {
  vpc: IVpc;
  subnets: SubnetSelection;
  internetFacing: boolean;
  accessLogsBucket: Bucket;
}

export class SWBApplicationLoadBalancer extends Construct {
  public readonly applicationLoadBalancer: ApplicationLoadBalancer;

  public constructor(scope: Construct, id: string, props: SWBApplicationLoadBalancerProps) {
    const { vpc, subnets, internetFacing, accessLogsBucket } = props;
    super(scope, id);

    this.applicationLoadBalancer = new ApplicationLoadBalancer(this, id, {
      vpc,
      vpcSubnets: subnets,
      internetFacing
    });
    this.applicationLoadBalancer.logAccessLogs(accessLogsBucket);
  }
}
