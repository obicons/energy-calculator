import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import React, { ReactNode, useEffect, useState } from 'react'
import  { bestOffers } from '@/offers'
import { useQueryState, queryTypes } from 'next-usequerystate'

interface PipelineStepProps<T> {
  item?: T;
  advance?: (newItem: T) => void;
  jumpToEnd?: (newItem: T) => void;
  depth?: number;
}

interface MonthlyUsageFieldProps {
  month: string;
  updateUsage: (usage: number) => void;
  key: string;
};

interface UserParameters {
  // kWh used each month.
  monthlyUsage: Array<number>;
  // Controls if we consider variable rates.
  considerVariableRates: boolean;
  // Restricts consideration to suppliers who report the proportion of
  // renewable energy they source is guaranteed to meet this threshold.
  renewableThreshold: number;
}

interface SupplierViewProps extends PipelineStepProps<UserParameters> {}

interface MonthlyUsageFormProps extends PipelineStepProps<UserParameters> {}

interface PipelineProps<T> extends PipelineStepProps<T> {
  children: React.ReactElement<PipelineStepProps<T>>[] | React.ReactElement<PipelineStepProps<T>>;
}

interface SquareFootInputProps extends PipelineStepProps<UserParameters> {}

interface NumberOfBedroomsInputProps extends PipelineStepProps<UserParameters> {}

interface VariableRateViewProps extends PipelineStepProps<UserParameters> {}

interface RenewablePreferenceViewProps extends PipelineStepProps<UserParameters> {}

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
  // Counts nested pipelines.
  const depth: number = props.depth ?? 0;

  const [value, setValue] = useQueryState(
    'parameters',
    {
      history: 'push',
      ...queryTypes.json<{item?: T, index: Array<number>}>().
                    withDefault({item: props.item, index: [0]})
    },
  );

  if (depth >= value.index.length) {
    value.index[depth] = 0;
  }

  const advance = (x: T) => {
    const newIndex = [...value.index];
    newIndex[depth] += 1;
    setValue({index: newIndex, item: x});
  };

  const jumpToEnd = (x: T) => {
    const newIndex = [...value.index];
    newIndex[depth] = React.Children.toArray(props.children).length - 1;
    setValue({index: newIndex, item: x});
  };

  let child = React.Children.toArray(props.children).at(value.index[depth]);
  if (React.isValidElement<PipelineStepProps<T>>(child)) {
    const childDepth = depth + (child.type === Pipeline ? 1 : 0);
    child = React.cloneElement(
      child as React.ReactElement<PipelineStepProps<T>>,
      {
        advance,
        jumpToEnd,
        item: value.item,
        depth: childDepth,
      },
    );
  }

  return <>{child}</>;
};

const SupplierSelectionApp = (): JSX.Element => (
    <Pipeline item={getDefaultParameters()}>
      <MonthlyUsageInputView/>
      <SquareFootInputView/>
      <NumberOfBedroomsInputView/>
      <Pipeline>
        <VariableRateView/>
        <RenewablePreferenceView/>
        <SupplierView/>
      </Pipeline>
    </Pipeline>
);

const SupplierView = (props: SupplierViewProps): JSX.Element => {
  const orderedSuppliers = bestOffers(
    props.item?.monthlyUsage || [],
    props.item?.considerVariableRates,
    props.item?.renewableThreshold || 0.0,
  );
  const bestOffer = orderedSuppliers[0];
  return (
    <>
      <h2>Based on your answers, this supplier looks like the best option for you:</h2>
      <strong><a href={bestOffer.supplierURL}>{bestOffer.supplier}</a></strong>
      <p>${bestOffer.pricePerkwH} per kWh,
         ${bestOffer.monthlyPrice} monthly service price,
         {bestOffer.isVariable ? " variable rate. " : " fixed rate. "}
         <br/>
         Remember: Carefully review any agreement you sign, and make sure the
         rates you agree to match the advertised rates.
      </p>
    </>
  );
};

