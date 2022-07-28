/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import {
  ServiceCatalog,
  ListPortfoliosCommandInput,
  PortfolioDetail,
  SearchProductsAsAdminCommandInput
} from '@aws-sdk/client-service-catalog';

export default class ServiceCatalogService {
  private _serviceCatalog: ServiceCatalog;
  public constructor(serviceCatalog: ServiceCatalog) {
    this._serviceCatalog = serviceCatalog;
  }

  /**
   * Get portfolioId of a portfolio
   * @param portfolioName - name of the portfolio
   */
  public async getPortfolioId(portfolioName: string): Promise<string | undefined> {
    let portfolioDetails: PortfolioDetail[] = [];
    let pageToken: string | undefined = undefined;
    // Get all portfolios in the account
    do {
      const listPortfolioInput: ListPortfoliosCommandInput = {
        PageToken: pageToken,
        PageSize: 20
      };
      const listPortfolioOutput = await this._serviceCatalog.listPortfolios(listPortfolioInput);
      pageToken = listPortfolioOutput.NextPageToken;
      if (listPortfolioOutput.PortfolioDetails) {
        portfolioDetails = portfolioDetails.concat(listPortfolioOutput.PortfolioDetails);
      }
    } while (pageToken);

    // Find the SWB portfolio
    const portfolio = portfolioDetails.find((portfolio: PortfolioDetail) => {
      return portfolio.DisplayName === portfolioName;
    });

    return portfolio ? portfolio.Id : undefined;
  }

  public async listServiceCatalogProducts(
    portfolioId: string,
    paginationToken?: string
  ): Promise<any | undefined> {
    let products: any[] = [];
    let nextPageToken;
    const listSCProductsInput: SearchProductsAsAdminCommandInput = {
      PortfolioId: portfolioId,
      PageToken: paginationToken,
      PageSize: 20
    };
    const response = await this._serviceCatalog.searchProductsAsAdmin(listSCProductsInput);

    if (response && response.ProductViewDetails) {
      products = response.ProductViewDetails.map((item) => {
        return {
          name: item.ProductViewSummary?.Name,
          description: item.ProductViewSummary?.ShortDescription
        };
      });
      if (response.NextPageToken) {
        nextPageToken = response.NextPageToken;
      }
    }
    return { data: products, paginationToken: nextPageToken };
  }
}
