import { XMLParser } from "fast-xml-parser";

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

const offerXML = `
<?xml version="1.0"?>
<Offers>
  <Offer ID="63c244c6-9e06-401e-8c40-9d820964a7a6">
    <SupplierInfo SupplierCompanyName="Santanna Energy Services" CompanyName="Santanna Natural Gas Corporation" SupplierAddress="300 E Business Way, Suite 200" SupplierAddress2="" SupplierCity="Cincinnati" SupplierState="OH" SupplierZip="45241" SupplierPhone="(866) 478-4902" SupplierWebSiteUrl="https://santannaenergyservices.com/offers/?utm_source=energychoice.ohio.gov&amp;utm_medium=referral&amp;utm_campaign=company-url&amp;utm_content=energychoiceohio-green&amp;strategyGuid=bfb309fb-4d87-4666-9cbc-17c05e9a3007" />
    <SupplierLinks TermsOfServiceURL="https://santannaenergyservices.com/offers/?utm_source=energychoice.ohio.gov&amp;utm_medium=referral&amp;utm_campaign=FIX_12M_GRN_T2_CSPOHE&amp;utm_content=energychoiceohio-green&amp;strategyGuid=bfb309fb-4d87-4666-9cbc-17c05e9a3007" SignUpNowURL="https://santannaenergyservices.com/offers/?utm_source=energychoice.ohio.gov&amp;utm_medium=referral&amp;utm_campaign=FIX_12M_GRN_T2_CSPOHE&amp;utm_content=energychoiceohio-green&amp;strategyGuid=bfb309fb-4d87-4666-9cbc-17c05e9a3007" />
    <Price>0.0499</Price>
    <RateType>Fixed</RateType>
    <Renewable>100%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>12</TermLength>
    <EarlyTerminationFee>$100.00</EarlyTerminationFee>
    <MonthlyFee>$25.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Santanna’s 100% Renewable Fixed Price of $0.04990 per kWh for initial term duration of 12 months. AEP Columbus Southern</OfferDetails>
  </Offer>
  <Offer ID="29f4d519-ad48-466f-8999-e61f47dcb899">
    <SupplierInfo SupplierCompanyName="Santanna Energy Services" CompanyName="Santanna Natural Gas Corporation" SupplierAddress="300 E Business Way, Suite 200" SupplierAddress2="" SupplierCity="Cincinnati" SupplierState="OH" SupplierZip="45241" SupplierPhone="(866) 478-4902" SupplierWebSiteUrl="https://santannaenergyservices.com/offers/?utm_source=energychoice.ohio.gov&amp;utm_medium=referral&amp;utm_campaign=company-url&amp;utm_content=energychoiceohio-green&amp;strategyGuid=bfb309fb-4d87-4666-9cbc-17c05e9a3007" />
    <SupplierLinks TermsOfServiceURL="https://santannaenergyservices.com/offers/?utm_source=energychoice.ohio.gov&amp;utm_medium=referral&amp;utm_campaign=FIX_12M_GRN_T2_OPCOHE&amp;utm_content=energychoiceohio-green&amp;strategyGuid=bfb309fb-4d87-4666-9cbc-17c05e9a3007" SignUpNowURL="https://santannaenergyservices.com/offers/?utm_source=energychoice.ohio.gov&amp;utm_medium=referral&amp;utm_campaign=FIX_12M_GRN_T2_OPCOHE&amp;utm_content=energychoiceohio-green&amp;strategyGuid=bfb309fb-4d87-4666-9cbc-17c05e9a3007" />
    <Price>0.0499</Price>
    <RateType>Fixed</RateType>
    <Renewable>100%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>12</TermLength>
    <EarlyTerminationFee>$100.00</EarlyTerminationFee>
    <MonthlyFee>$25.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Santanna’s 100% Renewable Fixed Price of $0.04990 per kWh for initial term duration of 12 months. AEP Ohio Power</OfferDetails>
  </Offer>
  <Offer ID="6f2d9bca-3395-4450-913e-0e2816bc97e0">
    <SupplierInfo SupplierCompanyName="Dynegy Energy Services East LLC" CompanyName="Dynegy Energy Services East LLC" SupplierAddress="6555 Sierra Drive" SupplierAddress2="" SupplierCity="Irving" SupplierState="TX" SupplierZip="75039" SupplierPhone="(833) 277-8471" SupplierWebSiteUrl="https://www.dynegy.com/?rfid=PUCO" />
    <SupplierLinks TermsOfServiceURL="https://www.dynegy.com/terms-of-service/?rfid=PUCO" SignUpNowURL="https://www.dynegy.com/dynegy-shop-for-plans-home?rfid=PUCO" />
    <Price>0.0499</Price>
    <RateType>Variable</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>0</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$9.95</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Enjoy our lowest price today on a monthly variable rate. Includes a base commodity charge of $9.95 / Billing Cycle. Special offer for new, Online customers.</OfferDetails>
  </Offer>
  <Offer ID="23958c70-41fb-4975-a740-db11782d04bc">
    <SupplierInfo SupplierCompanyName="Dynegy Energy Services East LLC" CompanyName="Dynegy Energy Services East LLC" SupplierAddress="6555 Sierra Drive" SupplierAddress2="" SupplierCity="Irving" SupplierState="TX" SupplierZip="75039" SupplierPhone="(833) 277-8471" SupplierWebSiteUrl="https://www.dynegy.com/?rfid=PUCO" />
    <SupplierLinks TermsOfServiceURL="https://www.dynegy.com/terms-of-service/?rfid=PUCO" SignUpNowURL="https://www.dynegy.com/dynegy-shop-for-plans-home?rfid=PUCO" />
    <Price>0.0499</Price>
    <RateType>Variable</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>0</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$9.95</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Enjoy our lowest price today on a monthly variable rate. Includes a base commodity charge of $9.95 / Billing Cycle. Special offer for new, Online customers.</OfferDetails>
  </Offer>
  <Offer ID="705ce8cc-5d43-42d8-a6c6-82dbfc3a582d">
    <SupplierInfo SupplierCompanyName="Dynegy Energy Services East LLC" CompanyName="Dynegy Energy Services East LLC" SupplierAddress="6555 Sierra Drive" SupplierAddress2="" SupplierCity="Irving" SupplierState="TX" SupplierZip="75039" SupplierPhone="(833) 277-8471" SupplierWebSiteUrl="https://www.dynegy.com/?rfid=PUCO" />
    <SupplierLinks TermsOfServiceURL="https://www.dynegy.com/terms-of-service/?rfid=PUCO" SignUpNowURL="https://www.dynegy.com/dynegy-shop-for-plans-home?rfid=PUCO" />
    <Price>0.0509</Price>
    <RateType>Variable</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>0</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Get a simple variable electricity rate for your home on a month-to-month plan. Special offer for new, Online customers.</OfferDetails>
  </Offer>
  <Offer ID="4473d7a1-c26c-4f4b-a916-e3f96f53b889">
    <SupplierInfo SupplierCompanyName="Dynegy Energy Services East LLC" CompanyName="Dynegy Energy Services East LLC" SupplierAddress="6555 Sierra Drive" SupplierAddress2="" SupplierCity="Irving" SupplierState="TX" SupplierZip="75039" SupplierPhone="(833) 277-8471" SupplierWebSiteUrl="https://www.dynegy.com/?rfid=PUCO" />
    <SupplierLinks TermsOfServiceURL="https://www.dynegy.com/terms-of-service/?rfid=PUCO" SignUpNowURL="https://www.dynegy.com/dynegy-shop-for-plans-home?rfid=PUCO" />
    <Price>0.0509</Price>
    <RateType>Variable</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>0</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Get a simple variable electricity rate for your home on a month-to-month plan. Special offer for new, Online customers.</OfferDetails>
  </Offer>
  <Offer ID="1950f658-1866-412b-8f97-5c13f73cf793">
    <SupplierInfo SupplierCompanyName="Provision Power &amp; Gas LLC" CompanyName="Provision Power &amp; Gas LLC" SupplierAddress="P.O.Box" SupplierAddress2="" SupplierCity="Austin" SupplierState="TX" SupplierZip="78762" SupplierPhone="(800) 930-5427" SupplierWebSiteUrl="https://provisionpg.com/" />
    <SupplierLinks TermsOfServiceURL="https://www.getprovision.com/wp-content/uploads/2023/03/413-2.pdf" SignUpNowURL="https://www.getprovision.com/enroll/" />
    <Price>0.0539</Price>
    <RateType>Variable</RateType>
    <Renewable>100%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="Yes" Details="$0.0539/kWh first month, then monthly variable rate" />
    <TermLength>1</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="Yes" Details="Discounted for first month billing cycle. " />
    <OfferDetails>$0.0539/kWh first month, then monthly variable rate</OfferDetails>
  </Offer>
  <Offer ID="ced3d51b-8014-4705-93d8-b5a32a1bc6aa">
    <SupplierInfo SupplierCompanyName="Better Buy Energy" CompanyName="Dynegy Energy Services East LLC" SupplierAddress="PO Box 65764" SupplierAddress2="" SupplierCity="Dallas" SupplierState="TX" SupplierZip="75262-0764" SupplierPhone="(833) 200-9831" SupplierWebSiteUrl="https://www.betterbuyenergy.com/?rfid=PUCO" />
    <SupplierLinks TermsOfServiceURL="https://www.betterbuyenergy.com/terms-of-service/?rfid=PUCO" SignUpNowURL="https://www.betterbuyenergy.com/home/shop-plans?rfid=PUCO" />
    <Price>0.0569</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>12</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$9.95</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Get peace of mind with our lowest 12-month fixed rate. Includes a base commodity charge of $9.95 / Billing Cycle. Special offer for new, Online customers.</OfferDetails>
  </Offer>
  <Offer ID="c3430deb-b31b-4163-8f9f-549678dcbe78">
    <SupplierInfo SupplierCompanyName="Better Buy Energy" CompanyName="Dynegy Energy Services East LLC" SupplierAddress="PO Box 65764" SupplierAddress2="" SupplierCity="Dallas" SupplierState="TX" SupplierZip="75262-0764" SupplierPhone="(833) 200-9831" SupplierWebSiteUrl="https://www.betterbuyenergy.com/?rfid=PUCO" />
    <SupplierLinks TermsOfServiceURL="https://www.betterbuyenergy.com/terms-of-service/?rfid=PUCO" SignUpNowURL="https://www.betterbuyenergy.com/home/shop-plans?rfid=PUCO" />
    <Price>0.0569</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>12</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$9.95</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Get peace of mind with our lowest 12-month fixed rate. Includes a base commodity charge of $9.95 / Billing Cycle. Special offer for new, Online customers.</OfferDetails>
  </Offer>
  <Offer ID="0f281d38-5b9e-4cf3-950a-5195b7221cdc">
    <SupplierInfo SupplierCompanyName="Dynegy Energy Services East LLC" CompanyName="Dynegy Energy Services East LLC" SupplierAddress="6555 Sierra Drive" SupplierAddress2="" SupplierCity="Irving" SupplierState="TX" SupplierZip="75039" SupplierPhone="(833) 277-8471" SupplierWebSiteUrl="https://www.dynegy.com/?rfid=PUCO" />
    <SupplierLinks TermsOfServiceURL="https://www.dynegy.com/terms-of-service/?rfid=PUCO" SignUpNowURL="https://www.dynegy.com/dynegy-shop-for-plans-home?rfid=PUCO" />
    <Price>0.0579</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>12</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$9.95</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Get our lowest price-protected rate for up to 12 months. Includes a base commodity charge of $9.95 / Billing Cycle. Special offer for new, Online customers.</OfferDetails>
  </Offer>
  <Offer ID="c24f093a-d6cb-4a37-aa61-2a370430f884">
    <SupplierInfo SupplierCompanyName="Dynegy Energy Services East LLC" CompanyName="Dynegy Energy Services East LLC" SupplierAddress="6555 Sierra Drive" SupplierAddress2="" SupplierCity="Irving" SupplierState="TX" SupplierZip="75039" SupplierPhone="(833) 277-8471" SupplierWebSiteUrl="https://www.dynegy.com/?rfid=PUCO" />
    <SupplierLinks TermsOfServiceURL="https://www.dynegy.com/terms-of-service/?rfid=PUCO" SignUpNowURL="https://www.dynegy.com/dynegy-shop-for-plans-home?rfid=PUCO" />
    <Price>0.0579</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>12</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$9.95</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Get our lowest price-protected rate for up to 12 months. Includes a base commodity charge of $9.95 / Billing Cycle. Special offer for new, Online customers.</OfferDetails>
  </Offer>
  <Offer ID="1c2d49b8-add7-416c-a97b-1c91f39f41cb">
    <SupplierInfo SupplierCompanyName="Better Buy Energy" CompanyName="Dynegy Energy Services East LLC" SupplierAddress="PO Box 65764" SupplierAddress2="" SupplierCity="Dallas" SupplierState="TX" SupplierZip="75262-0764" SupplierPhone="(833) 200-9831" SupplierWebSiteUrl="https://www.betterbuyenergy.com/?rfid=PUCO" />
    <SupplierLinks TermsOfServiceURL="https://www.betterbuyenergy.com/terms-of-service/?rfid=PUCO" SignUpNowURL="https://www.betterbuyenergy.com/home/shop-plans?rfid=PUCO" />
    <Price>0.0619</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>7</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Get a guaranteed rate for up to 7 months. No sign-up fees or early cancellation penalty. Special offer for new, Online customers.</OfferDetails>
  </Offer>
  <Offer ID="a1258722-251f-4d5e-ac16-8e7c68dcaa8b">
    <SupplierInfo SupplierCompanyName="Better Buy Energy" CompanyName="Dynegy Energy Services East LLC" SupplierAddress="PO Box 65764" SupplierAddress2="" SupplierCity="Dallas" SupplierState="TX" SupplierZip="75262-0764" SupplierPhone="(833) 200-9831" SupplierWebSiteUrl="https://www.betterbuyenergy.com/?rfid=PUCO" />
    <SupplierLinks TermsOfServiceURL="https://www.betterbuyenergy.com/terms-of-service/?rfid=PUCO" SignUpNowURL="https://www.betterbuyenergy.com/home/shop-plans?rfid=PUCO" />
    <Price>0.0619</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>7</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Get a guaranteed rate for up to 7 months. No sign-up fees or early cancellation penalty. Special offer for new, Online customers.</OfferDetails>
  </Offer>
  <Offer ID="3b75ae8d-aa0a-47dd-a31a-e2a0b87504c1">
    <SupplierInfo SupplierCompanyName="Energy Harbor LLC" CompanyName="Energy Harbor LLC" SupplierAddress="168 East Market Street" SupplierAddress2="" SupplierCity="Akron" SupplierState="OH" SupplierZip="44308" SupplierPhone="(855) 487-0822" SupplierWebSiteUrl="www.energyharbor.com" />
    <SupplierLinks TermsOfServiceURL="https://omt.energyharbor.com/Pricing/Document?productID=34162" SignUpNowURL="https://energyharbor.com/en/marketing-campaign-/apples-to-apples/col-ohp-8mo-offer" />
    <Price>0.0629</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>8</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>AEP Columbus Southern: Fixed price for 8 months.</OfferDetails>
  </Offer>
  <Offer ID="c4ae9374-e5a6-47bc-bbec-e336da1a1cdc">
    <SupplierInfo SupplierCompanyName="Energy Harbor LLC" CompanyName="Energy Harbor LLC" SupplierAddress="168 East Market Street" SupplierAddress2="" SupplierCity="Akron" SupplierState="OH" SupplierZip="44308" SupplierPhone="(855) 487-0822" SupplierWebSiteUrl="www.energyharbor.com" />
    <SupplierLinks TermsOfServiceURL="https://omt.energyharbor.com/Pricing/Document?productID=34165" SignUpNowURL="https://energyharbor.com/en/marketing-campaign-/apples-to-apples/col-ohp-8mo-offer" />
    <Price>0.0629</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>8</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>AEP Ohio Power: Fixed price for 8 months.</OfferDetails>
  </Offer>
  <Offer ID="f747b99a-7cb9-4b42-adbc-df17ad9a01e1">
    <SupplierInfo SupplierCompanyName="Just Energy" CompanyName="Just Energy Solutions Inc" SupplierAddress="5251 Westheimer Rd. Suite 1000," SupplierAddress2="" SupplierCity="Houston" SupplierState="TX" SupplierZip="77056" SupplierPhone="(866) 239-5107" SupplierWebSiteUrl="https://enroll.justenergy.com/US/OH/SVC/service-address?postalCode=43230&amp;promoCode=JEPUC&amp;tfn=1-866-239-5107" />
    <SupplierLinks TermsOfServiceURL="https://doc-service-prd-webapp01.azurewebsites.net/files/US.OH/TOS/OH_RATE_GUARD_PLAN_TnC_ENG_V03_JUN_09_21.pdf" SignUpNowURL="https://enroll.justenergy.com/US/OH/SVC/service-address?postalCode=43230&amp;promoCode=JEPUC&amp;tfn=1-866-239-5107" />
    <Price>0.0629</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>24</TermLength>
    <EarlyTerminationFee>$50.00</EarlyTerminationFee>
    <MonthlyFee>$9.99</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="Yes" Details="Secure your rate for 2 years with our offer. It guarantees your monthly electric supply rate will always be the same throughout the term of your agreement, and there is no cost to sign up. For New Customers Only." />
    <OfferDetails>Enjoy rate reliability with our fixed-price energy plan. For New Customers Only.
</OfferDetails>
  </Offer>
  <Offer ID="b7704dab-ef69-432a-ad49-323dbe7ad063">
    <SupplierInfo SupplierCompanyName="Better Buy Energy" CompanyName="Dynegy Energy Services East LLC" SupplierAddress="PO Box 65764" SupplierAddress2="" SupplierCity="Dallas" SupplierState="TX" SupplierZip="75262-0764" SupplierPhone="(833) 200-9831" SupplierWebSiteUrl="https://www.betterbuyenergy.com/?rfid=PUCO" />
    <SupplierLinks TermsOfServiceURL="https://www.betterbuyenergy.com/terms-of-service/?rfid=PUCO" SignUpNowURL="https://www.betterbuyenergy.com/home/shop-plans?rfid=PUCO" />
    <Price>0.0629</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>9</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Changing seasons are no match for a fixed rate. No sign-up fees or early cancellation penalty. Special offer for new, Online customers.</OfferDetails>
  </Offer>
  <Offer ID="f060e374-dcdc-4d8d-891f-e19bdb4acad4">
    <SupplierInfo SupplierCompanyName="Better Buy Energy" CompanyName="Dynegy Energy Services East LLC" SupplierAddress="PO Box 65764" SupplierAddress2="" SupplierCity="Dallas" SupplierState="TX" SupplierZip="75262-0764" SupplierPhone="(833) 200-9831" SupplierWebSiteUrl="https://www.betterbuyenergy.com/?rfid=PUCO" />
    <SupplierLinks TermsOfServiceURL="https://www.betterbuyenergy.com/terms-of-service/?rfid=PUCO" SignUpNowURL="https://www.betterbuyenergy.com/home/shop-plans?rfid=PUCO" />
    <Price>0.0629</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>9</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Changing seasons are no match for a fixed rate. No sign-up fees or early cancellation penalty. Special offer for new, Online customers.</OfferDetails>
  </Offer>
  <Offer ID="214e3ec5-b297-4e32-a177-d2f5333bab97">
    <SupplierInfo SupplierCompanyName="Dynegy Energy Services East LLC" CompanyName="Dynegy Energy Services East LLC" SupplierAddress="6555 Sierra Drive" SupplierAddress2="" SupplierCity="Irving" SupplierState="TX" SupplierZip="75039" SupplierPhone="(833) 277-8471" SupplierWebSiteUrl="https://www.dynegy.com/?rfid=PUCO" />
    <SupplierLinks TermsOfServiceURL="https://www.dynegy.com/terms-of-service/?rfid=PUCO" SignUpNowURL="https://www.dynegy.com/dynegy-shop-for-plans-home?rfid=PUCO" />
    <Price>0.0639</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>7</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Get a guaranteed rate for up to 7 months. No sign-up fees or early cancellation penalty. Special offer for new, Online customers.</OfferDetails>
  </Offer>
  <Offer ID="e504b2c6-6f57-4486-976e-87a1f2e676f2">
    <SupplierInfo SupplierCompanyName="Dynegy Energy Services East LLC" CompanyName="Dynegy Energy Services East LLC" SupplierAddress="6555 Sierra Drive" SupplierAddress2="" SupplierCity="Irving" SupplierState="TX" SupplierZip="75039" SupplierPhone="(833) 277-8471" SupplierWebSiteUrl="https://www.dynegy.com/?rfid=PUCO" />
    <SupplierLinks TermsOfServiceURL="https://www.dynegy.com/terms-of-service/?rfid=PUCO" SignUpNowURL="https://www.dynegy.com/dynegy-shop-for-plans-home?rfid=PUCO" />
    <Price>0.0639</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>7</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Get a guaranteed rate for up to 7 months. No sign-up fees or early cancellation penalty. Special offer for new, Online customers.</OfferDetails>
  </Offer>
  <Offer ID="5f6aa9a0-f237-40d0-bee8-be74a65fd9ee">
    <SupplierInfo SupplierCompanyName="Just Energy" CompanyName="Just Energy Solutions Inc" SupplierAddress="5251 Westheimer Rd. Suite 1000," SupplierAddress2="" SupplierCity="Houston" SupplierState="TX" SupplierZip="77056" SupplierPhone="(866) 239-5107" SupplierWebSiteUrl="https://justenergy.com/ohapplestoapples/" />
    <SupplierLinks TermsOfServiceURL="https://doc-service-prd-webapp01.azurewebsites.net/files/US.OH/TOS/OH_RATE_GUARD_PLAN_TnC_ENG_V03_JUN_09_21.pdf" SignUpNowURL="https://justenergy.com/ohapplestoapples/" />
    <Price>0.0649</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>60</TermLength>
    <EarlyTerminationFee>$50.00</EarlyTerminationFee>
    <MonthlyFee>$9.99</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="Yes" Details="Secure your rate for 5 years with our offer. It guarantees your monthly electric supply rate will always be the same throughout the term of your agreement, and there is no cost to sign up. For New Customers Only." />
    <OfferDetails>Enjoy rate reliability with our fixed-price energy plan. For New Customers Only.
</OfferDetails>
  </Offer>
  <Offer ID="71fad9f0-4c62-482f-ab60-dad81ebc1f28">
    <SupplierInfo SupplierCompanyName="Santanna Energy Services" CompanyName="Santanna Natural Gas Corporation" SupplierAddress="300 E Business Way, Suite 200" SupplierAddress2="" SupplierCity="Cincinnati" SupplierState="OH" SupplierZip="45241" SupplierPhone="(866) 938-1881" SupplierWebSiteUrl="https://santannaenergyservices.com/offers/?utm_source=energychoice.ohio.gov&amp;utm_medium=referral&amp;utm_campaign=company-url&amp;utm_content=electric&amp;strategyGuid=71b424f1-9ffe-4e04-91d5-11eea216e108" />
    <SupplierLinks TermsOfServiceURL="https://santannaenergyservices.com/offers/?strategyGuid=71b424f1-9ffe-4e04-91d5-11eea216e108&amp;utm_source=energychoice.ohio.gov&amp;utm_medium=referral&amp;utm_campaign=FIX_12M_T1_CSPOHE&amp;utm_content=electric" SignUpNowURL="https://santannaenergyservices.com/offers/?strategyGuid=71b424f1-9ffe-4e04-91d5-11eea216e108&amp;utm_source=energychoice.ohio.gov&amp;utm_medium=referral&amp;utm_campaign=FIX_12M_T1_CSPOHE&amp;utm_content=electric" />
    <Price>0.0649</Price>
    <RateType>Fixed</RateType>
    <Renewable>4%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>12</TermLength>
    <EarlyTerminationFee>$100.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="Yes" Details="Get $25 Rewards Dollars for discounts and coupons on top brands, dining and groceries. THIS PRODUCT IS ONLY AVAILABLE FOR NEW CUSTOMERS WHO BUNDLE GAS &amp; ELECTRIC. Customer must visit company URL or call us directly to enroll in this product. &#xD;&#xA;" />
    <OfferDetails>$0.06490/kWh Fixed Price for 12 months. ONLY AVAILABLE TO NEW AEP COLUMBUS SOUTHERN CUSTOMERS WHO BUNDLE GAS &amp; ELECTRIC. Must visit company URL or call us directly to enroll in this product.
</OfferDetails>
  </Offer>
  <Offer ID="7509a27e-c9a3-462c-a74a-b7f06abf8ad8">
    <SupplierInfo SupplierCompanyName="Santanna Energy Services" CompanyName="Santanna Natural Gas Corporation" SupplierAddress="300 E Business Way, Suite 200" SupplierAddress2="" SupplierCity="Cincinnati" SupplierState="OH" SupplierZip="45241" SupplierPhone="(866) 938-1881" SupplierWebSiteUrl="https://santannaenergyservices.com/offers/?utm_source=energychoice.ohio.gov&amp;utm_medium=referral&amp;utm_campaign=company-url&amp;utm_content=electric&amp;strategyGuid=71b424f1-9ffe-4e04-91d5-11eea216e108" />
    <SupplierLinks TermsOfServiceURL="https://santannaenergyservices.com/offers/?strategyGuid=71b424f1-9ffe-4e04-91d5-11eea216e108&amp;utm_source=energychoice.ohio.gov&amp;utm_medium=referral&amp;utm_campaign=FIX_12M_T1_OPCOHE&amp;utm_content=electric" SignUpNowURL="https://santannaenergyservices.com/offers/?strategyGuid=71b424f1-9ffe-4e04-91d5-11eea216e108&amp;utm_source=energychoice.ohio.gov&amp;utm_medium=referral&amp;utm_campaign=FIX_12M_T1_OPCOHE&amp;utm_content=electric" />
    <Price>0.0649</Price>
    <RateType>Fixed</RateType>
    <Renewable>4%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>12</TermLength>
    <EarlyTerminationFee>$100.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="Yes" Details="Get $25 Rewards Dollars for discounts and coupons on top brands, dining and groceries. THIS PRODUCT IS ONLY AVAILABLE FOR NEW CUSTOMERS WHO BUNDLE GAS &amp; ELECTRIC. Customer must visit company URL or call us directly to enroll in this product. &#xD;&#xA;" />
    <OfferDetails>$0.06490/kWh Fixed Price for 12 months. ONLY AVAILABLE TO NEW AEP OHIO POWER CUSTOMERS WHO BUNDLE GAS &amp; ELECTRIC. Must visit company URL or call us directly to enroll in this product.
</OfferDetails>
  </Offer>
  <Offer ID="c9d0c902-b7c2-42ab-9a8f-52240704347b">
    <SupplierInfo SupplierCompanyName="Just Energy" CompanyName="Just Energy Solutions Inc" SupplierAddress="5251 Westheimer Rd. Suite 1000," SupplierAddress2="" SupplierCity="Houston" SupplierState="TX" SupplierZip="77056" SupplierPhone="(866) 239-5107" SupplierWebSiteUrl="https://justenergy.com/ohapplestoapples/" />
    <SupplierLinks TermsOfServiceURL="https://doc-service-prd-webapp01.azurewebsites.net/files/US.OH/TOS/OH_RATE_GUARD_PLAN_TnC_ENG_V03_JUN_09_21.pdf" SignUpNowURL="https://justenergy.com/ohapplestoapples/" />
    <Price>0.0649</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>36</TermLength>
    <EarlyTerminationFee>$50.00</EarlyTerminationFee>
    <MonthlyFee>$9.99</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="Yes" Details="Secure your rate for 3 years with our offer. It guarantees your monthly electric supply rate will always be the same throughout the term of your agreement, and there is no cost to sign up. For New Customers Only." />
    <OfferDetails>Enjoy rate reliability with our fixed-price energy plan. For New Customers Only.
</OfferDetails>
  </Offer>
  <Offer ID="67db5531-ca81-4a1e-a7ca-f0b2d2e6c7f5">
    <SupplierInfo SupplierCompanyName="Dynegy Energy Services East LLC" CompanyName="Dynegy Energy Services East LLC" SupplierAddress="6555 Sierra Drive" SupplierAddress2="" SupplierCity="Irving" SupplierState="TX" SupplierZip="75039" SupplierPhone="(833) 277-8471" SupplierWebSiteUrl="https://www.dynegy.com/?rfid=PUCO" />
    <SupplierLinks TermsOfServiceURL="https://www.dynegy.com/terms-of-service/?rfid=PUCO" SignUpNowURL="https://www.dynegy.com/dynegy-shop-for-plans-home?rfid=PUCO" />
    <Price>0.0649</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>9</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Relax with one of our best values: Up to 9 months of guaranteed price protection at a great rate. No sign-up fees or early cancellation penalty. Special offer for new, Online customers.</OfferDetails>
  </Offer>
  <Offer ID="f7499113-6456-4b8c-8566-a97742fdcbd4">
    <SupplierInfo SupplierCompanyName="Dynegy Energy Services East LLC" CompanyName="Dynegy Energy Services East LLC" SupplierAddress="6555 Sierra Drive" SupplierAddress2="" SupplierCity="Irving" SupplierState="TX" SupplierZip="75039" SupplierPhone="(833) 277-8471" SupplierWebSiteUrl="https://www.dynegy.com/?rfid=PUCO" />
    <SupplierLinks TermsOfServiceURL="https://www.dynegy.com/terms-of-service/?rfid=PUCO" SignUpNowURL="https://www.dynegy.com/dynegy-shop-for-plans-home?rfid=PUCO" />
    <Price>0.0649</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>9</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Relax with one of our best values: Up to 9 months of guaranteed price protection at a great rate. No sign-up fees or early cancellation penalty. Special offer for new, Online customers.</OfferDetails>
  </Offer>
  <Offer ID="0aa50007-a0a8-4fd1-bf29-2ce7ea26f10a">
    <SupplierInfo SupplierCompanyName="American Power &amp; Gas of Ohio, LLC" CompanyName="American Power &amp; Gas of Ohio, LLC" SupplierAddress="10601 S Belcher Rd" SupplierAddress2="" SupplierCity="Seminole" SupplierState="FL" SupplierZip="33777" SupplierPhone="(888) 669-2365" SupplierWebSiteUrl="https://www.americanpowerandgas.com/" />
    <SupplierLinks TermsOfServiceURL="https://www.americanpowerandgas.com/wp-content/uploads/2021/11/OH_Variable_Electric_Agreement_2021-09-17.pdf" SignUpNowURL="https://www.americanpowerandgas.com/" />
    <Price>0.0649</Price>
    <RateType>Variable</RateType>
    <Renewable>25%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="Yes" Details="Our 25% rebate is available to all of our customers. &#xD;&#xA;&#xD;&#xA;We have sent out over $900,000 in rebates. Are you getting one?" />
    <TermLength>1</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="Yes" Details="Our 25% rebate is available to all of our customers. &#xD;&#xA;&#xD;&#xA;We have sent out over $900,000 in rebates. Are you getting one?" />
    <OfferDetails>Our 25% rebate is available to all of our customers.

We have sent out over $900,000 in rebates. Are you getting one?</OfferDetails>
  </Offer>
  <Offer ID="eedaa63d-bd8f-4403-aa47-4a5a1556967d">
    <SupplierInfo SupplierCompanyName="Nordic Energy Services LLC" CompanyName="Nordic Energy Services LLC" SupplierAddress="1 Tower Lane" SupplierAddress2="Suite 300" SupplierCity="Oakbrook Terrace" SupplierState="IL" SupplierZip="60181" SupplierPhone="(877) 808-1022" SupplierWebSiteUrl="https://www.nordicenergy-us.com/" />
    <SupplierLinks TermsOfServiceURL="https://www.nordicenergy-us.com/" SignUpNowURL="https://www.nordicenergy-us.com/" />
    <Price>0.0650</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>2</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="Yes" Details="Fixed rate of 0.06499/kWh for two months then defaults to a variable rate. No early termination fees!" />
    <OfferDetails>Fixed rate of 0.06499/kWh for two months then defaults to a variable rate. No early termination fees!</OfferDetails>
  </Offer>
  <Offer ID="32bd547e-1783-4c7f-b224-dbf990eea463">
    <SupplierInfo SupplierCompanyName="Energy Harbor LLC" CompanyName="Energy Harbor LLC" SupplierAddress="168 East Market Street" SupplierAddress2="" SupplierCity="Akron" SupplierState="OH" SupplierZip="44308" SupplierPhone="(855) 487-0822" SupplierWebSiteUrl="www.energyharbor.com" />
    <SupplierLinks TermsOfServiceURL="https://omt.energyharbor.com/Pricing/Document?productID=34166" SignUpNowURL="https://energyharbor.com/en/marketing-campaign-/apples-to-apples/col-ohp-32mo-offer" />
    <Price>0.0659</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>32</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>AEP Ohio Power: Fixed price for 32 months.
</OfferDetails>
  </Offer>
  <Offer ID="93fd1584-ed31-4bf6-abc1-414674752906">
    <SupplierInfo SupplierCompanyName="Energy Harbor LLC" CompanyName="Energy Harbor LLC" SupplierAddress="168 East Market Street" SupplierAddress2="" SupplierCity="Akron" SupplierState="OH" SupplierZip="44308" SupplierPhone="(855) 487-0822" SupplierWebSiteUrl="www.energyharbor.com" />
    <SupplierLinks TermsOfServiceURL="https://omt.energyharbor.com/Pricing/Document?productID=34163" SignUpNowURL="https://energyharbor.com/en/marketing-campaign-/apples-to-apples/col-ohp-32mo-offer" />
    <Price>0.0659</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>32</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>AEP Columbus Southern: Fixed price for 32 months.
</OfferDetails>
  </Offer>
  <Offer ID="c0884efa-4385-442f-865c-85125bebb856">
    <SupplierInfo SupplierCompanyName="nTherm, LLC" CompanyName="nTherm, LLC" SupplierAddress="1624 Market St Suite 202" SupplierAddress2="" SupplierCity="Denver" SupplierState="CO" SupplierZip="80202" SupplierPhone="(888) 865-3402" SupplierWebSiteUrl="www.ntherm.com" />
    <SupplierLinks TermsOfServiceURL="www.ntherm.com" SignUpNowURL="www.ntherm.com" />
    <Price>0.0659</Price>
    <RateType>Variable</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="Yes" Details="20% rebate on the average months energy supply cost after 12 consecutive months with nTherm, llc as the Competitive Retail Natural Gas Supplier" />
    <TermLength>1</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>20% rebate on the average months energy supply cost after 12 consecutive months with nTherm, llc as the Competitive Retail Electric Supplier
</OfferDetails>
  </Offer>
  <Offer ID="6b3c6817-15a2-472f-89b8-83399737f99d">
    <SupplierInfo SupplierCompanyName="Kiwi Energy" CompanyName="Kiwi Energy NY LLC" SupplierAddress="144 N 7th Street, #417" SupplierAddress2="" SupplierCity="Brooklyn" SupplierState="NY" SupplierZip="11211" SupplierPhone="(877) 208-7636" SupplierWebSiteUrl="www.kiwienergy.us" />
    <SupplierLinks TermsOfServiceURL="www.kiwienergy.us" SignUpNowURL="www.kiwienergy.us" />
    <Price>0.0664</Price>
    <RateType>Variable</RateType>
    <Renewable>100%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="Yes" Details="Price is set for first month and variable thereafter." />
    <TermLength>36</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Kiwi Green 100 is a month-to-month variable rate product for 36 months, matches 100% of usage with RECS and no cancellation fees. Customers receive $25 in Kiwi Rewards Dollars each month. No guaranteed savings</OfferDetails>
  </Offer>
  <Offer ID="0a6274b2-a136-4c4c-89a5-e82fb8fa8863">
    <SupplierInfo SupplierCompanyName="Kiwi Energy" CompanyName="Kiwi Energy NY LLC" SupplierAddress="144 N 7th Street, #417" SupplierAddress2="" SupplierCity="Brooklyn" SupplierState="NY" SupplierZip="11211" SupplierPhone="(877) 208-7636" SupplierWebSiteUrl="www.kiwienergy.us" />
    <SupplierLinks TermsOfServiceURL="www.kiwienergy.us" SignUpNowURL="www.kiwienergy.us" />
    <Price>0.0664</Price>
    <RateType>Variable</RateType>
    <Renewable>50%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="Yes" Details="Price is set for first month and variable thereafter." />
    <TermLength>36</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Kiwi Green 50 is a month-to-month variable rate product for 36 months, matches 50% of usage with RECS and no cancellation fees. Customers receive $25 in Kiwi Rewards Dollars each month. No guaranteed savings</OfferDetails>
  </Offer>
  <Offer ID="01397cad-18a5-4a57-b59e-da8f3fac36b3">
    <SupplierInfo SupplierCompanyName="NRG Home" CompanyName="Reliant Energy Northeast LLC" SupplierAddress="P.O. Box 38781" SupplierAddress2=" " SupplierCity="Philadelphia" SupplierState="PA" SupplierZip="19104" SupplierPhone="(855) 500-8703" SupplierWebSiteUrl="https://www.picknrg.com/en/us/lp/mp/ohchoice" />
    <SupplierLinks TermsOfServiceURL="https://www.picknrg.com/lp/standalone" SignUpNowURL="https://www.picknrg.com/en/us/lp/mp/ohchoice" />
    <Price>0.0669</Price>
    <RateType>Variable</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="Yes" Details="Promotional supply rate for your first 3 billing cycles. After your promotional period ends, your ongoing electric supply rate will be variable and can change each month. " />
    <TermLength>3</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Sign up bonus after 3 months, percentage cash back annually</OfferDetails>
  </Offer>
  <Offer ID="32a83ed2-efdb-4cb5-a0e3-8573f62c48fc">
    <SupplierInfo SupplierCompanyName="SFE Energy Ohio, Inc" CompanyName="SFE Energy Ohio, Inc" SupplierAddress="PO BOX 967" SupplierAddress2="" SupplierCity="Buffalo" SupplierState="NY" SupplierZip="14240-0967" SupplierPhone="(866) 255-3844" SupplierWebSiteUrl="https://www.sfeenergy.com/" />
    <SupplierLinks TermsOfServiceURL="https://signup.sfeenergy.com/terms-of-use.html" SignUpNowURL="https://www.sfeenergy.com/ohio/" />
    <Price>0.0669</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>36</TermLength>
    <EarlyTerminationFee>$7.50</EarlyTerminationFee>
    <MonthlyFee>$50.20</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="Yes" Details="Receive 4 FREE LED bulbs after 2 months (60 calendar days) of consecutive flow with the company. " />
    <OfferDetails>Green Electricity with daily customer charge of $1.65/day.</OfferDetails>
  </Offer>
  <Offer ID="06a331a6-d85b-43a1-9af5-f08e96a4e347">
    <SupplierInfo SupplierCompanyName="AEP Energy Inc" CompanyName="AEP Energy Inc" SupplierAddress="1 Riverside Plaza" SupplierAddress2="20th Floor" SupplierCity="Columbus" SupplierState="OH" SupplierZip="43215" SupplierPhone="(877) 648-1922" SupplierWebSiteUrl="https://www.aepenergy.com/acquisition/campaign/offers/?cc=puco-aep&amp;utm_source=A2A&amp;utm_medium=shopping&amp;utm_campaign=aep_Dec_23" />
    <SupplierLinks TermsOfServiceURL="https://www.aepenergy.com/acquisition/campaign/offers/?cc=puco-aep&amp;utm_source=A2A&amp;utm_medium=shopping&amp;utm_campaign=aep_Dec_23" SignUpNowURL="https://www.aepenergy.com/acquisition/campaign/offers/?cc=puco-aep&amp;utm_source=A2A&amp;utm_medium=shopping&amp;utm_campaign=aep_Dec_23" />
    <Price>0.0669</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>8</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="Yes" Details="When you enroll with AEP Energy, you’ll receive Reward Dollars each month for simply being our customer. Shop Reward Store and redeem your Reward Dollars towards purchases for additional savings. Offer is valid for both new and existing customers. Fo" />
    <OfferDetails>This offer is limited to residential customers of AEP Ohio and is valid for both new and existing customers.
</OfferDetails>
  </Offer>
  <Offer ID="c6f967c2-8b79-4f5a-8ae1-e2dc00581668">
    <SupplierInfo SupplierCompanyName="Direct Energy Services LLC" CompanyName="Direct Energy Services LLC" SupplierAddress="PO Box 180" SupplierAddress2="" SupplierCity="Tulsa" SupplierState="OK" SupplierZip="74101" SupplierPhone="(877) 698-7551" SupplierWebSiteUrl="https://www.directenergy.com/ohio/electricity-plans/msid/5360/pid/lb18?utm_source=BD&amp;utm_medium=OH-PTC" />
    <SupplierLinks TermsOfServiceURL="http://DirectEnergyDocuments.gesc.com/TCPage.aspx?Doc=DEROHDTDTCE" SignUpNowURL="www.directenergy.com/ohio/electricity-plans/live-brighter-12/msid/5360/pid/OSS?_utm_source=BD&amp;utm_medium=OH-PTC" />
    <Price>0.0669</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>12</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Offer available online only! Offer available to new customers only.</OfferDetails>
  </Offer>
  <Offer ID="f9a65960-de97-42c3-8b41-1cfaac3b6d5a">
    <SupplierInfo SupplierCompanyName="Direct Energy Services LLC" CompanyName="Direct Energy Services LLC" SupplierAddress="PO Box 180" SupplierAddress2="" SupplierCity="Tulsa" SupplierState="OK" SupplierZip="74101" SupplierPhone="(877) 698-7551" SupplierWebSiteUrl="https://www.directenergy.com/ohio/electricity-plans/msid/5360/pid/lb18?utm_source=BD&amp;utm_medium=OH-PTC" />
    <SupplierLinks TermsOfServiceURL="http://DirectEnergyDocuments.gesc.com/TCPage.aspx?Doc=DEROHDTDTCE" SignUpNowURL="www.directenergy.com/ohio/electricity-plans/live-brighter-18/msid/5360/pid/OSS?_utm_source=BD&amp;utm_medium=OH-PTC" />
    <Price>0.0669</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>18</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Offer available online only! Offer available to new customers only.</OfferDetails>
  </Offer>
  <Offer ID="8694c5bc-bf50-49f7-82d1-0101a4db269d">
    <SupplierInfo SupplierCompanyName="Powervine Energy LLC" CompanyName="Powervine Energy LLC" SupplierAddress="2100 West Loop South" SupplierAddress2="Suite 800" SupplierCity="Houston" SupplierState="TX" SupplierZip="77027" SupplierPhone="(888) 263-2806" SupplierWebSiteUrl="https://products.powervineenergy.com/?source=POW002" />
    <SupplierLinks TermsOfServiceURL="https://products.powervineenergy.com/?source=POW002" SignUpNowURL="https://products.powervineenergy.com/?source=POW002" />
    <Price>0.0678</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>4</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Fixed Rate. No hidden fees. No monthly service fee. No early cancellation fee.
</OfferDetails>
  </Offer>
  <Offer ID="b16af2c5-c0df-41be-9fdd-e7f859938093">
    <SupplierInfo SupplierCompanyName="Energy Harbor LLC" CompanyName="Energy Harbor LLC" SupplierAddress="168 East Market Street" SupplierAddress2="" SupplierCity="Akron" SupplierState="OH" SupplierZip="44308" SupplierPhone="(855) 487-0822" SupplierWebSiteUrl="www.energyharbor.com" />
    <SupplierLinks TermsOfServiceURL="https://omt.energyharbor.com/Pricing/Document?productID=34167" SignUpNowURL="https://energyharbor.com/en/marketing-campaign-/apples-to-apples/col-ohp-48mo-offer" />
    <Price>0.0679</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>48</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>AEP Ohio Power: Fixed price for 48 months.</OfferDetails>
  </Offer>
  <Offer ID="b56bcd75-cbcb-4d1c-94c2-7a7a3d2af34f">
    <SupplierInfo SupplierCompanyName="Energy Harbor LLC" CompanyName="Energy Harbor LLC" SupplierAddress="168 East Market Street" SupplierAddress2="" SupplierCity="Akron" SupplierState="OH" SupplierZip="44308" SupplierPhone="(855) 487-0822" SupplierWebSiteUrl="www.energyharbor.com" />
    <SupplierLinks TermsOfServiceURL="https://omt.energyharbor.com/Pricing/Document?productID=34164" SignUpNowURL="https://energyharbor.com/en/marketing-campaign-/apples-to-apples/col-ohp-48mo-offer" />
    <Price>0.0679</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>48</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>AEP Columbus Southern: Fixed price for 48 months.</OfferDetails>
  </Offer>
  <Offer ID="6368a1bb-119e-4c9c-9a57-da99c0a4bf16">
    <SupplierInfo SupplierCompanyName="Powervine Energy LLC" CompanyName="Powervine Energy LLC" SupplierAddress="2100 W Loop South" SupplierAddress2="Suite 801" SupplierCity="Houston" SupplierState="TX" SupplierZip="77027" SupplierPhone="(888) 263-2806" SupplierWebSiteUrl="https://products.powervineenergy.com/?source=POW002" />
    <SupplierLinks TermsOfServiceURL="https://products.powervineenergy.com/?source=POW002" SignUpNowURL="https://products.powervineenergy.com/?source=POW002" />
    <Price>0.0684</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>6</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Fixed Rate. No hidden fees. No monthly service fee. No early cancellation fee.

</OfferDetails>
  </Offer>
  <Offer ID="f2100443-2ef1-4535-81dd-286d8ec6b23b">
    <SupplierInfo SupplierCompanyName="IDT Energy, Inc" CompanyName="IDT Energy, Inc" SupplierAddress="520 Broad Street" SupplierAddress2="" SupplierCity="Newark" SupplierState="NJ" SupplierZip="07102" SupplierPhone="(877) 887-6866" SupplierWebSiteUrl="www.IDTEnergy.com" />
    <SupplierLinks TermsOfServiceURL="https://idtenergy.com/terms/oh-terms" SignUpNowURL="https://idtenergy.com/" />
    <Price>0.0685</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>4</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Lock in this price for 4 months with IDT Energy. Go to IDTEnergy.com for more details.</OfferDetails>
  </Offer>
  <Offer ID="a9904f82-3f00-4a01-bbce-bda7071166a6">
    <SupplierInfo SupplierCompanyName="Major Energy Electric Services LLC" CompanyName="Major Energy Services LLC" SupplierAddress="12140 Wickchester Ln" SupplierAddress2="Suite #100" SupplierCity="Houston" SupplierState="TX" SupplierZip="77079" SupplierPhone="(888) 625-6760" SupplierWebSiteUrl="https://majorenergy.com" />
    <SupplierLinks TermsOfServiceURL="https://majorenergy.com/enroll/?getproductpdf=1&amp;PromotionCode=&amp;ProductID=147602&amp;type=TOS&amp;title=Terms+of+Service" SignUpNowURL="https://majorenergy.com/enroll/" />
    <Price>0.0689</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>6</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Only applicable for new customers, existing customers with Major Energy please call 1-888-625-6760 to renew! Market rates can go up and down, but with this fixed plan, you can lock in your fixed rate for 6 months so you do not have to worry. With this fixed rate, there is no early cancellation fee. </OfferDetails>
  </Offer>
  <Offer ID="aed50204-0b23-40d1-bb4a-7bceb8d92b67">
    <SupplierInfo SupplierCompanyName="Brighten Energy" CompanyName="Dynegy Energy Services East LLC" SupplierAddress="PO Box 65764" SupplierAddress2="" SupplierCity="Dallas" SupplierState="TX" SupplierZip="75262-0764" SupplierPhone="(833) 223-0915" SupplierWebSiteUrl="https://www.brightenenergy.com/?rfid=PUCO" />
    <SupplierLinks TermsOfServiceURL="https://www.brightenenergy.com/terms-of-service/?rfid=PUCO" SignUpNowURL="https://www.brightenenergy.com/brighten-energy-shop-for-plans-home?rfid=PUCO" />
    <Price>0.0689</Price>
    <RateType>Fixed</RateType>
    <Renewable>100%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>7</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Power your home with 100% clean energy. Your rate's locked in for up to 7 months with no extra fees. Special offer for new, Online customers.</OfferDetails>
  </Offer>
  <Offer ID="f169545d-53fe-427c-a4c5-f16d008e5791">
    <SupplierInfo SupplierCompanyName="Brighten Energy" CompanyName="Dynegy Energy Services East LLC" SupplierAddress="PO Box 65764" SupplierAddress2="" SupplierCity="Dallas" SupplierState="TX" SupplierZip="75262-0764" SupplierPhone="(833) 223-0915" SupplierWebSiteUrl="https://www.brightenenergy.com/?rfid=PUCO" />
    <SupplierLinks TermsOfServiceURL="https://www.brightenenergy.com/terms-of-service/?rfid=PUCO" SignUpNowURL="https://www.brightenenergy.com/brighten-energy-shop-for-plans-home?rfid=PUCO" />
    <Price>0.0689</Price>
    <RateType>Fixed</RateType>
    <Renewable>100%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>7</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Power your home with 100% clean energy. Your rate's locked in for up to 7 months with no extra fees. Special offer for new, Online customers.</OfferDetails>
  </Offer>
  <Offer ID="0147252e-b6f5-4628-895e-ae2785ab76a3">
    <SupplierInfo SupplierCompanyName="Energy Harbor LLC" CompanyName="Energy Harbor LLC" SupplierAddress="168 East Market Street" SupplierAddress2="" SupplierCity="Akron" SupplierState="OH" SupplierZip="44308" SupplierPhone="(855) 487-0822" SupplierWebSiteUrl="www.energyharbor.com" />
    <SupplierLinks TermsOfServiceURL="https://omt.energyharbor.com/Pricing/Document?productID=34116" SignUpNowURL="https://energyharbor.com/en/marketing-campaign-/apples-to-apples/col-ohp-24mo-offer" />
    <Price>0.0694</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>24</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>AEP Columbus Southern: Fixed price for 24 months.
</OfferDetails>
  </Offer>
  <Offer ID="0dc48d60-093d-418e-8c0d-66839f29aec4">
    <SupplierInfo SupplierCompanyName="Energy Harbor LLC" CompanyName="Energy Harbor LLC" SupplierAddress="168 East Market Street" SupplierAddress2="" SupplierCity="Akron" SupplierState="OH" SupplierZip="44308" SupplierPhone="(855) 487-0822" SupplierWebSiteUrl="www.energyharbor.com" />
    <SupplierLinks TermsOfServiceURL="https://omt.energyharbor.com/Pricing/Document?productID=34120" SignUpNowURL="https://energyharbor.com/en/marketing-campaign-/apples-to-apples/col-ohp-24mo-offer" />
    <Price>0.0694</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>24</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>AEP Ohio Power: Fixed price for 24 months.
</OfferDetails>
  </Offer>
  <Offer ID="2ffd1704-4cae-4ebb-a0ca-24fe310e4093">
    <SupplierInfo SupplierCompanyName="XOOM Energy Ohio LLC" CompanyName="XOOM Energy Ohio LLC" SupplierAddress="804 Carnegie Center" SupplierAddress2="" SupplierCity="Princeton" SupplierState="NJ" SupplierZip="08540" SupplierPhone="(888) 997-8979" SupplierWebSiteUrl="http://xoomenergy.com/en" />
    <SupplierLinks TermsOfServiceURL="https://xoomenergy.com/uploads/rates/terms-email/271493-en.pdf" SignUpNowURL="http://xoomenergy.com/en/residential/?des=oh&amp;deu=72&amp;utm_source=puco&amp;utm_medium=signuplink&amp;utm_campaign=aep" />
    <Price>0.0709</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>12</TermLength>
    <EarlyTerminationFee>$100.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>SureLock 12</OfferDetails>
  </Offer>
  <Offer ID="49d67e0b-c87f-4ba1-940c-0af5873e60cc">
    <SupplierInfo SupplierCompanyName="Brighten Energy" CompanyName="Dynegy Energy Services East LLC" SupplierAddress="PO Box 65764" SupplierAddress2="" SupplierCity="Dallas" SupplierState="TX" SupplierZip="75262-0764" SupplierPhone="(833) 223-0915" SupplierWebSiteUrl="https://www.brightenenergy.com/?rfid=PUCO" />
    <SupplierLinks TermsOfServiceURL="https://www.brightenenergy.com/terms-of-service/?rfid=PUCO" SignUpNowURL="https://www.brightenenergy.com/brighten-energy-shop-for-plans-home?rfid=PUCO" />
    <Price>0.0709</Price>
    <RateType>Fixed</RateType>
    <Renewable>100%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>12</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Choose renewable energy for a year and enjoy a price-protected rate that's good for your wallet. No sign up fees or early cancellation penalties. Special offer for new, Online customers.</OfferDetails>
  </Offer>
  <Offer ID="092ec24a-6959-46f5-982a-d77fb0a221ea">
    <SupplierInfo SupplierCompanyName="Brighten Energy" CompanyName="Dynegy Energy Services East LLC" SupplierAddress="PO Box 65764" SupplierAddress2="" SupplierCity="Dallas" SupplierState="TX" SupplierZip="75262-0764" SupplierPhone="(833) 223-0915" SupplierWebSiteUrl="https://www.brightenenergy.com/?rfid=PUCO" />
    <SupplierLinks TermsOfServiceURL="https://www.brightenenergy.com/terms-of-service/?rfid=PUCO" SignUpNowURL="https://www.brightenenergy.com/brighten-energy-shop-for-plans-home?rfid=PUCO" />
    <Price>0.0709</Price>
    <RateType>Fixed</RateType>
    <Renewable>100%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>12</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Choose renewable energy for a year and enjoy a price-protected rate that's good for your wallet. No sign up fees or early cancellation penalties. Special offer for new, Online customers.</OfferDetails>
  </Offer>
  <Offer ID="1b6fd7ec-b509-435b-9ab2-8f3ee6ff0837">
    <SupplierInfo SupplierCompanyName="NRG Home" CompanyName="Reliant Energy Northeast LLC" SupplierAddress="P.O. Box 38781" SupplierAddress2="" SupplierCity="Philadelphia" SupplierState="PA" SupplierZip="19104" SupplierPhone="(855) 500-8703" SupplierWebSiteUrl="https://www.picknrg.com/en/us/lp/mp/ohchoice" />
    <SupplierLinks TermsOfServiceURL="https://www.picknrg.com/en/us/lp/mp/ohchoice" SignUpNowURL="https://www.picknrg.com/en/us/lp/mp/ohchoice" />
    <Price>0.0710</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="Yes" Details="Promotional supply rate for your first 6 billing cycles. After your promotional period ends, your ongoing electric supply rate will be variable and can change each month." />
    <TermLength>6</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Percentage cash back annually</OfferDetails>
  </Offer>
  <Offer ID="389b88bb-ef44-46d1-a451-397e999a4835">
    <SupplierInfo SupplierCompanyName="XOOM Energy Ohio LLC" CompanyName="XOOM Energy Ohio LLC" SupplierAddress="804 Carnegie Center" SupplierAddress2="" SupplierCity="Princeton" SupplierState="NJ" SupplierZip="08540" SupplierPhone="(888) 997-8979" SupplierWebSiteUrl="http://xoomenergy.com/en" />
    <SupplierLinks TermsOfServiceURL="https://xoomenergy.com/uploads/rates/terms-email/271496-en.pdf" SignUpNowURL="http://xoomenergy.com/en/residential/?des=oh&amp;deu=72&amp;utm_source=puco&amp;utm_medium=signuplink&amp;utm_campaign=aep" />
    <Price>0.0719</Price>
    <RateType>Fixed</RateType>
    <Renewable>50%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>12</TermLength>
    <EarlyTerminationFee>$100.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>SimpleClean 12 - 50% Green</OfferDetails>
  </Offer>
  <Offer ID="6e2851f3-6bc6-4d99-8ae1-02c3c6dcb8c8">
    <SupplierInfo SupplierCompanyName="Brighten Energy" CompanyName="Dynegy Energy Services East LLC" SupplierAddress="PO Box 65764" SupplierAddress2="" SupplierCity="Dallas" SupplierState="TX" SupplierZip="75262-0764" SupplierPhone="(833) 223-0915" SupplierWebSiteUrl="https://www.brightenenergy.com/?rfid=PUCO" />
    <SupplierLinks TermsOfServiceURL="https://www.brightenenergy.com/terms-of-service/?rfid=PUCO" SignUpNowURL="https://www.brightenenergy.com/brighten-energy-shop-for-plans-home?rfid=PUCO" />
    <Price>0.0719</Price>
    <RateType>Fixed</RateType>
    <Renewable>100%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>24</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Showing your commitment to clean energy comes with long-term peace of mind: Your rate's guaranteed for up to 24 months. No extra fees. Special offer for new, Online customers.</OfferDetails>
  </Offer>
  <Offer ID="487253fa-0754-43bc-8424-a75edee02081">
    <SupplierInfo SupplierCompanyName="Brighten Energy" CompanyName="Dynegy Energy Services East LLC" SupplierAddress="PO Box 65764" SupplierAddress2="" SupplierCity="Dallas" SupplierState="TX" SupplierZip="75262-0764" SupplierPhone="(833) 223-0915" SupplierWebSiteUrl="https://www.brightenenergy.com/?rfid=PUCO" />
    <SupplierLinks TermsOfServiceURL="https://www.brightenenergy.com/terms-of-service/?rfid=PUCO" SignUpNowURL="https://www.brightenenergy.com/brighten-energy-shop-for-plans-home?rfid=PUCO" />
    <Price>0.0719</Price>
    <RateType>Fixed</RateType>
    <Renewable>100%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>24</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Showing your commitment to clean energy comes with long-term peace of mind: Your rate's guaranteed for up to 24 months. No extra fees. Special offer for new, Online customers.</OfferDetails>
  </Offer>
  <Offer ID="5cbc4111-17f1-4841-8cda-de5bb1e0bc77">
    <SupplierInfo SupplierCompanyName="CleanChoice Energy, Inc." CompanyName="CleanChoice Energy, Inc." SupplierAddress="1055 Thomas Jefferson St. NW" SupplierAddress2="650" SupplierCity="Washington" SupplierState="DC" SupplierZip="20007" SupplierPhone="(800) 460-4900" SupplierWebSiteUrl="https://cleanchoiceenergy.com/go/oh1" />
    <SupplierLinks TermsOfServiceURL="https://cleanchoiceenergy.com/disclosures/terms" SignUpNowURL="https://cleanchoiceenergy.com/go/oh1" />
    <Price>0.0720</Price>
    <RateType>Variable</RateType>
    <Renewable>100%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="Yes" Details="1 month introductory rate of $0.072/kWh" />
    <TermLength>1</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="Yes" Details="Choose 100% clean, pollution-free wind &amp; solar with CleanChoice Energy today and get a $50 Gift Card.* Sign up online at cleanchoiceenergy.com/go/oh1 or call 1-800-260-0184. *Terms Apply" />
    <OfferDetails></OfferDetails>
  </Offer>
  <Offer ID="7de85c7c-9650-4b4e-bbea-e408b7e32456">
    <SupplierInfo SupplierCompanyName="XOOM Energy Ohio LLC" CompanyName="XOOM Energy Ohio LLC" SupplierAddress="804 Carnegie Center" SupplierAddress2="" SupplierCity="Princeton" SupplierState="NJ" SupplierZip="08540" SupplierPhone="(888) 997-8979" SupplierWebSiteUrl="http://xoomenergy.com/en" />
    <SupplierLinks TermsOfServiceURL="https://xoomenergy.com/uploads/rates/terms-email/271501-en.pdf" SignUpNowURL="https://xoomenergy.com/en/residential/ohio/electricity/aep-ohio?der=1844" />
    <Price>0.0729</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>24</TermLength>
    <EarlyTerminationFee>$200.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>SureLock 24</OfferDetails>
  </Offer>
  <Offer ID="d67af34e-9d46-4f5c-973c-4caf602b983c">
    <SupplierInfo SupplierCompanyName="Powervine Energy LLC" CompanyName="Powervine Energy LLC" SupplierAddress="2100 West Loop South" SupplierAddress2="Suite 800" SupplierCity="Houston" SupplierState="TX" SupplierZip="77027" SupplierPhone="(888) 263-2806" SupplierWebSiteUrl="https://products.powervineenergy.com/?source=POW002" />
    <SupplierLinks TermsOfServiceURL="https://products.powervineenergy.com/?source=POW002" SignUpNowURL="https://products.powervineenergy.com/?source=POW002" />
    <Price>0.0733</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>12</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Fixed Rate. No hidden fees. No monthly service fee. No early cancellation fee.
</OfferDetails>
  </Offer>
  <Offer ID="7e001147-b8b8-41bd-8457-c33431ed5848">
    <SupplierInfo SupplierCompanyName="Stream Ohio Gas &amp; Electric LLC" CompanyName="Stream Ohio Gas &amp; Electric LLC" SupplierAddress="11208 Statesville Rd Suite 200" SupplierAddress2=" " SupplierCity="Huntersville" SupplierState="NC" SupplierZip="28078" SupplierPhone="(866) 447-8732" SupplierWebSiteUrl="https://www.mystream.com/" />
    <SupplierLinks TermsOfServiceURL="https://www.mystream.com/" SignUpNowURL="https://www.mystream.com/" />
    <Price>0.0740</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>6</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>6 Month Fixed Rate</OfferDetails>
  </Offer>
  <Offer ID="d88b84e1-8533-4997-9479-7ead6a11c2d8">
    <SupplierInfo SupplierCompanyName="Constellation NewEnergy Inc" CompanyName="Constellation NewEnergy Inc" SupplierAddress="1001 Louisiana Street Ste 23" SupplierAddress2="" SupplierCity="Houston" SupplierState="TX" SupplierZip="77002" SupplierPhone="(888) 989-4323" SupplierWebSiteUrl="http://www.constellation.com/rateboard" />
    <SupplierLinks TermsOfServiceURL="https://www.constellation.com/campaigns/rateboard.html" SignUpNowURL="http://www.constellation.com/rateboard" />
    <Price>0.0749</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>36</TermLength>
    <EarlyTerminationFee>$25.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails></OfferDetails>
  </Offer>
  <Offer ID="d52a2fee-af88-4587-83f8-b2d72ae8cf7b">
    <SupplierInfo SupplierCompanyName="IGS Energy" CompanyName="Interstate Gas Supply Inc" SupplierAddress="6100 Emerald Parkway" SupplierAddress2="" SupplierCity="Dublin" SupplierState="OH" SupplierZip="43016" SupplierPhone="(800) 280-4474" SupplierWebSiteUrl="https://www.igs.com/" />
    <SupplierLinks TermsOfServiceURL="https://www.igs.com/signup" SignUpNowURL="https://www.igs.com/signup" />
    <Price>0.0749</Price>
    <RateType>Fixed</RateType>
    <Renewable>100%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>12</TermLength>
    <EarlyTerminationFee>$99.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Fixed rate for 12 Billing Cycles. 100% Green Energy.</OfferDetails>
  </Offer>
  <Offer ID="3d0f96e5-3ead-470d-ab91-6ac5137de005">
    <SupplierInfo SupplierCompanyName="XOOM Energy Ohio LLC" CompanyName="XOOM Energy Ohio LLC" SupplierAddress="804 Carnegie Center" SupplierAddress2="" SupplierCity="Princeton" SupplierState="NJ" SupplierZip="08540" SupplierPhone="(888) 997-8979" SupplierWebSiteUrl="http://xoomenergy.com/en" />
    <SupplierLinks TermsOfServiceURL="https://xoomenergy.com/uploads/rates/terms-email/271498-en.pdf" SignUpNowURL="http://xoomenergy.com/en/residential/ohio/aep-ohio?der=3844" />
    <Price>0.0749</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>12</TermLength>
    <EarlyTerminationFee>$100.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="Yes" Details="Get the peace of mind you deserve with our RescueLock 12 fixed rate plan!  Enroll on RescueLock 12 and 5% of your monthly energy charges will be donated to PetSmart Charities!*" />
    <OfferDetails>RescueLock 12</OfferDetails>
  </Offer>
  <Offer ID="c3acfab1-937f-4abf-beca-30ac40f71ef9">
    <SupplierInfo SupplierCompanyName="Major Energy Electric Services LLC" CompanyName="Major Energy Services LLC" SupplierAddress="12140 Wickchester Ln " SupplierAddress2="Suite #100" SupplierCity="Houston" SupplierState="TX" SupplierZip="77079" SupplierPhone="(888) 625-6760" SupplierWebSiteUrl="https://majorenergy.com" />
    <SupplierLinks TermsOfServiceURL="https://majorenergy.com/enroll/?getproductpdf=1&amp;PromotionCode=&amp;ProductID=147601&amp;type=TOS&amp;title=Terms+of+Service" SignUpNowURL="https://majorenergy.com/enroll/" />
    <Price>0.0749</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>12</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="Yes" Details=" $100 Rebate offer available.&#xD;&#xA;" />
    <OfferDetails>Only applicable for new customers, existing customers with Major Energy please call 1-888-625-6760 to renew! A great choice for new customers to lock in a fixed rate. Enjoy peace of mind with a consistent rate for 12 months. With this energy plan, there is no monthly service fee and no early termination fee. After enrolling, you can be qualified to a $100 total rebate over the course of service. For more information, visit https://majorenergy.com/rebate/</OfferDetails>
  </Offer>
  <Offer ID="059a31f8-46c1-43f1-b479-51b2e66e378a">
    <SupplierInfo SupplierCompanyName="AP Gas &amp; Electric OH LLC" CompanyName="AP Gas &amp; Electric OH LLC" SupplierAddress="6161 Savoy Drive" SupplierAddress2="Suite 500" SupplierCity="Houston" SupplierState="TX" SupplierZip="77036" SupplierPhone="(877) 544-4857" SupplierWebSiteUrl="www.apge.com" />
    <SupplierLinks TermsOfServiceURL="https://enroll.apge.com/Offer/getDocument?documentId=42&amp;offerCode=OHP_RES_12_FP_Web_OH_SRB" SignUpNowURL="https://www.apge.com/applestoapples" />
    <Price>0.0750</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>12</TermLength>
    <EarlyTerminationFee>$150.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Enjoy a great rate for 12 months. Offer only available to new customers.</OfferDetails>
  </Offer>
  <Offer ID="c8cdbd3a-fee7-4224-9f19-ad2c9f0495c6">
    <SupplierInfo SupplierCompanyName="CleanSky Energy" CompanyName="Titan Gas LLC" SupplierAddress="3355 W. Alabama" SupplierAddress2="" SupplierCity="Houston" SupplierState="TX" SupplierZip="77098" SupplierPhone="(888) 355-6205" SupplierWebSiteUrl="https://rates.cleanskyenergy.com:8443/rates/index?promocode=APPLESZERO" />
    <SupplierLinks TermsOfServiceURL="https://rates.cleanskyenergy.com:8443/rates/DownloadDoc?path=86759dd0-b60b-4fd7-bcc6-a57f33be0922.pdf&amp;id_plan=52671" SignUpNowURL="https://rates.cleanskyenergy.com:8443/rates/index?promocode=APPLESZERO" />
    <Price>0.0758</Price>
    <RateType>Fixed</RateType>
    <Renewable>100%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>6</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="Yes" Details="This plan is for new customers only.&#xD;&#xA;Have a question about a plan or need help placing an order?&#xD;&#xA;Call us: 1-888-355-6205 | &#xD;&#xA;Email us: CustomerCare@TitanGasandPower.com" />
    <OfferDetails>Embrace Green 6</OfferDetails>
  </Offer>
  <Offer ID="198eb348-6e82-4538-83cc-40a641185b69">
    <SupplierInfo SupplierCompanyName="CleanSky Energy" CompanyName="Titan Gas LLC" SupplierAddress="3355 W. Alabama" SupplierAddress2="" SupplierCity="Houston" SupplierState="TX" SupplierZip="77098" SupplierPhone="(888) 355-6205" SupplierWebSiteUrl="https://rates.cleanskyenergy.com:8443/rates/index?promocode=APPLESZERO" />
    <SupplierLinks TermsOfServiceURL="https://rates.cleanskyenergy.com:8443/rates/DownloadDoc?path=86759dd0-b60b-4fd7-bcc6-a57f33be0922.pdf&amp;id_plan=59876" SignUpNowURL="https://rates.cleanskyenergy.com:8443/rates/index?promocode=APPLESZERO" />
    <Price>0.0765</Price>
    <RateType>Fixed</RateType>
    <Renewable>100%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>12</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="Yes" Details="This plan is for new customers only.&#xD;&#xA;Have a question about a plan or need help placing an order?&#xD;&#xA;Call us: 1-888-355-6205 | &#xD;&#xA;Email us: CustomerCare@TitanGasandPower.com" />
    <OfferDetails>Embrace Green 12
</OfferDetails>
  </Offer>
  <Offer ID="7f6e564d-b573-4d69-ae18-9001aee0ff63">
    <SupplierInfo SupplierCompanyName="Constellation NewEnergy Inc" CompanyName="Constellation NewEnergy Inc" SupplierAddress="1001 Louisiana Street  STE 23" SupplierAddress2="" SupplierCity="Houston" SupplierState="TX" SupplierZip="77002" SupplierPhone="(888) 898-4323" SupplierWebSiteUrl="http://www.constellation.com/rateboard" />
    <SupplierLinks TermsOfServiceURL="https://www.constellation.com/campaigns/rateboard.html" SignUpNowURL="http://www.constellation.com/rateboard" />
    <Price>0.0769</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>18</TermLength>
    <EarlyTerminationFee>$25.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails></OfferDetails>
  </Offer>
  <Offer ID="4625b648-ae98-4fa6-980f-5062be2f812d">
    <SupplierInfo SupplierCompanyName="Shipley Choice, LLC" CompanyName="Shipley Choice, LLC" SupplierAddress="415 Norway St" SupplierAddress2="" SupplierCity="York" SupplierState="PA" SupplierZip="17403" SupplierPhone="(844) 243-4201" SupplierWebSiteUrl="http://www.shipleyenergy.com/" />
    <SupplierLinks TermsOfServiceURL="www.shipleyenergy.com/enrollment" SignUpNowURL="www.shipleyenergy.com/enrollment" />
    <Price>0.0770</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>12</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Shopping for Electric Supply just got EASY! No monthly fee, no cancellation fee, and best of all a LOW fixed price to take control of your energy costs. Plus earn 3% REWARDS with Shipley Energy's Rewards Program. For New Customers Only.</OfferDetails>
  </Offer>
  <Offer ID="3519924a-472d-45e6-a12e-d184f05700c2">
    <SupplierInfo SupplierCompanyName="CleanSky Energy" CompanyName="Titan Gas LLC" SupplierAddress="3355 West Alabama" SupplierAddress2="" SupplierCity="Houston" SupplierState="TX" SupplierZip="77098" SupplierPhone="(888) 355-6205" SupplierWebSiteUrl="https://rates.cleanskyenergy.com:8443/rates/index?promocode=APPLESZERO" />
    <SupplierLinks TermsOfServiceURL="https://rates.cleanskyenergy.com:8443/rates/DownloadDoc?path=86759dd0-b60b-4fd7-bcc6-a57f33be0922.pdf&amp;id_plan=52671" SignUpNowURL="https://rates.cleanskyenergy.com:8443/rates/index?promocode=APPLESZERO" />
    <Price>0.0789</Price>
    <RateType>Fixed</RateType>
    <Renewable>100%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>24</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="Yes" Details="This plan is for new customers only.&#xD;&#xA;Have a question about a plan or need help placing an order?&#xD;&#xA;Call us: 1-888-355-6205 | &#xD;&#xA;Email us: CustomerCare@TitanGasandPower.com" />
    <OfferDetails>Embrace Green 24
</OfferDetails>
  </Offer>
  <Offer ID="928ba749-f0b8-49b8-88ce-953d83fde157">
    <SupplierInfo SupplierCompanyName="Shipley Choice, LLC" CompanyName="Shipley Choice, LLC" SupplierAddress="415 Norway St" SupplierAddress2="" SupplierCity="York" SupplierState="PA" SupplierZip="17403" SupplierPhone="(844) 243-4201" SupplierWebSiteUrl="http://www.shipleyenergy.com/" />
    <SupplierLinks TermsOfServiceURL="www.shipleyenergy.com/enrollment" SignUpNowURL="www.shipleyenergy.com/enrollment" />
    <Price>0.0790</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>24</TermLength>
    <EarlyTerminationFee>$99.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Shopping for Electric Supply just got EASY! No monthly fee and best of all a LOW fixed price to take control of your energy costs. Plus earn 3% REWARDS with Shipley Energy's Rewards Program. For New Customers Only.</OfferDetails>
  </Offer>
  <Offer ID="84b4f71b-6bec-4e1f-98d0-95e0a79ccc1f">
    <SupplierInfo SupplierCompanyName="AEP Energy Inc" CompanyName="AEP Energy Inc" SupplierAddress="1 Riverside Plaza" SupplierAddress2="20th Floor" SupplierCity="Columbus" SupplierState="OH" SupplierZip="43215" SupplierPhone="(877) 648-1922" SupplierWebSiteUrl="https://www.aepenergy.com/acquisition/campaign/offers/?cc=puco-aep&amp;utm_source=A2A&amp;utm_medium=shopping&amp;utm_campaign=aep_24" />
    <SupplierLinks TermsOfServiceURL="https://www.aepenergy.com/acquisition/campaign/offers/?cc=puco-aep&amp;utm_source=A2A&amp;utm_medium=shopping&amp;utm_campaign=aep_24" SignUpNowURL="https://www.aepenergy.com/acquisition/campaign/offers/?cc=puco-aep&amp;utm_source=A2A&amp;utm_medium=shopping&amp;utm_campaign=aep_24" />
    <Price>0.0790</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>24</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="Yes" Details="Enroll in this price plan and you’ll receive up to $120 Reward Dollars to use in AEP Energy Reward Store, our one-stop online marketplace filled with a variety of energy-saving products for your home, available exclusively for AEP Energy customers!  Offer is valid for both new and existing customers. For more information, visit AEPenergyrewardstore.com." />
    <OfferDetails>This offer is limited to residential customers of AEP Ohio and is valid for both new and existing customers.</OfferDetails>
  </Offer>
  <Offer ID="961866e8-8efc-4d23-af56-86151398c0d3">
    <SupplierInfo SupplierCompanyName="NRG Home" CompanyName="Reliant Energy Northeast LLC" SupplierAddress="P.O. Box 38781" SupplierAddress2="" SupplierCity="Philadelphia" SupplierState="PA" SupplierZip="19104" SupplierPhone="(855) 500-8703" SupplierWebSiteUrl="https://www.picknrg.com/en/us/lp/mp/ohchoice" />
    <SupplierLinks TermsOfServiceURL="https://www.picknrg.com/en/us/lp/mp/ohchoice" SignUpNowURL="https://www.picknrg.com/en/us/lp/mp/ohchoice" />
    <Price>0.0795</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="Yes" Details="Promotional supply rate for your first 12 billing cycles. After your promotional period ends, your ongoing electric supply rate will be variable and can change each month." />
    <TermLength>12</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Percentage cash back annually</OfferDetails>
  </Offer>
  <Offer ID="9c8facd0-c1d8-49b2-bad7-31701a6f643b">
    <SupplierInfo SupplierCompanyName="Utility Gas and Power" CompanyName="LE Energy LLC" SupplierAddress="2680 Corporate Park Dr" SupplierAddress2="Ste 100" SupplierCity="Opelika" SupplierState="AL" SupplierZip="36801" SupplierPhone="(855) 747-4931" SupplierWebSiteUrl="www.utilitygasandpower.com" />
    <SupplierLinks TermsOfServiceURL="https://www.utilitygasandpower.com/electricity-terms-condition-999" SignUpNowURL="https://www.utilitygasandpower.com/enroll?referral=a2a&amp;rate=7.99-12elec" />
    <Price>0.0799</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>12</TermLength>
    <EarlyTerminationFee>$150.00</EarlyTerminationFee>
    <MonthlyFee>$9.99</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Guaranteed fixed rate with price protection!</OfferDetails>
  </Offer>
  <Offer ID="8822360b-40c4-4156-8877-541ac4ecbf8d">
    <SupplierInfo SupplierCompanyName="Shipley Choice, LLC" CompanyName="Shipley Choice, LLC" SupplierAddress="415 Norway St" SupplierAddress2="" SupplierCity="York" SupplierState="PA" SupplierZip="17403" SupplierPhone="(844) 243-4201" SupplierWebSiteUrl="https://www.shipleyenergy.com/enrollment?product=el" />
    <SupplierLinks TermsOfServiceURL="www.shipleyenergy.com/enrollment" SignUpNowURL="https://www.shipleyenergy.com/enrollment?product=el" />
    <Price>0.0800</Price>
    <RateType>Fixed</RateType>
    <Renewable>100%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>12</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Support renewable energy today - choose Shipley Energy’s Green Electricity offer with 100% wind generation. No monthly fees and no cancellation fees. Plus, lock in this low fixed rate today and you’ll earn 3% REWARDS through Shipley Energy's Rewards. For New Customers Only.</OfferDetails>
  </Offer>
  <Offer ID="1cd1b3c9-8f7d-4970-b644-25237aaabfb8">
    <SupplierInfo SupplierCompanyName="IGS Energy" CompanyName="Interstate Gas Supply Inc" SupplierAddress="6100 Emerald Parkway" SupplierAddress2="" SupplierCity="Dublin" SupplierState="OH" SupplierZip="43016" SupplierPhone="(800) 280-4474" SupplierWebSiteUrl="www.igsenergy.com" />
    <SupplierLinks TermsOfServiceURL="https://enrollment.igsenergy.com/api/Web/TermsAndConditions/FCSP-I12MV-E-GGOHW-PROMO1-TF99-N/R/43016" SignUpNowURL="https://igs.com/signup/?campaignCode=Web-ApplesToApples&amp;utm_campaign=referral-applestoapples-general&amp;utm_source=applestoapples&amp;utm_medium=referral" />
    <Price>0.0809</Price>
    <RateType>Fixed</RateType>
    <Renewable>100%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>12</TermLength>
    <EarlyTerminationFee>$99.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="Yes" Details="Fixed rate for 12 Billing Cycles. 100% Ohio Wind Energy." />
    <OfferDetails>Fixed rate for 12 Billing Cycles. 100% Ohio Wind Energy.</OfferDetails>
  </Offer>
  <Offer ID="5608eab7-1da6-45f8-80fd-071794d7320b">
    <SupplierInfo SupplierCompanyName="Clearview Electric Inc" CompanyName="Clearview Electric Inc" SupplierAddress="901 Main Street STE 4700" SupplierAddress2="" SupplierCity="Dallas" SupplierState="OH" SupplierZip="75202" SupplierPhone="(800) 746-4702" SupplierWebSiteUrl="https://www.clearviewenergy.com/states/oh/" />
    <SupplierLinks TermsOfServiceURL="https://www.clearviewenergy.com/documents/tos/?productNum=23092" SignUpNowURL="https://www.clearviewenergy.com/enrollment/?productNum=19671&amp;ctype=Resi&amp;utilityid=99&amp;utilityname=ColumbusPower&amp;state=OH" />
    <Price>0.0819</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>12</TermLength>
    <EarlyTerminationFee>$150.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="promo term 12" />
    <OfferDetails>ClearGuarantee12: Fixed kilowatt product with a promotional rate that will not increase for the 12-month term of the promotion. 
</OfferDetails>
  </Offer>
  <Offer ID="cc9c6d3c-1183-46c5-a2e3-3365947c82ef">
    <SupplierInfo SupplierCompanyName="AEP Energy Inc" CompanyName="AEP Energy Inc" SupplierAddress="1 Riverside Plaza" SupplierAddress2="20th Floor" SupplierCity="Columbus" SupplierState="OH" SupplierZip="43215" SupplierPhone="(877) 648-1922" SupplierWebSiteUrl="https://www.aepenergy.com/acquisition/campaign/offers/?cc=puco-aep&amp;utm_source=A2A&amp;utm_medium=shopping&amp;utm_campaign=aep_36" />
    <SupplierLinks TermsOfServiceURL="https://www.aepenergy.com/acquisition/campaign/offers/?cc=puco-aep&amp;utm_source=A2A&amp;utm_medium=shopping&amp;utm_campaign=aep_36" SignUpNowURL="https://www.aepenergy.com/acquisition/campaign/offers/?cc=puco-aep&amp;utm_source=A2A&amp;utm_medium=shopping&amp;utm_campaign=aep_36" />
    <Price>0.0829</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>36</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="Yes" Details="Enroll in this price plan and you’ll receive up to $180 Reward Dollars to use in AEP Energy Reward Store, our one-stop online marketplace filled with a variety of energy-saving products for your home, available exclusively for AEP Energy customers!  Offer is valid for both new and existing customers. For more information, visit AEPenergyrewardstore.com." />
    <OfferDetails>This offer is limited to residential customers of AEP Ohio and is valid for both new and existing customers.</OfferDetails>
  </Offer>
  <Offer ID="0c55b263-4c9e-4d59-a7bb-5e7509354ab0">
    <SupplierInfo SupplierCompanyName="Clearview Electric Inc" CompanyName="Clearview Electric Inc" SupplierAddress="901 Main Street STE 4700" SupplierAddress2="" SupplierCity="Dallas" SupplierState="TX" SupplierZip="75202" SupplierPhone="(800) 746-4702" SupplierWebSiteUrl="https://www.clearviewenergy.com/states/oh/" />
    <SupplierLinks TermsOfServiceURL="https://www.clearviewenergy.com/documents/tos/?productNum=23096" SignUpNowURL="https://www.clearviewenergy.com/enrollment/?productNum=23096&amp;ctype=Resi&amp;utilityid=99&amp;utilityname=ColumbusPower&amp;state=OH" />
    <Price>0.0849</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>9</TermLength>
    <EarlyTerminationFee>$150.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>ClearGuarantee9
</OfferDetails>
  </Offer>
  <Offer ID="4d25b939-c757-4a8a-b708-b123e5ddab71">
    <SupplierInfo SupplierCompanyName="Public Power LLC" CompanyName="Public Power LLC" SupplierAddress="P.O. Box 660823" SupplierAddress2="" SupplierCity="Dallas" SupplierState="TX" SupplierZip="75266-0823" SupplierPhone="(888) 354-4415" SupplierWebSiteUrl="https://www.ppandu.com/?rifid=PUCO" />
    <SupplierLinks TermsOfServiceURL="https://www.ppandu.com/document?t=TermsAndConditions&amp;s=OH" SignUpNowURL="https://www.publicpowercompany.com/home/shop-plans?rfid=PUCO" />
    <Price>0.0849</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>12</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>With a fixed rate from Public Power, you'll get the peace of mind knowing your rate stays the same for 12 months.</OfferDetails>
  </Offer>
  <Offer ID="b57a6750-2f2b-4d8e-af9e-a3e02e5baa3a">
    <SupplierInfo SupplierCompanyName="Public Power LLC" CompanyName="Public Power LLC" SupplierAddress="P.O. Box 660823" SupplierAddress2="" SupplierCity="Dallas" SupplierState="TX" SupplierZip="75266-0823" SupplierPhone="(888) 354-4415" SupplierWebSiteUrl="https://www.ppandu.com/?rifid=PUCO" />
    <SupplierLinks TermsOfServiceURL="https://www.ppandu.com/document?t=TermsAndConditions&amp;s=OH" SignUpNowURL="https://www.publicpowercompany.com/home/shop-plans?rfid=PUCO" />
    <Price>0.0849</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>12</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>With a fixed rate from Public Power, you'll get the peace of mind knowing your rate stays the same for 12 months.</OfferDetails>
  </Offer>
  <Offer ID="fc10e117-505e-4c63-b4e1-0a97dd196701">
    <SupplierInfo SupplierCompanyName="Think Energy, LLC" CompanyName="Think Energy, LLC" SupplierAddress="P.O. Box 1288" SupplierAddress2="" SupplierCity="Greens Farms" SupplierState="CT" SupplierZip="06838" SupplierPhone="(888) 923-3633" SupplierWebSiteUrl="www.thinkenergy.com" />
    <SupplierLinks TermsOfServiceURL="https://thinkenergy-tmp.s3.us-west-2.amazonaws.com/enrollment-documents/c50be74c-9a94-441f-a014-b62226217bdf.pdf" SignUpNowURL="www.thinkenergy.com" />
    <Price>0.0850</Price>
    <RateType>Fixed</RateType>
    <Renewable>100%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>36</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails></OfferDetails>
  </Offer>
  <Offer ID="783b4589-a7d7-4fa2-8994-8b8d7323841d">
    <SupplierInfo SupplierCompanyName="AEP Energy Inc" CompanyName="AEP Energy Inc" SupplierAddress="1 Riverside Plaza" SupplierAddress2="20th Floor" SupplierCity="Columbus" SupplierState="OH" SupplierZip="43215" SupplierPhone="(877) 648-1922" SupplierWebSiteUrl="https://www.aepenergy.com/acquisition/campaign/offers/?cc=puco-aep&amp;utm_source=A2A&amp;utm_medium=shopping&amp;utm_campaign=aep_36" />
    <SupplierLinks TermsOfServiceURL="https://www.aepenergy.com/acquisition/campaign/offers/?cc=puco-aep&amp;utm_source=A2A&amp;utm_medium=shopping&amp;utm_campaign=aep_36" SignUpNowURL="https://www.aepenergy.com/acquisition/campaign/offers/?cc=puco-aep&amp;utm_source=A2A&amp;utm_medium=shopping&amp;utm_campaign=aep_36" />
    <Price>0.0869</Price>
    <RateType>Fixed</RateType>
    <Renewable>100%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>36</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="Yes" Details="Enroll in this price plan and you’ll receive up to $180 Reward Dollars to use in AEP Energy Reward Store, our one-stop online marketplace filled with a variety of energy-saving products for your home, available exclusively for AEP Energy customers!  Offer is valid for both new and existing customers. For more information, visit AEPenergyrewardstore.com." />
    <OfferDetails>This offer is limited to residential customers of AEP Ohio and is valid for both new and existing customers.</OfferDetails>
  </Offer>
  <Offer ID="647cbe1c-a4ef-40b6-86b6-f05eb96e246f">
    <SupplierInfo SupplierCompanyName="IDT Energy, Inc" CompanyName="IDT Energy, Inc" SupplierAddress="520 Broad Street" SupplierAddress2="" SupplierCity="Newark" SupplierState="NJ" SupplierZip="07102" SupplierPhone="(877) 887-6866" SupplierWebSiteUrl="www.IDTEnergy.com" />
    <SupplierLinks TermsOfServiceURL="https://idtenergy.com/terms/oh-terms" SignUpNowURL="https://idtenergy.com/" />
    <Price>0.0885</Price>
    <RateType>Fixed</RateType>
    <Renewable>100%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>4</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Lock in this price for 4 months with IDT Energy. Go to IDTEnergy.com for more details.</OfferDetails>
  </Offer>
  <Offer ID="052d11f0-f15f-4a41-85c7-c3232670667c">
    <SupplierInfo SupplierCompanyName="Direct Energy Services LLC" CompanyName="Direct Energy Services LLC" SupplierAddress="PO Box 180" SupplierAddress2="" SupplierCity="Tulsa" SupplierState="OK" SupplierZip="74101" SupplierPhone="(877) 698-7551" SupplierWebSiteUrl="https://www.directenergy.com/ohio/electricity-plans/msid/5360/pid/lb18?utm_source=BD&amp;utm_medium=OH-PTC" />
    <SupplierLinks TermsOfServiceURL="http://DirectEnergyDocuments.gesc.com/TCPage.aspx?Doc=DEROHDTDTCE" SignUpNowURL="www.directenergy.com/ohio/electricity-plans/green-electricity-24/msid/5360/pid/OSS?_utm_source=BD&amp;utm_medium=OH-PTC" />
    <Price>0.0889</Price>
    <RateType>Fixed</RateType>
    <Renewable>100%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>24</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Offer available online only! Offer available to new customers only.</OfferDetails>
  </Offer>
  <Offer ID="8c6b251e-8c93-4e8f-802d-5b763106cb06">
    <SupplierInfo SupplierCompanyName="Public Power LLC" CompanyName="Public Power LLC" SupplierAddress="P.O. Box 660823" SupplierAddress2="" SupplierCity="Dallas" SupplierState="TX" SupplierZip="75266-0823" SupplierPhone="(888) 354-4415" SupplierWebSiteUrl="https://www.ppandu.com/?rifid=PUCO" />
    <SupplierLinks TermsOfServiceURL="https://www.ppandu.com/document?t=TermsAndConditions&amp;s=OH" SignUpNowURL="https://www.publicpowercompany.com/home/shop-plans?rfid=PUCO" />
    <Price>0.0899</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>24</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>With a fixed rate from Public Power, you'll get the peace of mind knowing your rate stays the same for 24 months.</OfferDetails>
  </Offer>
  <Offer ID="275bd817-f028-4460-8cce-cdc4a668e1f2">
    <SupplierInfo SupplierCompanyName="Public Power LLC" CompanyName="Public Power LLC" SupplierAddress="P.O. Box 660823" SupplierAddress2="" SupplierCity="Dallas" SupplierState="TX" SupplierZip="75266-0823" SupplierPhone="(888) 354-4415" SupplierWebSiteUrl="https://www.ppandu.com/?rifid=PUCO" />
    <SupplierLinks TermsOfServiceURL="https://www.ppandu.com/document?t=TermsAndConditions&amp;s=OH" SignUpNowURL="https://www.publicpowercompany.com/home/shop-plans?rfid=PUCO" />
    <Price>0.0899</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>24</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>With a fixed rate from Public Power, you'll get the peace of mind knowing your rate stays the same for 24 months.</OfferDetails>
  </Offer>
  <Offer ID="8b7bb453-d98a-454d-a99b-1886264a86cd">
    <SupplierInfo SupplierCompanyName="IGS Energy" CompanyName="Interstate Gas Supply Inc" SupplierAddress="6100 Emerald Parkway" SupplierAddress2="" SupplierCity="Dublin" SupplierState="OH" SupplierZip="43016" SupplierPhone="(800) 280-4474" SupplierWebSiteUrl="www.igsenergy.com" />
    <SupplierLinks TermsOfServiceURL="https://enrollment.igsenergy.com/api/Web/TermsAndConditions/FOHP-I36MV-E-GG-PROMO1-TF99-N/R/43026" SignUpNowURL="https://igs.com/signup/?campaignCode=Web-ApplesToApples&amp;utm_campaign=referral-applestoapples-general&amp;utm_source=applestoapples&amp;utm_medium=referral" />
    <Price>0.0919</Price>
    <RateType>Fixed</RateType>
    <Renewable>100%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>36</TermLength>
    <EarlyTerminationFee>$199.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Fixed rate for 36 Billing Cycles. 100% Green Energy.</OfferDetails>
  </Offer>
  <Offer ID="f139a2c8-b2c6-4f23-8494-0f6009b8a58d">
    <SupplierInfo SupplierCompanyName="Clearview Electric Inc" CompanyName="Clearview Electric Inc" SupplierAddress="901 Main Street STE 4700" SupplierAddress2="" SupplierCity="Dallas" SupplierState="TX" SupplierZip="75202" SupplierPhone="(800) 746-4702" SupplierWebSiteUrl="https://www.clearviewenergy.com/states/oh/" />
    <SupplierLinks TermsOfServiceURL="https://www.clearviewenergy.com/documents/tos/?productNum=23090" SignUpNowURL="https://www.clearviewenergy.com/enrollment/?productNum=23090&amp;ctype=Resi&amp;utilityid=99&amp;utilityname=ColumbusPower&amp;state=OH" />
    <Price>0.0919</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>12</TermLength>
    <EarlyTerminationFee>$150.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>ClearCharge12 Fixed Kilowatt Rate Product
</OfferDetails>
  </Offer>
  <Offer ID="d645155e-72c6-4674-ad98-80e76872e06d">
    <SupplierInfo SupplierCompanyName="Tomorrow Energy Corp" CompanyName="Tomorrow Energy Corp" SupplierAddress="3151 Briarpark Dr Ste 100" SupplierAddress2="Suite 100" SupplierCity="Houston" SupplierState="TX" SupplierZip="77042" SupplierPhone="(888) 987-0388" SupplierWebSiteUrl="www.tomorrowenergy.com" />
    <SupplierLinks TermsOfServiceURL="https://tomorrowenergy.com/" SignUpNowURL="https://tomorrowenergy.com/" />
    <Price>0.0928</Price>
    <RateType>Fixed</RateType>
    <Renewable>100%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>12</TermLength>
    <EarlyTerminationFee>$75.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>This 12 month fixed rate is exclusive for AEP OHIO POWER customers only.</OfferDetails>
  </Offer>
  <Offer ID="fe8eb007-8d71-41f9-8f58-0c173c81bcd7">
    <SupplierInfo SupplierCompanyName="Public Power LLC" CompanyName="Public Power LLC" SupplierAddress="P.O. Box 660823" SupplierAddress2="" SupplierCity="Dallas" SupplierState="TX" SupplierZip="75266-0823" SupplierPhone="(888) 354-4415" SupplierWebSiteUrl="https://www.ppandu.com/?rifid=PUCO" />
    <SupplierLinks TermsOfServiceURL="https://www.ppandu.com/document?t=TermsAndConditions&amp;s=OH" SignUpNowURL="https://www.publicpowercompany.com/home/shop-plans?rfid=PUCO" />
    <Price>0.0949</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>36</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>With a fixed rate from Public Power, you'll get the peace of mind knowing your rate stays the same for 36 months.</OfferDetails>
  </Offer>
  <Offer ID="a97e4792-285b-40cc-b9b2-630d638f4320">
    <SupplierInfo SupplierCompanyName="Public Power LLC" CompanyName="Public Power LLC" SupplierAddress="P.O. Box 660823" SupplierAddress2="" SupplierCity="Dallas" SupplierState="TX" SupplierZip="75266-0823" SupplierPhone="(888) 354-4415" SupplierWebSiteUrl="https://www.ppandu.com/?rifid=PUCO" />
    <SupplierLinks TermsOfServiceURL="https://www.ppandu.com/document?t=TermsAndConditions&amp;s=OH" SignUpNowURL="https://www.publicpowercompany.com/home/shop-plans?rfid=PUCO" />
    <Price>0.0949</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>36</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>With a fixed rate from Public Power, you'll get the peace of mind knowing your rate stays the same for 36 months.</OfferDetails>
  </Offer>
  <Offer ID="f57d9345-3b5b-40ed-83fa-0eba5728391c">
    <SupplierInfo SupplierCompanyName="Inspire Energy Holdings, LLC" CompanyName="Inspire Energy Holdings, LLC" SupplierAddress="3402 Pico Blvd Suite 300" SupplierAddress2="" SupplierCity="Santa Monica" SupplierState="CA" SupplierZip="90405" SupplierPhone="(888) 990-9258" SupplierWebSiteUrl="https://www.inspirecleanenergy.com" />
    <SupplierLinks TermsOfServiceURL="https://www.inspirecleanenergy.com/plans?campaign_id=fab790f3-71d9-4541-97ff-e3da8a150946&amp;utm_source=OHA2A&amp;utm_medium=SHOPPING&amp;utm_campaign=A2AFixed12&amp;utm_content=AEP_OHPC&amp;channel_code=direct" SignUpNowURL="https://www.inspirecleanenergy.com/plans?campaign_id=fab790f3-71d9-4541-97ff-e3da8a150946&amp;utm_source=OHA2A&amp;utm_medium=SHOPPING&amp;utm_campaign=A2AFixed12&amp;utm_content=AEP_OHPC&amp;channel_code=direct" />
    <Price>0.0959</Price>
    <RateType>Fixed</RateType>
    <Renewable>100%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>12</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>All our plans unlock 100% renewable wind, solar, and hydro power for your home. No installations or hidden fees. </OfferDetails>
  </Offer>
  <Offer ID="0fa36dda-4521-45c5-a5ca-bd311c413d20">
    <SupplierInfo SupplierCompanyName="American Power &amp; Gas of Ohio, LLC" CompanyName="American Power &amp; Gas of Ohio, LLC" SupplierAddress="10601 S Belcher Rd" SupplierAddress2="" SupplierCity="Seminole" SupplierState="FL" SupplierZip="33777" SupplierPhone="(888) 669-2365" SupplierWebSiteUrl="www.americanpowerandgas.com" />
    <SupplierLinks TermsOfServiceURL="https://www.americanpowerandgas.com/wp-content/uploads/2021/11/OH_Fixed_Rate_Agreement_2020-10-02.pdf" SignUpNowURL="www.americanpowerandgas.com" />
    <Price>0.1039</Price>
    <RateType>Fixed</RateType>
    <Renewable>25%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>12</TermLength>
    <EarlyTerminationFee>$75.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Our 25% rebate is available to all of our customers.

We have sent out over $900,000 in rebates. Are you getting one?</OfferDetails>
  </Offer>
  <Offer ID="67206dbc-0827-4c2e-aa21-c2a053f89c7b">
    <SupplierInfo SupplierCompanyName="Josco Energy USA, LLC" CompanyName="Josco Energy USA, LLC" SupplierAddress="200 rt 17 south," SupplierAddress2="200C" SupplierCity="Mahwah" SupplierState="NJ" SupplierZip="07430" SupplierPhone="(877) 955-6726" SupplierWebSiteUrl="joscoenergy.com" />
    <SupplierLinks TermsOfServiceURL="joscoenergy.com" SignUpNowURL="joscoenergy.com/signup" />
    <Price>0.1059</Price>
    <RateType>Variable</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>24</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails></OfferDetails>
  </Offer>
  <Offer ID="7942621d-12ba-4591-aed2-9cc2122101d2">
    <SupplierInfo SupplierCompanyName="North American Power and Gas LLC" CompanyName="North American Power and Gas LLC" SupplierAddress="1500 Rankin Road, Suite 200" SupplierAddress2="" SupplierCity="Houston" SupplierState="TX" SupplierZip="77073" SupplierPhone="(877) 572-9965" SupplierWebSiteUrl="napower.com/rateboards" />
    <SupplierLinks TermsOfServiceURL="http://napower.com/terms-of-service" SignUpNowURL="www.napower.com/rateboards" />
    <Price>0.1129</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>18</TermLength>
    <EarlyTerminationFee>$10.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Fixed 18 month rate-Standard Product-Offer is for EnergyChoiceOhio website 
For New Customers.</OfferDetails>
  </Offer>
  <Offer ID="ca8f3c6d-d164-449d-b973-277352bab217">
    <SupplierInfo SupplierCompanyName="North American Power and Gas LLC" CompanyName="North American Power and Gas LLC" SupplierAddress="1500 Rankin Road, Suite 200" SupplierAddress2="" SupplierCity="Houston" SupplierState="TX" SupplierZip="77073" SupplierPhone="(877) 572-9965" SupplierWebSiteUrl="napower.com/rateboards" />
    <SupplierLinks TermsOfServiceURL="http://napower.com/terms-of-service" SignUpNowURL="www.napower.com/rateboards" />
    <Price>0.1169</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>16</TermLength>
    <EarlyTerminationFee>$10.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Fixed 16 month rate-Standard Product-Offer is for EnergyChoiceOhio website. For new customers.</OfferDetails>
  </Offer>
  <Offer ID="a9c45f5c-e608-4889-99b3-5122abbec276">
    <SupplierInfo SupplierCompanyName="Inspire Energy Holdings, LLC" CompanyName="Inspire Energy Holdings, LLC" SupplierAddress="3402 Pico Blvd Suite 300" SupplierAddress2="" SupplierCity="Santa Monica" SupplierState="CA" SupplierZip="90405" SupplierPhone="(888) 990-9258" SupplierWebSiteUrl="www.inspirecleanenergy.com" />
    <SupplierLinks TermsOfServiceURL="https://www.inspirecleanenergy.com/plans?campaign_id=26277661-14fd-4c42-a17d-f37115267d82&amp;utm_source=OHA2A&amp;utm_medium=SHOPPING&amp;utm_campaign=A2AFixed24&amp;utm_content=AEP_OHPC&amp;channel_code=direct" SignUpNowURL="https://www.inspirecleanenergy.com/plans?campaign_id=26277661-14fd-4c42-a17d-f37115267d82&amp;utm_source=OHA2A&amp;utm_medium=SHOPPING&amp;utm_campaign=A2AFixed24&amp;utm_content=AEP_OHPC&amp;channel_code=direct" />
    <Price>0.1199</Price>
    <RateType>Fixed</RateType>
    <Renewable>100%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>24</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>All our plans unlock 100% renewable wind, solar, and hydro power for your home. No installations or hidden fees. </OfferDetails>
  </Offer>
  <Offer ID="2340a370-0d15-4ebc-b969-c55edae2422e">
    <SupplierInfo SupplierCompanyName="Provision Power &amp; Gas LLC" CompanyName="Provision Power &amp; Gas LLC" SupplierAddress="P.O.Box" SupplierAddress2="" SupplierCity="Austin" SupplierState="TX" SupplierZip="78762" SupplierPhone="(800) 930-5427" SupplierWebSiteUrl="https://provisionpg.com/" />
    <SupplierLinks TermsOfServiceURL="https://www.getprovision.com/wp-content/uploads/2023/02/2155.pdf" SignUpNowURL="https://www.getprovision.com/enroll/" />
    <Price>0.1200</Price>
    <RateType>Fixed</RateType>
    <Renewable>100%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>12</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>$0.1200/kWh fixed for 12 months
</OfferDetails>
  </Offer>
  <Offer ID="393d8a59-445e-4d9a-a57f-05414e0ae564">
    <SupplierInfo SupplierCompanyName="North American Power and Gas LLC" CompanyName="North American Power and Gas LLC" SupplierAddress="1500 Rankin Road, Suite 200" SupplierAddress2="" SupplierCity="Houston" SupplierState="OH" SupplierZip="77073" SupplierPhone="(877) 572-9965" SupplierWebSiteUrl="www.napower.com" />
    <SupplierLinks TermsOfServiceURL="https://www.napower.com/terms-of-service#oh" SignUpNowURL="www.napower.com" />
    <Price>0.1224</Price>
    <RateType>Fixed</RateType>
    <Renewable>100%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>18</TermLength>
    <EarlyTerminationFee>$10.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Fixed 18 Month Rate - Renewable Product - Offer is for EnergyChoiceOhio website. New Customers. </OfferDetails>
  </Offer>
  <Offer ID="07440d58-1ea1-4608-800d-282e9c54a5b5">
    <SupplierInfo SupplierCompanyName="Median Energy Corp" CompanyName="Median Energy Corp" SupplierAddress="1 lethbridge plaza" SupplierAddress2="ste 2" SupplierCity="mahwah" SupplierState="NJ" SupplierZip="07430" SupplierPhone="(888) 316-5443" SupplierWebSiteUrl="www.medianenergy.com" />
    <SupplierLinks TermsOfServiceURL="https://static1.squarespace.com/static/5773a908e6f2e1fedd359c1b/t/5bbe3234a4222f91c8771369/1539191349399/Median+OH+Terms+and+Conditions+.pdf" SignUpNowURL="http://www.medianenergy.com/sign-up/" />
    <Price>0.1300</Price>
    <RateType>Variable</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>0</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails></OfferDetails>
  </Offer>
  <Offer ID="e93326ae-fb4d-41dc-b659-bcc1c55fd76b">
    <SupplierInfo SupplierCompanyName="XOOM Energy Ohio LLC" CompanyName="XOOM Energy Ohio LLC" SupplierAddress="804 Carnegie Center" SupplierAddress2="" SupplierCity="Princeton" SupplierState="NJ" SupplierZip="08540" SupplierPhone="(888) 997-8979" SupplierWebSiteUrl="http://xoomenergy.com/en" />
    <SupplierLinks TermsOfServiceURL="https://xoomenergy.com/uploads/rates/terms-email/272611-en.pdf" SignUpNowURL="http://xoomenergy.com/en/residential/?des=oh&amp;deu=72&amp;utm_source=puco&amp;utm_medium=signuplink&amp;utm_campaign=aep" />
    <Price>0.1339</Price>
    <RateType>Variable</RateType>
    <Renewable>50%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>1</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>SimpleClean - 50% Green</OfferDetails>
  </Offer>
  <Offer ID="c0071c70-7ef0-4b27-912b-e6db18375c20">
    <SupplierInfo SupplierCompanyName="Residents Energy, LLC" CompanyName="Residents Energy, LLC" SupplierAddress="315 North Main Street" SupplierAddress2="" SupplierCity="Jamestown" SupplierState="NY" SupplierZip="14701" SupplierPhone="(888) 828-7374" SupplierWebSiteUrl="www.ResidentsEnergy.com" />
    <SupplierLinks TermsOfServiceURL="https://residentsenergy.com/faq/terms-and-conditions/terms-conditions-ohio/" SignUpNowURL="https://residentsenergy.com/get-started/find-your-offer/" />
    <Price>0.1426</Price>
    <RateType>Fixed</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>12</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Lock in a per kWh rate for 12 months of electricity supply. No hidden fees or deposits. </OfferDetails>
  </Offer>
  <Offer ID="ecdfa61c-cb01-4abc-8295-5f3b9a48ee84">
    <SupplierInfo SupplierCompanyName="Residents Energy, LLC" CompanyName="Residents Energy, LLC" SupplierAddress="315 North Main Street" SupplierAddress2="" SupplierCity="Jamestown" SupplierState="NY" SupplierZip="14701" SupplierPhone="(888) 828-7374" SupplierWebSiteUrl="www.ResidentsEnergy.com" />
    <SupplierLinks TermsOfServiceURL="https://residentsenergy.com/faq/terms-and-conditions/terms-conditions-ohio/" SignUpNowURL="https://residentsenergy.com/get-started/find-your-offer/" />
    <Price>0.1626</Price>
    <RateType>Fixed</RateType>
    <Renewable>100%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>12</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>Lock in a per kWh rate for 12 months of electricity supply. No hidden fees or deposits. residentsenergy.com</OfferDetails>
  </Offer>
  <Offer ID="16d8e5cd-91e4-4116-979b-88ea1776a9d3">
    <SupplierInfo SupplierCompanyName="SunSea Energy OH LLC" CompanyName="SunSea Energy OH LLC" SupplierAddress="1930 Marlton Pike East, Suite N73" SupplierAddress2="" SupplierCity="Cherry Hill" SupplierState="NJ" SupplierZip="08003" SupplierPhone="(844) 277-7517" SupplierWebSiteUrl="https://www.sunseaenergy.com/" />
    <SupplierLinks TermsOfServiceURL="https://www.sunseaenergy.com/disclosures/" SignUpNowURL="https://www.sunseaenergy.com/register/" />
    <Price>0.1689</Price>
    <RateType>Variable</RateType>
    <Renewable>100%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>1</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="No" Details="" />
    <OfferDetails>SunSea Energy OH, LLC offers 100% Renewable Energy products.</OfferDetails>
  </Offer>
  <Offer ID="b564327c-9474-44d8-b12f-e11cb057945c">
    <SupplierInfo SupplierCompanyName="Atlantic Energy MD, LLC" CompanyName="Atlantic Energy MD, LLC" SupplierAddress="1166 W Newport Center Dr Suite 112" SupplierAddress2="" SupplierCity="Deerfield Beach" SupplierState="FL" SupplierZip="33442" SupplierPhone="(800) 917-9133" SupplierWebSiteUrl="www.atlanticenergyco.com" />
    <SupplierLinks TermsOfServiceURL="https://www.atlanticenergyco.com/" SignUpNowURL="https://www.atlanticenergyco.com/" />
    <Price>0.2090</Price>
    <RateType>Variable</RateType>
    <Renewable>0%</Renewable>
    <IntroductoryOffer IsIntroductoryOffer="No" Details="" />
    <TermLength>24</TermLength>
    <EarlyTerminationFee>$0.00</EarlyTerminationFee>
    <MonthlyFee>$0.00</MonthlyFee>
    <PromotionalOffer IsPromotionalOffer="Yes" Details="Smart Home Promotion –customer will receive energy efficient and smart home products delivered free of charge during the course of their enrollment.  See terms and conditions for details." />
    <OfferDetails></OfferDetails>
  </Offer>
</Offers>
`;

export function getOffers(): Array<Offer> {
  return Offer.fromXMLString(offerXML);
}

// Returns an array sorted so that i < j => a[i] "is a better deal than" a[j].
export function bestOffers(usageData: Array<number>,
                           useVariableRates: boolean = false,
                           renewableThreshold: number = 0.0): Array<Offer> {
  return getOffers().
              filter((offer) => (!offer.isVariable || useVariableRates) && !offer.isPromotionalOffer).
              filter((offer) => offer.renewable >= renewableThreshold).
              sort((a, b) => usageData.map((d) => a.getPrice(d)).reduce((x, y) => x + y, 0) -
                              usageData.map((d) => b.getPrice(d)).reduce((x, y) => x + y, 0));
}
