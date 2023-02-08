/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { SWBApplicationLoadBalancer, SWBApplicationLoadBalancerProps } from './SWBApplicationLoadBalancer';

describe('SWBApplicationLoadBalancer tests', () => {
  it('has the correct alb properties when given no subnets', () => {
    const stack = new Stack();
    const swbApplicationLoadBalancerProps: SWBApplicationLoadBalancerProps = {
      vpc: new Vpc(stack, 'testVPC'),
      subnets: {},
      internetFacing: true,
      accessLogsBucket: new Bucket(stack, 'testS3AccessLogsBucket', {})
    };
    new SWBApplicationLoadBalancer(stack, 'TestSWBApplicationLoadBalancer', swbApplicationLoadBalancerProps);
    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::ElasticLoadBalancingV2::LoadBalancer', 1);
    template.hasResourceProperties('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      LoadBalancerAttributes: [
        {
          Key: 'deletion_protection.enabled',
          Value: 'false'
        }
      ],
      Scheme: 'internet-facing',
      Type: 'application'
    });
    template.resourceCountIs('AWS::EC2::SecurityGroup', 1);
    template.hasResourceProperties('AWS::EC2::SecurityGroup', {
      SecurityGroupEgress: [
        {
          CidrIp: '255.255.255.255/32',
          Description: 'Disallow all traffic',
          FromPort: 252,
          IpProtocol: 'icmp',
          ToPort: 86
        }
      ]
    });
  });

  it('has the correct alb properties when given public subnets', () => {
    const stack = new Stack();
    const vpc = new Vpc(stack, 'testVPC');
    const swbApplicationLoadBalancerProps: SWBApplicationLoadBalancerProps = {
      vpc: vpc,
      subnets: vpc.selectSubnets({ subnetType: SubnetType.PUBLIC }),
      internetFacing: true,
      accessLogsBucket: new Bucket(stack, 'testS3AccessLogsBucket', {})
    };
    new SWBApplicationLoadBalancer(stack, 'TestSWBApplicationLoadBalancer', swbApplicationLoadBalancerProps);
    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::ElasticLoadBalancingV2::LoadBalancer', 1);
    template.hasResourceProperties('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      LoadBalancerAttributes: [
        {
          Key: 'deletion_protection.enabled',
          Value: 'false'
        }
      ],
      Scheme: 'internet-facing',
      Type: 'application'
    });
    template.resourceCountIs('AWS::EC2::SecurityGroup', 1);
    template.hasResourceProperties('AWS::EC2::SecurityGroup', {
      SecurityGroupEgress: [
        {
          CidrIp: '255.255.255.255/32',
          Description: 'Disallow all traffic',
          FromPort: 252,
          IpProtocol: 'icmp',
          ToPort: 86
        }
      ]
    });
  });

  it('has the correct alb properties when given private subnets and internetFacing as false', () => {
    const stack = new Stack();
    const vpc = new Vpc(stack, 'testVPC');
    const swbApplicationLoadBalancerProps: SWBApplicationLoadBalancerProps = {
      vpc: vpc,
      subnets: vpc.selectSubnets({ subnetType: SubnetType.PRIVATE_WITH_NAT }),
      internetFacing: false,
      accessLogsBucket: new Bucket(stack, 'testS3AccessLogsBucket', {})
    };
    new SWBApplicationLoadBalancer(stack, 'TestSWBApplicationLoadBalancer', swbApplicationLoadBalancerProps);
    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::ElasticLoadBalancingV2::LoadBalancer', 1);
    template.hasResourceProperties('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      LoadBalancerAttributes: [
        {
          Key: 'deletion_protection.enabled',
          Value: 'false'
        }
      ],
      Scheme: 'internal',
      Type: 'application'
    });
    template.resourceCountIs('AWS::EC2::SecurityGroup', 1);
    template.hasResourceProperties('AWS::EC2::SecurityGroup', {
      SecurityGroupEgress: [
        {
          CidrIp: '255.255.255.255/32',
          Description: 'Disallow all traffic',
          FromPort: 252,
          IpProtocol: 'icmp',
          ToPort: 86
        }
      ]
    });
  });
});
