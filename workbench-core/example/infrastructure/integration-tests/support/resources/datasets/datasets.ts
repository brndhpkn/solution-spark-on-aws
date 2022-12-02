/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */
import { AxiosResponse } from 'axios';
import ClientSession from '../../clientSession';
import RandomTextGenerator from '../../utils/randomTextGenerator';
import CollectionResource from '../base/collectionResource';
import Dataset, { DataSetCreateParams } from './dataset';

export default class Datasets extends CollectionResource {
  public constructor(clientSession: ClientSession) {
    super(clientSession, 'datasets', 'dataset');
    this._api = 'datasets';
  }

  public dataset(params: Omit<DataSetCreateParams, 'clientSession' | 'parentApi'>): Dataset {
    return new Dataset({ ...params, clientSession: this._clientSession, parentApi: this._parentApi });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async create(body: any = {}, applyDefault: boolean = true): Promise<AxiosResponse> {
    // Because of the cleanup logic, before we do the create, we need to ensure that the extender of this collection
    // resource class has a method that returns the resource operations helper for the child resource.
    // For example, if the extender class is 'Users' and it provides childType = 'user', then Users class must have
    // a method called 'user()'.
    const requestBody = applyDefault ? this._buildDefaults(body) : body;
    const response: AxiosResponse = await this._axiosInstance.post(this._api, requestBody);

    const createParams = {
      id: response.data.id,
      awsAccountId: response.data.awsAccountId,
      storageName: response.data.storageName,
      storagePath: response.data.path
    };
    const taskId = `${this._childType}-${createParams.id}`;
    const resourceNode = this.dataset(createParams);
    this.children.set(resourceNode.id, resourceNode);
    // We add a cleanup task to the cleanup queue for the session
    this._clientSession.addCleanupTask({ id: taskId, task: async () => resourceNode.cleanup() });

    return response;
  }

  // List call
  public async get(queryParams?: Record<string, string>): Promise<AxiosResponse> {
    if (!queryParams) {
      return this._axiosInstance.get(this._api, { params: queryParams });
    }
    return this._axiosInstance.get(`${this._api}/${queryParams.id}`);
  }

  public async delete(queryParams: Record<string, string>): Promise<AxiosResponse> {
    return this._axiosInstance.delete(`${this._api}/${queryParams.id}`);
  }
  public async import(requestBody: Record<string, string>): Promise<AxiosResponse> {
    return this._axiosInstance.post(`${this._api}/import`, requestBody);
  }
  public async storageLocations(): Promise<AxiosResponse> {
    return this._axiosInstance.get(`${this._api}/storage`);
  }

  protected _buildDefaults(resource: DataSetCreateRequest): DataSetCreateRequest {
    const randomTextGenerator = new RandomTextGenerator(this._settings.get('runId'));
    const dataSetName = randomTextGenerator.getFakeText('test-DS');
    const storageName = this._settings.get('ExampleS3DataSetsBucketName');
    const awsAccountId = this._settings.get('mainAccountId');
    const region = this._settings.get('AwsRegion');

    return {
      datasetName: resource.datasetName ?? dataSetName,
      path: resource.path ?? dataSetName,
      storageName: resource.storageName ?? storageName,
      awsAccountId: resource.awsAccountId ?? awsAccountId,
      region: resource.region ?? region
    };
  }
}

interface DataSetCreateRequest {
  datasetName: string;
  storageName: string;
  path: string;
  awsAccountId: string;
  region: string;
}
