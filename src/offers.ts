import { XMLParser } from "fast-xml-parser";
import aepOfferXML from "./aepoffers";
import aesOfferXML from "./aesoffer";
import dukeOfers from "./dukeoffers";
import edisonOffers from "./edisonoffers";
import illuminatingOffers from "./illuminatingoffers";
import toledoEdisonOffers from "./toledoedisonoffers";

type OfferJSON = {
  Price: number;
  RateType: string;
  SupplierInfo: {
    SupplierCompanyName: string;
    SupplierWebSiteUrl: string;
  };
  MonthlyFee: string;
  PromotionalOffer: {
    IsPromotionalOffer: string;
  };
  Renewable: string;
  TermLength: number;
};

export const utilityProviders = [
  'AES Ohio', 'AEP', 'Duke Energy', 'Ohio Edison',
  'The Illuminating Company', 'Toledo Edison',
] as const;

export type UtilityProvider = typeof utilityProviders[number];

const ensureExternalLink = (url: string) => url.startsWith('http') ? url : 'https://' + url;

export class Offer {
  supplier: string;
  pricePerkwH: number;
  monthlyPrice: number;
  isVariable: boolean;
  isPromotionalOffer: boolean;
  supplierURL: string;
  renewable: number;
  termLength: number;

  constructor(supplier: string, pricePerkwH: number, monthlyPrice: number,
              variable: boolean, isPromotionalOffer: boolean,
              supplierURL: string, renewable: number, termLength: number) {
      this.supplier = supplier;
      this.pricePerkwH = pricePerkwH;
      this.monthlyPrice = monthlyPrice;
      this.isVariable = variable;
      this.isPromotionalOffer = isPromotionalOffer;
      this.supplierURL = supplierURL;
      this.renewable = renewable;
      this.termLength = termLength;
  }

  static fromXMLString(xml: string): Array<Offer> {
    const parser = new XMLParser({ignoreAttributes: false, attributeNamePrefix: ''});
    const offerDicts = parser.parse(xml)['Offers']['Offer'];
    return offerDicts.map((offer: OfferJSON) => new Offer(
      offer['SupplierInfo']['SupplierCompanyName'],
      offer['Price'],
      parseFloat(offer['MonthlyFee'].substring(1)),
      offer['RateType'] !== 'Fixed',
      offer['PromotionalOffer']['IsPromotionalOffer'] === 'Yes',
      ensureExternalLink(offer['SupplierInfo']['SupplierWebSiteUrl']),
      parseFloat(offer['Renewable']),
      offer['TermLength'],
    ));
  }

  getPrice(kwh: number): number {
      return kwh * this.pricePerkwH + this.monthlyPrice;
  }
}

export function getOffers(utility: UtilityProvider): Array<Offer> {
  const utilityToXML: Map<UtilityProvider, string> = new Map([
    ['AEP', aepOfferXML],
    ['AES Ohio', aesOfferXML],
    ['Duke Energy', dukeOfers],
    ['Ohio Edison', edisonOffers],
    ['The Illuminating Company', illuminatingOffers],
    ['Toledo Edison', toledoEdisonOffers],
  ]);
  return Offer.fromXMLString(utilityToXML.get(utility) ?? '');
}

// Returns an array sorted so that i < j => a[i] "is a better deal than" a[j].
export function bestOffers(usageData: Array<number>,
                           useVariableRates: boolean = false,
                           renewableThreshold: number = 0.0,
                           utility: UtilityProvider = 'AEP'): Array<Offer> {
  return getOffers(utility).
              filter((offer) => (!offer.isVariable || useVariableRates) && !offer.isPromotionalOffer).
              filter((offer) => offer.renewable >= renewableThreshold).
              sort((a, b) => usageData.map((d) => a.getPrice(d)).reduce((x, y) => x + y, 0) -
                              usageData.map((d) => b.getPrice(d)).reduce((x, y) => x + y, 0));
}
