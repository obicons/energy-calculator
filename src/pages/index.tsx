import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import React, { useEffect, useState } from 'react'
import  { bestOffers, UtilityProvider, utilityProviders } from '@/offers'
import { addUserData, getTimestamp } from '@/backend'
import { useMyQueryState } from '@/querystate'
import siteName from '@/sitename'

interface PipelineStepProps<T> {
  item?: T;
  advance?: (newItem: T) => void;
  jumpToEnd?: (newItem: T) => void;
  goBack?: () => void;
  depth?: number;
}

interface MonthlyUsageFieldProps {
  month: string;
  updateUsage: (usage: number) => void;
  key: string;
  value?: number;
};

interface UserParameters {
  // kWh used each month.
  monthlyUsage: Array<number>;

  // Stores if the user is sure of their monthly usage.
  sureOfMonthlyUsage: boolean;

  // Controls if we consider variable rates.
  considerVariableRates: boolean;

  // Restricts consideration to suppliers who report the proportion of
  // renewable energy they source is guaranteed to meet this threshold.
  renewableThreshold: number;

  // Email to notify users.
  email: string;

  // How long the final contract is.
  termMonths: number;

  // Size of the house.
  houseSize: number;

  // Are we sure of our house size?
  sureOfHouseSize: boolean;

  // Number of bedrooms.
  // 0 means not set.
  bedroomCount: number;

  // The name of the user's utility company.
  utility: UtilityProvider;
}

interface LandingPageViewProps extends PipelineStepProps<UserParameters> {}

interface SupplierViewProps extends PipelineStepProps<UserParameters> {}

interface MonthlyUsageFormProps extends PipelineStepProps<UserParameters> {}

interface PipelineProps<T> extends PipelineStepProps<T> {
  children: React.ReactElement<PipelineStepProps<T>>[] | React.ReactElement<PipelineStepProps<T>>;
}

interface SquareFootInputProps extends PipelineStepProps<UserParameters> {}

interface NumberOfBedroomsInputProps extends PipelineStepProps<UserParameters> {}

interface VariableRateViewProps extends PipelineStepProps<UserParameters> {}

interface RenewablePreferenceViewProps extends PipelineStepProps<UserParameters> {}

interface EmailInputViewProps extends PipelineStepProps<UserParameters> {}

interface UtilitySelectionViewProps extends PipelineStepProps<UserParameters> {}

const months = [
  'january', 'february', 'march', 'april', 'may', 'june', 'july',
  'august', 'september', 'october', 'november', 'december',
];

export default function Home() {
  return (
    <>
      <Head>
        <title>{siteName}</title>
        <meta name="description" content={`${siteName} -- which energy supplier is right for me?`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg"/>
      </Head>
      <main className={styles.main}>
        <div className={styles.contentwrapper}>
          <SupplierSelectionApp/>
        </div>
        <div className={styles.footer}>
          Made by <a href="https://maxtaylor.dev" target="_blank">Max Taylor</a>.
          Copyright 2023.
          <div className={styles.credits}>
            <Link href="/credits">Credits</Link>
          </div>
        </div>
      </main>
    </>
  );
}

const Pipeline = <T,>(props: PipelineProps<T>): JSX.Element => {
  // Counts nested pipelines.
  const depth: number = props.depth ?? 0;

  const [value, setValue] = useMyQueryState(
    'parameters',
    {
      item: props.item,
      index: [0],
      history: [] as Array<Array<number>>,
    },
  )

  if (depth >= value.index.length) {
    value.index[depth] = 0;
  }

  const advance = (x: T) => {
    const newIndex = [...value.index];
    newIndex[depth] += 1;
    setValue(
      {index: newIndex, item: x, history: value.history.concat([value.index])},
      {index: [...value.index], item: x, history: value.history},
    );
  };

  const jumpToEnd = (x: T) => {
    const newIndex = [...value.index];
    newIndex[depth] = React.Children.toArray(props.children).length - 1;
    setValue(
      {index: newIndex, item: x, history: value.history.concat([value.index])},
      {index: [...value.index], item: x, history: value.history},
    );
  };

  const goBack = () => {
    if (value.history.length > 0) {
      const newHistory = [...value.history];
      const newIndex = newHistory.pop();
      setValue({
        index: newIndex ?? [],
        item: value.item,
        history: newHistory,
      })
    }
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
        goBack,
      },
    );
  }

  return <>{child}</>;
};

