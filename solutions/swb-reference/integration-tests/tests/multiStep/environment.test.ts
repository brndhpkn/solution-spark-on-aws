/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */
import ClientSession from '../../support/clientSession';
import Setup from '../../support/setup';
import { uuidRegExp } from '../../support/utils/regExpressions';

describe('multiStep environment test', () => {
  const setup: Setup = new Setup();
  let adminSession: ClientSession;

  beforeAll(async () => {
    adminSession = await setup.getDefaultAdminSession();
  });

  afterAll(async () => {
    await setup.cleanup();
  });

  test('launch, connect, stop, get, terminate', async () => {
    const { data: environmentA } = await adminSession.resources.environments.create();
    expect(environmentA).toMatchObject({
      id: expect.stringMatching(uuidRegExp),
      instanceId: '', // empty string because instanceId value has not been propagated by statusHandler yet
      provisionedProductId: '', // empty string because provisionedProductId  has not been propagated by statusHandler yet
      status: 'PENDING',
      ETC: expect.anything(), //ETC should be defined
      PROJ: expect.anything() // PROJ should be defined
    });

    const { data: environmentB } = await adminSession.resources.environments.create();
    expect(environmentB).toMatchObject({
      id: expect.stringMatching(uuidRegExp),
      instanceId: '', // empty string because instanceId value has not been propagated by statusHandler yet
      provisionedProductId: '', // empty string because provisionedProductId  has not been propagated by statusHandler yet
      status: 'PENDING',
      ETC: expect.anything(), //ETC should be defined
      PROJ: expect.anything() // PROJ should be defined
    });

    // await adminSession.resources.environments.environment(environmentA.id).connect();
    // await adminSession.resources.environments.environment(environmentA.id).stop();
    // await adminSession.resources.environments.get({name: environmentA.name, ascending: "name"});
    // await adminSession.resources.environments.get({status: environmentA.status, ascending: "status"});
    // await adminSession.resources.environments.get({createdAtFrom: environmentA.createdAt, createdAtTo: environmentA.createdAt, ascending: "createdAt"});
    // await adminSession.resources.environments.get({owner: environmentA.owner, ascending: "owner"});
    // await adminSession.resources.environments.environment(environmentA.id).start();
    // await adminSession.resources.environments.environment(environmentA.id).terminate();
    // await adminSession.resources.environments.environment(environmentB.id).terminate();
    // await adminSession.resources.environments.get({});
  });
});
