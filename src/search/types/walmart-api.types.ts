export interface WalmartApiResponse {
  query: string;
  sort: string;
  responseGroup: string;
  totalResults: number;
  start: number;
  numItems: number;
  items: WalmartProduct[];
}

export interface WalmartProduct {
  itemId: number;
  parentItemId: number;
  name: string;
  salePrice: number;
  upc: string;
  categoryPath: string;
  shortDescription: string;
  longDescription: string;
  brandName: string;
  thumbnailImage: string;
  mediumImage: string;
  largeImage: string;
  productTrackingUrl: string;
  ninetySevenCentShipping: boolean;
  standardShipRate: number;
  color?: string;
  marketplace: boolean;
  shipToStore: boolean;
  freeShipToStore: boolean;
  modelNumber?: string;
  sellerInfo: string;
  customerRating?: string;
  numReviews?: number;
  categoryNode: string;
  rhid?: string;
  bundle: boolean;
  clearance: boolean;
  preOrder: boolean;
  stock?: string;
  freight: boolean;
  attributes?: Record<string, any>;
  affiliateAddToCartUrl: string;
  freeShippingOver35Dollars: boolean;
  maxItemsInOrder?: number;
  giftOptions?: Record<string, any>;
  imageEntities: {
    thumbnailImage: string;
    mediumImage: string;
    largeImage: string;
    entityType: string;
  }[];
  offerType: string;
  isTwoDayShippingEligible: boolean;
  availableOnline: boolean;
  offerId: string;
  warnings?: {
    Attribute: string;
    DisplayName: string;
    Value: string[];
  }[];
  variants?: number[];
  bestMarketplacePrice?: {
    price: number;
    sellerInfo: string;
    standardShipRate: number;
    twoThreeDayShippingRate: number;
    availableOnline: boolean;
    clearance: boolean;
  };
  gender?: string;
  size?: string;
  msrp?: number;
}

export interface WalmartSearchOptions {
  query: string;
  sort?: string;
  order?: 'asc' | 'desc';
  numItems?: number;
  start?: number;
  responseGroup?: string;
  facet?: string;
  'facet.filter'?: string;
  'facet.range'?: string;
}

export function parseWalmartProducts(apiResponse: any): WalmartProduct[] {
  const response = apiResponse as WalmartApiResponse;
  return response.items || [];
}