const SupplierSelectionApp = (): JSX.Element => (
    <Pipeline item={getDefaultParameters()}>
      <LandingPageView/>
      <UtilitySelectionView/>
      <MonthlyUsageInputView/>
      <SquareFootInputView/>
      <NumberOfBedroomsInputView/>
      <Pipeline>
        <VariableRateView/>
        <RenewablePreferenceView/>
        <EmailInputView/>
        <SupplierView/>
      </Pipeline>
    </Pipeline>
);

const UtilitySelectionView = (props: UtilitySelectionViewProps): JSX.Element => {
  const chooseProvider = (provider: UtilityProvider) => {
    if (props.advance !== undefined) {
      props.advance({
        ...(props.item ?? getDefaultParameters()),
        utility: provider,
      });
    }
  };

  return (
    <>
      <div className={styles.question}>
        Question 1: Who is your utility provider?
      </div>
      <div className={styles.description}>
        <Image
          className={styles.clipart}
          src="utility_icon.svg"
          alt=""
          width={150}
          height={150}/>
        <div className={styles.buttons}>
          {
          utilityProviders.map((provider) => (
            <button
              key={provider}
              onClick={() => chooseProvider(provider)}
              className={styles.promptbutton}>
                {provider}
            </button>
          ))
          }
        </div>
      </div>
    </>
  );
};

const LandingPageView = (props: LandingPageViewProps): JSX.Element => (
  <>
    <div className={styles.question}>
      {siteName}:
      <br/>
      Find the energy supplier that&apos;s right for you.
    </div>
    <div className={styles.description}>
      <Image
        className={styles.clipart}
        src="energy_icon.svg"
        alt=""
        width={150}
        height={150}/>
      <p>
        Choosing an energy supplier is tricky. We&apos;re here to help.
        Just answer a few simple questions, and we&apos;ll show you a supplier
        that&apos;s right for you.
      </p>
      <br/>
      <form className={styles.form}>
        <button
          type="button"
          className={styles.promptbutton}
          onClick={() => {props.advance !== undefined ? props.advance(getDefaultParameters()) : null}}>
          Get Started
        </button>
      </form>
    </div>
  </>
);

const SupplierView = (props: SupplierViewProps): JSX.Element => {
  let monthlyUsage: Array<number> = [];
  if (props.item !== undefined &&
      props.item.monthlyUsage.length == months.length &&
      props.item.sureOfMonthlyUsage) {
    monthlyUsage = props.item.monthlyUsage;
  } else if (props.item !== undefined &&
             props.item.sureOfHouseSize &&
             props.item.houseSize > 0) {
    monthlyUsage = estimateMonthlyEnergyFromSquareFeet(props.item.houseSize);
  } else if (props.item !== undefined && props.item.bedroomCount !== 0) {
      // According to ChatGPT, this is true:
      const bedroomsToSquareFeet: {[_: number]: number} = {
        1: 600,
        2: 900,
        3: 1350,
        4: 2000,
        5: 2500,
      };
      const clippedBedrooms = Math.min(props.item.bedroomCount, 5);
      const squareFeet = bedroomsToSquareFeet[clippedBedrooms];
      monthlyUsage = estimateMonthlyEnergyFromSquareFeet(squareFeet);
  }

  const orderedSuppliers = bestOffers(
    monthlyUsage,
    props.item?.considerVariableRates,
    props.item?.renewableThreshold || 0.0,
    props.item?.utility ?? 'AEP',
  );

  const bestOffer = orderedSuppliers[0];

  let recorded = false;
  useEffect(() => {
    if (!recorded && props.item?.email !== '') {
      const newUserData = {
        ...(props.item || getDefaultParameters()),
        termMonths: bestOffer.termLength,
        created: getTimestamp(),
      };
      addUserData(newUserData);
      recorded = true;
    }
  }, []);

  const onGoBack = () => props.goBack !== undefined ? props.goBack() : undefined;

  return (
    <>
      <div className={styles.question}>Based on your answers, this supplier looks like the best option for you:</div>
      <div className={styles.description}>
        <Image
          className={styles.clipart}
          src="savings_icon.svg"
          alt=""
          width={150}
          height={150}/>
        <p><strong><a href={bestOffer.supplierURL} target="_blank">{bestOffer.supplier}</a>: </strong>
            ${bestOffer.pricePerkwH} per kWh,
            ${bestOffer.monthlyPrice} monthly service price,
            {bestOffer.isVariable ? " variable rate. " : " fixed rate. "}
            <br/>
            Remember: Carefully review any agreement you sign, and make sure the
            rates you agree to match the advertised rates.
        </p>
        <p className={styles.buyacoffee}>
          If this tool helped save you money,
          you can return the favor by <a href="https://www.buymeacoffee.com/mtaylor" target="_blank">buying the developers a coffee</a>.
        </p>
        <br/>
        <button className={styles.promptbutton} type="button" onClick={onGoBack} id="monthly-usage-next-button">
          Edit Responses
        </button>
      </div>
    </>
  );
};

