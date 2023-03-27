import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import React, { ReactNode, useState } from 'react'
import  { bestOffers } from '@/offers'

interface PipelineStepProps<T> {
  item?: T;
  advance?: (newItem: T) => void;
  jumpToEnd?: (newItem: T) => void;
  goBack?: () => void;
}

interface MonthlyUsageFieldProps {
  month: string;
  updateUsage: (usage: number) => void;
  key: string;
};

interface SupplierViewProps extends PipelineStepProps<Array<number>> {}

interface MonthlyUsageFormProps extends PipelineStepProps<Array<number>> {}

interface PipelineProps<T> {
  children: React.ReactElement<PipelineStepProps<T>>[] | React.ReactElement<PipelineStepProps<T>>;
  initialValue: T;
}

interface SquareFootInputProps extends PipelineStepProps<Array<number>> {}

interface NumberOfBedroomsInputProps extends PipelineStepProps<Array<number>> {}

interface BackButtonProps {
  goBack?: () => void;
}

const months = [
  'january', 'february', 'march', 'april', 'may', 'june', 'july',
  'august', 'september', 'october', 'november', 'december',
];

export default function Home() {
  return (
    <>
      <Head>
        <title>EnRX</title>
        <meta name="description" content="EnRX -- which energy supplier is right for me?" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.description}>
          <SupplierSelectionApp/>
        </div>
      </main>
    </>
  );
}

const Pipeline = <T,>(props: PipelineProps<T>): JSX.Element => {
  const [value, setValue] = useState({item: props.initialValue, index: 0});

  const advance = (x: T) => {
    setValue({index: value.index + 1, item: x});
  };

  const jumpToEnd = (x: T) => {
    setValue({index: React.Children.toArray(props.children).length - 1, item: x});
  };

  const goBack = () => {
    if (value.index > 0) {
      setValue({index: value.index - 1, item: value.item});
    }
  };

  let child = React.Children.toArray(props.children).at(value.index);
  if (React.isValidElement<PipelineStepProps<T>>(child)) {
    child = React.cloneElement(
      child as React.ReactElement<PipelineStepProps<T>>,
      {
        advance,
        jumpToEnd,
        goBack,
        item: value.item,
      },
    );
  }

  return <>{child}</>;
};

const SupplierSelectionApp = (): JSX.Element => (
    <Pipeline initialValue={[] as Array<number>}>
      <MonthlyUsageInput/>
      <SquareFootInput/>
      <NumberOfBedroomsInput/>
      <SupplierView/>
    </Pipeline>
);

const SupplierView = (props: SupplierViewProps): JSX.Element => {
  const orderedSuppliers = bestOffers(props.item || []);
  const bestOffer = orderedSuppliers[0];
  return (
    <>
      <strong><a href={bestOffer.supplierURL}>{bestOffer.supplier}</a>:</strong>
      <p>${bestOffer.pricePerkwH} per kWh,
         ${bestOffer.monthlyPrice} monthly service price.</p>
    </>
  );
};

const MonthlyUsageInput = (props: MonthlyUsageFormProps): JSX.Element => (
  <>
    <div id="header">
      <h2>How much energy do you use each month?</h2>
      <h3>
        You can find this data on your power bill.
        We need this data to determine the cheapest supplier that satisfies your demand because
        some suppliers charge fixed monthly service fees in exchange for a lower price per kWh.
        This is a good deal if your demand is large enough.
      </h3>
    </div>
    <div id="monthly-usage-app">
      <MonthlyUsageForm {...props}/>
    </div>
  </>
);

