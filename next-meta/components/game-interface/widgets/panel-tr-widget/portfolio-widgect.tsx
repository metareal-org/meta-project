import { useState } from "react";
import { useUserStore } from "@/store/player-store/useUserStore";
import numeral from "numeral";
import { HandCoins, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import useAlertStore from "@/store/gui-store/useAlertStore";
import { Input } from "@/components/ui/input";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';

interface WithdrawFormProps {
  freeAmount: number;
  onWithdraw: (amount: string) => void;
}

interface WithdrawFormValues {
  amount: string;
}

const WithdrawForm: React.FC<WithdrawFormProps> = ({ freeAmount, onWithdraw }) => (
  <Formik
    initialValues={{ amount: '' }}
    validationSchema={Yup.object().shape({
      amount: Yup.number().positive('Amount must be positive').max(freeAmount, 'Amount exceeds free balance').required('Amount is required'),
    })}
    onSubmit={(values: WithdrawFormValues, { setSubmitting }: FormikHelpers<WithdrawFormValues>) => {
      onWithdraw(values.amount);
      setSubmitting(false);
    }}
  >
    {({ isSubmitting, setFieldValue }) => (
      <Form className="space-y-4">
        <div className="flex items-center space-x-2">
          <Field name="amount">
            {({ field }: { field: any }) => (
              <Input
                type="number"
                placeholder="Enter amount to withdraw"
                {...field}
                min="0"
                max={freeAmount.toString()}
              />
            )}
          </Field>
          <Button type="button" onClick={() => setFieldValue('amount', freeAmount.toString())} variant="outline">
            Max
          </Button>
        </div>
        <ErrorMessage name="amount" component="div" className="text-red-500 text-sm" />
        <Button type="submit" disabled={isSubmitting}>Withdraw</Button>
      </Form>
    )}
  </Formik>
);

const PortfolioWidget: React.FC = () => {
  const [showLocked, setShowLocked] = useState(false);
  const { metaAmount, cpAmount, user } = useUserStore();
  const { openAlert } = useAlertStore();

  const handleWithdraw = (amount: string) => {
    console.log("Withdrawal successful", amount);
    useAlertStore.getState().closeAlert("metaWithdraw");
  };

  const showWithdrawAlert = () => {
    openAlert({
      id: "metaWithdraw",
      title: "Withdraw Meta",
      description: (
        <div className="space-y-4">
          <p>Address: {user?.address}</p>
          <p>Total Balance: {metaAmount.total} META</p>
          <p>Free Balance: {metaAmount.free} META</p>
          <p>Locked Balance: {metaAmount.locked} META</p>
          <WithdrawForm freeAmount={metaAmount.free} onWithdraw={handleWithdraw} />
        </div>
      ),
      buttons: [{ label: "Cancel", variant: "outline", onClick: () => {} }],
    });
  };

  return (
    <div className="fixed top-[42px] right-4 z-50">
      <TooltipProvider delayDuration={100}>
        <div className="flex items-center gap-2">
          <div onClick={showWithdrawAlert}>
            <TokenDisplay
              icon="/assets/images/tokens/meta.png"
              amount={showLocked ? metaAmount.locked : metaAmount.free}
              name="Meta"
              showLocked={showLocked}
              freeAmount={metaAmount.free}
              lockedAmount={metaAmount.locked}
              totalAmount={metaAmount.total}
            />
          </div>
          <TokenDisplay
            icon="/assets/images/tokens/cp.webp"
            amount={showLocked ? cpAmount.locked : cpAmount.free}
            name="CP"
            showLocked={showLocked}
            freeAmount={cpAmount.free}
            lockedAmount={cpAmount.locked}
            totalAmount={cpAmount.total}
          />
          <ToggleIndicator showLocked={showLocked} setShowLocked={setShowLocked} />
        </div>
      </TooltipProvider>
    </div>
  );
};

interface TokenDisplayProps {
  icon: string;
  amount: number;
  name: string;
  showLocked: boolean;
  freeAmount: number;
  lockedAmount: number;
  totalAmount: number;
}

const TokenDisplay: React.FC<TokenDisplayProps> = ({ icon, amount, name, showLocked, freeAmount, lockedAmount, totalAmount }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <div className="bg-teal-fg/90 border-2 relative border-teal rounded-full px-3 py-1 flex flex-col items-center justify-center cursor-pointer">
        <div className="flex items-center space-x-2">
          <img src={icon} alt={name} className="w-6 h-6" />
          <span className="text-white font-medium text-sm">{numeral(amount).format("0,0")} {name}</span>
        </div>
        <span className="text-xs absolute -top-4 bg-teal/90 left-[16px] rounded-b-none rounded px-2 text-teal-fg text-teal-200">
          {showLocked ? "Locked" : "Free"}
        </span>
      </div>
    </TooltipTrigger>
    <TooltipContent side="bottom" className="bg-teal-fg text-white p-3 rounded-lg shadow-lg">
      <div className="space-y-1">
        <p className="font-semibold">{name} Details:</p>
        <p>Free: {numeral(freeAmount).format("0,0")}</p>
        <p>Locked: {numeral(lockedAmount).format("0,0")}</p>
        <p>Total: {numeral(totalAmount).format("0,0")}</p>
      </div>
    </TooltipContent>
  </Tooltip>
);

interface ToggleIndicatorProps {
  showLocked: boolean;
  setShowLocked: React.Dispatch<React.SetStateAction<boolean>>;
}

const ToggleIndicator: React.FC<ToggleIndicatorProps> = ({ showLocked, setShowLocked }) => (
  <Button
    size="icon"
    variant="ghost"
    onClick={() => setShowLocked(!showLocked)}
    className={`!p-1.5 border-2 border-teal bg-teal-fg/90 !rounded-full text-xs font-medium transition-colors
      ${showLocked ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
  >
    {showLocked ? <PiggyBank /> : <HandCoins />}
  </Button>
);

export default PortfolioWidget;