const MonthlyUsageInputView = (props: MonthlyUsageFormProps): JSX.Element => (
  <>
    <div id="header">
      <div className={styles.question}>Question 2: How much energy do you use each month?</div>
      <div className={styles.description}>
        <Image
          className={styles.clipart}
          src="chart_icon.svg"
          alt=""
          width={150}
          height={150}/>
        <p>
          You can find this data on your power bill.
          We need this to determine the cheapest supplier that satisfies your demand because
          some suppliers charge fixed monthly service fees in exchange for a lower price per kWh.
          This is a good deal if your demand is large enough.
        </p>
      </div>
    </div>
    <div id="monthly-usage-app">
      <MonthlyUsageForm {...props}/>
    </div>
  </>
);

const MonthlyUsageForm = (props: MonthlyUsageFormProps): JSX.Element => {
  const initMonthToUsage = new Map<string, number>();
  months.forEach((month, idx) => {
    if (props.item?.monthlyUsage[idx] !== undefined) {
      initMonthToUsage.set(month, props.item?.monthlyUsage[idx]);
    }
  });

  const [monthToUsage, setMonthToUsage] = useState(new Map<string, number>(initMonthToUsage));

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
        sureOfMonthlyUsage: true,
      });
    }
  };

  const onSkip = (e: React.FormEvent) => {
    e.preventDefault();
    if (props.advance !== undefined) {
      props.advance({
        ...(props.item || getDefaultParameters()),
        sureOfMonthlyUsage: false,
      });
    }
  };

  const readyToSubmit = Array.from(monthToUsage.keys()).length === months.length;

  const onGoBack = () => props.goBack !== undefined ? props.goBack() : undefined;

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.monthlyusageflex}>
      {
        months.map(month => <MonthlyUsageField
            month={month}
            updateUsage={(usage) => updateUsage(month, usage)}
            key={month}
            value={monthToUsage.get(month)}/>)
      }
      </div>
      <button className={styles.promptbutton} type="button" onClick={onSkip} id="monthly-usage-not-sure-button">I&apos;m not sure</button>
      <button className={styles.promptbutton} type="submit" id="monthly-usage-next-button" disabled={!readyToSubmit}>Next</button>
      <button className={styles.promptbutton} type="button" onClick={onGoBack} id="monthly-usage-next-button">Back</button>
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
        className={styles.promptinput}
        id={props.month + "-usage"}
        value={props.value || ""}
        placeholder={"Enter " + capitalize(props.month) + " kWh"}
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
      <div className={styles.question}>How large is your home?</div>
      <div className={styles.description}>
        <Image
          className={styles.clipart}
          src="house_icon.svg"
          alt=""
          width={150}
          height={150}/>
        <p>
          We&apos;ll do our best to estimate your energy consumption based on your home size.
          Note that the result will be less accurate than if you used historical data.
        </p>
      </div>
    </div>
    <div id="monthly-usage-app">
      <SquareFootInputForm {...props}/>
    </div>
  </>
);