const MonthlyUsageForm = (props: MonthlyUsageFormProps): JSX.Element => {
  const [monthToUsage, setMonthToUsage] = useState(new Map<string, number>());

  const updateUsage = (month: string, usage: number) => {
    monthToUsage.set(month, usage);
    setMonthToUsage(monthToUsage);
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (props.jumpToEnd !== undefined) {
      props.jumpToEnd(months.map(month => monthToUsage.get(month) || 0.));
    }
  };

  const onSkip = (e: React.FormEvent) => {
    e.preventDefault();
    if (props.advance !== undefined) {
      props.advance([]);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      {
        months.map(month => <MonthlyUsageField
            month={month}
            updateUsage={(usage) => updateUsage(month, usage)}
            key={month}/>)
      }
      <BackButton/>
      <button type="button" onClick={onSkip} id="monthly-usage-not-sure-button">I&apos;m not sure</button>
      <button type="submit" id="monthly-usage-next-button">Next</button>
    </form>
  );
};

const MonthlyUsageField = (props: MonthlyUsageFieldProps): JSX.Element => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.updateUsage(parseFloat(event.currentTarget.value.replaceAll(',', '')));
  };

  return (
    <>
      <input
        id={props.month + "-usage"}
        placeholder={capitalize(props.month) + " kWh"}
        onChange={handleInputChange}
        required={true}
        pattern="([0-9],?)+"
        title="This field must be a number."/>
      <br/>
    </>
  );
};

const SquareFootInput = (props: SquareFootInputProps): JSX.Element => (
  <>
    <div id="header">
      <h2>How large is your home?</h2>
      <h3>We&apos;ll do our best to estimate your energy consumption based on your home size.
          Note that the result will be less accurate than if you used historical data.</h3>
    </div>
    <div id="monthly-usage-app">
      <SquareFootInputForm {...props}/>
    </div>
  </>
);

const SquareFootInputForm = (props: SquareFootInputProps): JSX.Element => {
  const [squareFeet, updateSquareFeet] = useState(0.0);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateSquareFeet(parseFloat(event.currentTarget.value.replaceAll(',', '')));
  };

  const onSkip = (e: React.FormEvent) => {
    e.preventDefault();
    if (props.advance !== undefined) {
      props.advance([]);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (props.jumpToEnd !== undefined) {
      props.jumpToEnd(estimateMonthlyEnergyFromSquareFeet(squareFeet));
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        onChange={handleInputChange}
        type="text"
        placeholder="House size (square feet)"
        required={true}
        pattern="([0-9],?)+"
        title="This field must be a number"/>
      <br/>
      <BackButton goBack={props.goBack}/>
      <button type="button" onClick={onSkip}>I&apos;m not sure</button>
      <button type="submit">Next</button>
    </form>
  );
};

const NumberOfBedroomsInput = (props: NumberOfBedroomsInputProps): JSX.Element => (
  <>
    <div id="header">
      <h2>How many bedrooms do you have?</h2>
      <h3>We&apos;ll do our best to estimate your home size based on the number of bedrooms you have.
          Then, we&apos;ll use your home size to estimate your energy usage.
          Note that the result will be less accurate than if you used historical data.</h3>
    </div>
    <div id="monthly-usage-app">
      <NumberOfBedroomsInputForm {...props}/>
    </div>
  </>
);

const NumberOfBedroomsInputForm = (props: NumberOfBedroomsInputProps): JSX.Element => {
  const [bedrooms, updateBedrooms] = useState(0);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateBedrooms(parseFloat(event.currentTarget.value.replaceAll(',', '')));
  };

  // According to ChatGPT, this is true:
  const bedroomsToSquareFeet: {[_: number]: number} = {
    1: 600,
    2: 900,
    3: 1350,
    4: 2000,
    5: 2500,
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (props.jumpToEnd !== undefined) {
      const clippedBedrooms = Math.min(5, bedrooms);
      const squareFeet = bedroomsToSquareFeet[clippedBedrooms];
      props.jumpToEnd(estimateMonthlyEnergyFromSquareFeet(squareFeet));
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        onChange={handleInputChange}
        type="text"
        placeholder="Number of bedrooms"
        required={true}
        pattern="([0-9],?)+"
        title="This field must be a number"/>
      <br/>
      <BackButton goBack={props.goBack}/>
      <button type="submit">Next</button>
    </form>
  );
};

const BackButton = (props: BackButtonProps): JSX.Element => (
    <button type="button"
            onClick={props.goBack}
            disabled={props.goBack === undefined}>
      Back
    </button>
);

// According to Google, this is usally true.
const kWhPerSquareFoot = .5;

const estimateMonthlyEnergyFromSquareFeet =
  (squareFeet: number): Array<number> =>
    months.map((_) => squareFeet * kWhPerSquareFoot);

const capitalize = (str: string): string => {
  if (str.length == 0) {
    return '';
  }
  return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
};