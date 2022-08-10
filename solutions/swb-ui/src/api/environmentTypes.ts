/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import useSWR from 'swr';
import { httpApiGet } from './apiHelper';
import { EnvTypeItem } from '../models/EnvironmentType';
import { EnvironmentsQueryParams } from '../models/Environment';
import { AWSSCProductItem } from '../models/EnvironmentTypeConfig';
import { convertToRecord } from '../common/utils';

const useEnvironmentType = () => {
  const { data, isValidating } = useSWR(`environmentTypes`, httpApiGet);
  const envTypes: EnvTypeItem[] = ((data && data.data) || []).filter(
    (t: EnvTypeItem) => t.status === 'APPROVED'
  );
  return { envTypes, areEnvTypesLoading: isValidating };
};

const useProducts = (params?: EnvironmentsQueryParams) => {
  let queryString = new URLSearchParams(convertToRecord(params)).toString();
  queryString = queryString ? `?${queryString}` : '';
  const { data, mutate, isValidating } = useSWR(`environmentTypes${queryString}`, httpApiGet);

  // `/environmentTypes` API returns a JSON in this format
  // { data: [], paginationToken: ''}
  // The paginationToken attribute is only provided if there are more than one page of result
  const products = (data && data.data) || [];
  products.forEach((item: AWSSCProductItem) => {
    item.name = item.name;
    item.description = item.description;
  });
  return {
    products,
    mutate,
    paginationToken: data && data.paginationToken,
    areProductsLoading: isValidating
  };
};
export { useEnvironmentType };
export { useProducts };