const SquareFootInputForm = (props: SquareFootInputProps): JSX.Element => {
  let defaultValue = parseFloat('NaN');
  if (props.item !== undefined && props.item.houseSize !== 0) {
    defaultValue = props.item.houseSize;
  }

  const [squareFeet, updateSquareFeet] = useState(defaultValue);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateSquareFeet(parseFloat(event.currentTarget.value.replaceAll(',', '')));
  };

  const onSkip = (e: React.FormEvent) => {
    e.preventDefault();
    if (props.advance !== undefined) {
      props.advance({
        ...(props.item || getDefaultParameters()),
        sureOfHouseSize: false,
      });
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (props.jumpToEnd !== undefined) {
      props.jumpToEnd({
        ...(props.item || getDefaultParameters()),
        houseSize: squareFeet,
        sureOfHouseSize: true,
      });
    }
  };

  const readyToSubmit = !isNaN(squareFeet);

  const onGoBack = () => props.goBack !== undefined ? props.goBack() : undefined;

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <input
        className={styles.promptinput}
        onChange={handleInputChange}
        type="text"
        value={!isNaN(squareFeet) ? squareFeet : ""}
        placeholder="House size (square feet)"
        required={true}
        pattern="([0-9],?)+"
        title="This field must be a number"/>
      <br/>
      <button className={styles.promptbutton} type="button" onClick={onSkip}>I&apos;m not sure</button>
      <button className={styles.promptbutton} type="submit" disabled={!readyToSubmit}>Next</button>
      <button className={styles.promptbutton} type="button" onClick={onGoBack}>Back</button>
    </form>
  );
};

const NumberOfBedroomsInputView = (props: NumberOfBedroomsInputProps): JSX.Element => (
  <>
    <div id="header">
      <div className={styles.question}>How many bedrooms do you have?</div>
      <div className={styles.description}>
        <Image
            className={styles.clipart}
            src="bedroom_icon.svg"
            alt=""
            width={150}
            height={150}/>
        <p>
          We&apos;ll do our best to estimate your home size based on the number of bedrooms you have.
          Then, we&apos;ll use your home size to estimate your energy usage.
          Note that the result will be less accurate than if you used historical data.
        </p>
      </div>
    </div>
    <div id="monthly-usage-app">
      <NumberOfBedroomsInputForm {...props}/>
    </div>
  </>
);