const MonthlyUsageInputView = (props: MonthlyUsageFormProps): JSX.Element => (
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
    const newMonthToUsage = new Map(monthToUsage);
    if (!isNaN(usage)) {
      newMonthToUsage.set(month, usage);
    } else {
      newMonthToUsage.delete(month);
    }
    setMonthToUsage(newMonthToUsage);
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (props.jumpToEnd !== undefined) {
      props.jumpToEnd({
        ...(props.item || getDefaultParameters()),
        monthlyUsage: months.map(month => monthToUsage.get(month) || 0.),
      });
    }
  };

  const onSkip = (e: React.FormEvent) => {
    e.preventDefault();
    if (props.advance !== undefined) {
      props.advance(props.item || getDefaultParameters());
    }
  };

  const readyToSubmit = Array.from(monthToUsage.keys()).length === months.length;

  return (
    <form onSubmit={onSubmit}>
      {
        months.map(month => <MonthlyUsageField
            month={month}
            updateUsage={(usage) => updateUsage(month, usage)}
            key={month}/>)
      }
      <button type="button" onClick={onSkip} id="monthly-usage-not-sure-button">I&apos;m not sure</button>
      <button type="submit" id="monthly-usage-next-button" disabled={!readyToSubmit}>Next</button>
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

const SquareFootInputView = (props: SquareFootInputProps): JSX.Element => (
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
  const [squareFeet, updateSquareFeet] = useState(parseFloat('NaN'));

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateSquareFeet(parseFloat(event.currentTarget.value.replaceAll(',', '')));
  };

  const onSkip = (e: React.FormEvent) => {
    e.preventDefault();
    if (props.advance !== undefined) {
      props.advance(props.item || getDefaultParameters());
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (props.jumpToEnd !== undefined) {
      props.jumpToEnd({
        ...(props.item || getDefaultParameters()),
        monthlyUsage: estimateMonthlyEnergyFromSquareFeet(squareFeet),
      });
    }
  };

  const readyToSubmit = !isNaN(squareFeet);

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
      <button type="button" onClick={onSkip}>I&apos;m not sure</button>
      <button type="submit" disabled={!readyToSubmit}>Next</button>
    </form>
  );
};

const NumberOfBedroomsInputView = (props: NumberOfBedroomsInputProps): JSX.Element => (
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
  const [bedrooms, updateBedrooms] = useState(parseFloat('NaN'));

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
      props.jumpToEnd({
        ...(props.item || getDefaultParameters()),
        monthlyUsage: estimateMonthlyEnergyFromSquareFeet(squareFeet),
      });
    }
  };

  const readyToSubmit = !isNaN(bedrooms);

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
      <button type="submit" disabled={!readyToSubmit}>Next</button>
    </form>
  );
};

const VariableRateView = (props: VariableRateViewProps) => {
  const onClick = (useVariableRates: boolean) => {
    if (props.advance !== undefined) {
      props.advance({
        ...(props.item || getDefaultParameters()),
        considerVariableRates: useVariableRates,
      });
    }
  };

  return (
    <>
      <h2>Are you interested in variable rate suppliers?</h2>
      <h3>Variable rate suppliers often offer cheaper prices per kWh, but
          can increase prices when energy demand is high.</h3>
      <button type="button" onClick={() => onClick(true)}>
        Yes, use variable rate suppliers.
      </button>
      <button type="button" onClick={() => onClick(false)}>
        No, don&apos;t use variable rate suppliers.
      </button>
    </>
  );
};

const RenewablePreferenceView = (props: RenewablePreferenceViewProps): JSX.Element => {
  const onClick = (renewableThreshold: number) => {
    if (props.advance !== undefined) {
      props.advance({
        ...(props.item || getDefaultParameters()),
        renewableThreshold,
      });
    }
  };

  return (
    <>
      <h2>How important is using renewable energy to you?</h2>
      <h3>Some suppliers promise to purchase energy from renewable energy
          generators. Renewable energy is usually more expensive, but it
          is more environmentally friendly.
      </h3>
      <button type="button" onClick={() => onClick(0.0)}>
        Not important at all.
      </button>
      <button type="button" onClick={() => onClick(25.0)}>
        Somewhat important.
      </button>
      <button type="button" onClick={() => onClick(50.0)}>
        Very important.
      </button>
    </>
  );
};

// According to Google, this is usally true.
const kWhPerSquareFoot = .5;

const estimateMonthlyEnergyFromSquareFeet =
  (squareFeet: number): Array<number> =>
    months.map((_) => squareFeet * kWhPerSquareFoot);

const getDefaultParameters = (): UserParameters => ({
  monthlyUsage: [],
  considerVariableRates: false,
  renewableThreshold: 0.0,
});

const capitalize = (str: string): string => {
  if (str.length == 0) {
    return '';
  }
  return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
};