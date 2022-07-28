/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import {
  CreateEnvironmentTypeSchema,
  EnvironmentTypeService,
  isEnvironmentTypeStatus,
  ENVIRONMENT_TYPE_STATUS,
  UpdateEnvironmentTypeSchema
} from '@amzn/environments';
import Boom from '@hapi/boom';
import { Request, Response, Router } from 'express';
import { wrapAsync } from './errorHandlers';

export function setUpEnvTypeRoutes(router: Router, environmentTypeService: EnvironmentTypeService): void {
  // Create envType
  router.post(
    '/environmentTypes',
    wrapAsync(async (req: Request, res: Response) => {
      const { status } = req.body;
      if (!isEnvironmentTypeStatus(status)) {
        throw Boom.badRequest(
          `Status provided is: ${status}. Status needs to be one of these values: ${ENVIRONMENT_TYPE_STATUS}`
        );
      }
      // TODO: Get user information from req context once Auth has been integrated
      const user = {
        role: 'admin',
        ownerId: 'owner-123'
      };
      const envType = await environmentTypeService.createNewEnvironmentType(user.ownerId, {
        ...req.body
      });
      res.status(201).send(envType);
    })
  );

  // Get envType
  router.get(
    '/environmentTypes/:id',
    wrapAsync(async (req: Request, res: Response) => {
      const envType = await environmentTypeService.getEnvironmentType(req.params.id);
      res.send(envType);
    })
  );

  // Get envTypes
  router.get(
    '/environmentTypes',
    wrapAsync(async (req: Request, res: Response) => {
      const { paginationToken, pageSize } = req.query;
      if ((paginationToken && typeof paginationToken !== 'string') || (pageSize && Number(pageSize) <= 0)) {
        res
          .status(400)
          .send('Invalid pagination token and/or page size. Please try again with valid inputs.');
      } else {
        const envType = await environmentTypeService.listEnvironmentTypes(
          pageSize ? Number(pageSize) : undefined,
          paginationToken
        );
        res.send(envType);
      }
    })
  );

  // Update envTypes
  router.put(
    '/environmentTypes/:id',
    wrapAsync(async (req: Request, res: Response) => {
      // TODO: Get user information from req context once Auth has been integrated
      const user = {
        role: 'admin',
        ownerId: 'owner-123'
      };
      const { status } = req.body;
      if (!isEnvironmentTypeStatus(status)) {
        throw Boom.badRequest(
          `Status provided is: ${status}. Status needs to be one of these values: ${ENVIRONMENT_TYPE_STATUS}`
        );
      }
      const envType = await environmentTypeService.updateEnvironmentType(
        user.ownerId,
        req.params.id,
        req.body
      );
      res.status(200).send(envType);
    })
  );

  // Get environmentTypes
  router.get(
    '/products',
    wrapAsync(async (req: Request, res: Response) => {
      const { paginationToken } = req.query; //body.paginationToken;
      if (paginationToken && typeof paginationToken !== 'string') {
        throw Boom.badRequest('Invalid pagination token. Please try again with valid inputs.');
      }
      const response = await environmentTypeService.getProducts(paginationToken);
      res.status(200).send(response);
    })
  );
}