const NumberOfBedroomsInputForm = (props: NumberOfBedroomsInputProps): JSX.Element => {
  let defaultBedrooms = parseFloat('NaN');
  if (props.item !== undefined && props.item?.bedroomCount !== 0) {
    defaultBedrooms = props.item?.bedroomCount ;
  }

  const [bedrooms, updateBedrooms] = useState(defaultBedrooms);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateBedrooms(parseFloat(event.currentTarget.value.replaceAll(',', '')));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (props.jumpToEnd !== undefined) {
      const clippedBedrooms = Math.min(5, bedrooms);
      // const squareFeet = bedroomsToSquareFeet[clippedBedrooms];
      props.jumpToEnd({
        ...(props.item || getDefaultParameters()),
        bedroomCount: bedrooms,
      });
    }
  };

  const onGoBack = () => props.goBack !== undefined ? props.goBack() : undefined;

  const readyToSubmit = !isNaN(bedrooms);

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <input
        className={styles.promptinput}
        onChange={handleInputChange}
        type="text"
        placeholder="Number of bedrooms"
        required={true}
        pattern="([0-9],?)+"
        value={!isNaN(bedrooms) ? bedrooms : ""}
        title="This field must be a number"/>
      <br/>
      <button className={styles.promptbutton} type="submit" disabled={!readyToSubmit}>Next</button>
      <button className={styles.promptbutton} type="button" onClick={onGoBack}>Back</button>
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

  const onGoBack = () => props.goBack !== undefined ? props.goBack() : undefined;

  return (
    <>
      <div className={styles.question}>Question 3: Are you interested in variable rate suppliers?</div>
      <div className={styles.description}>
        <Image
          className={styles.clipart}
          src="variable_icon.svg"
          alt=""
          width={150}
          height={150}/>
        <p>
          Variable rate suppliers often offer cheaper prices per kWh, but
          can increase prices when energy demand is high.
        </p>
      </div>
      <form className={styles.form}>
        <div className={styles.buttons}>
          <button className={styles.promptbutton} type="button" onClick={() => onClick(true)}>
            Yes, use variable rate suppliers.
          </button>
          <button className={styles.promptbutton} type="button" onClick={() => onClick(false)}>
          No, don&apos;t use variable rate suppliers.
          </button>
          <button className={styles.promptbutton} type="button" onClick={onGoBack}>Back</button>
        </div>
      </form>
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

  const onGoBack = () => props.goBack !== undefined ? props.goBack() : undefined;

  return (
    <>
      <div className={styles.question}>Question 4: How important is using renewable energy to you?</div>
      <div className={styles.description}>
        <Image
          className={styles.clipart}
          src="windmill_icon.svg"
          alt=""
          width={150}
          height={150}/>
        <p>
          Some suppliers promise to purchase energy from renewable energy
          generators. Renewable energy is usually more expensive, but it
          is more environmentally friendly.
        </p>
      </div>
      <form className={styles.form}>
        <button className={styles.promptbutton} type="button" onClick={() => onClick(0.0)}>
          Not important at all.
        </button>
        <button className={styles.promptbutton} type="button" onClick={() => onClick(25.0)}>
          Somewhat important.
        </button>
        <button className={styles.promptbutton} type="button" onClick={() => onClick(50.0)}>
          Very important.
        </button>
        <button className={styles.promptbutton} type="button" onClick={onGoBack}>Back</button>
      </form>
    </>
  );
};

const EmailInputView = (props: EmailInputViewProps): JSX.Element => {
  const [email, setEmail] = useState('');

  const handleEmailInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value);
  };

  const isEmailEnabled = email.length > 0;

  const advance = () => {
    if (props.advance !== undefined) {
      props.advance({
        ...(props.item || getDefaultParameters()),
      });
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (props.advance !== undefined) {
      const newData = {
        ...(props.item || getDefaultParameters()),
        email,
      };
      props.advance(newData);
    }
  };

  const onGoBack = () => props.goBack !== undefined ? props.goBack() : undefined;

  return (
    <>
      <div className={styles.question}>
        Question 5: Would you like us to email you a new recommendation when your contract ends?
      </div>
      <div className={styles.description}>
        <Image
            className={styles.clipart}
            src="mail_icon.svg"
            alt=""
            width={150}
            height={150}/>
        <p>
          We&apos;ll send you a new recommendation based on your answers when your current contract ends.
          We&apos;ll never send you any spam or marketing emails.
          Your email will never be shared with anyone.
        </p>
        <form className={styles.form} onSubmit={onSubmit}>
          <input
            className={styles.promptinput}
            type="email"
            placeholder="Enter your email address"
            onChange={handleEmailInput}/>
          <br/>
          <button
            className={styles.promptbutton}
            type="submit"
            disabled={!isEmailEnabled}>
              Yes, email me.
          </button>
          <button
            className={styles.promptbutton}
            type="button"
            onClick={advance}>
              No thanks.
          </button>
          <button className={styles.promptbutton} type="button" onClick={onGoBack}>Back</button>
        </form>
      </div>
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
  sureOfMonthlyUsage: false,
  considerVariableRates: false,
  renewableThreshold: 0.0,
  email: '',
  termMonths: 0,
  houseSize: 0,
  sureOfHouseSize: false,
  bedroomCount: 0,
  utility: 'AEP',
});

const capitalize = (str: string): string => {
  if (str.length == 0) {
    return '';
  }
  return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
};