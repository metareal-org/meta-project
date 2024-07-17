import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";

interface WithdrawFormProps {
  freeAmount: number;
  onWithdraw: (amount: string) => void;
}

interface WithdrawFormValues {
  amount: string;
}

const WithdrawForm: React.FC<WithdrawFormProps> = ({ freeAmount, onWithdraw }) => (
  <Formik
    initialValues={{ amount: "" }}
    validationSchema={Yup.object().shape({
      amount: Yup.number().positive("Amount must be positive").max(freeAmount, "Amount exceeds free balance").required("Amount is required"),
    })}
    onSubmit={(values: WithdrawFormValues, { setSubmitting }: FormikHelpers<WithdrawFormValues>) => {
      onWithdraw(values.amount);
      setSubmitting(false);
    }}
  >
    {({ isSubmitting, setFieldValue }) => (
      <Form className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="flex-grow">
            <Field name="amount">
              {({ field }: { field: any }) => (
                <Input
                  type="number"
                  placeholder="Enter amount to withdraw"
                  {...field}
                  min="0"
                  max={freeAmount.toString()}
                  className="w-full text-lg py-3 px-4"
                />
              )}
            </Field>
          </div>
          <Button
            type="button"
            onClick={() => setFieldValue("amount", freeAmount.toString())}
            variant="outline"
            className="whitespace-nowrap px-6 py-3 text-lg"
          >
            Max
          </Button>
        </div>
        <ErrorMessage name="amount" component="div" className="text-red text-sm mt-2" />
      </Form>
    )}
  </Formik>
);

interface PortfolioWidgetWithdrawAlertProps {
  user: { address: string };
  metaAmount: { total: number; free: number; locked: number };
  onWithdraw: (amount: string) => void;
}

const PortfolioWidgetWithdrawAlert: React.FC<PortfolioWidgetWithdrawAlertProps> = ({ user, metaAmount, onWithdraw }) => (
  <div className="space-y-4">
    <div className="grid  gap-2">
      <div className="grid">
        <h3 className="text-sm ">Wallet Address</h3>
        <p className="text-sm break-all rounded">{user?.address}</p>
      </div>
      <div className="flex w-full gap-2   justify-between">
        <div className="grid p-2 rounded border w-full">
          <h3 className="text-sm ">Total </h3>
          <div className="text-xs">{metaAmount.total} META</div>
        </div>
        <div className="grid p-2 rounded border w-full">
          <h4 className="text-sm ">Free </h4>
          <div className="text-xs">{metaAmount.free} META</div>
        </div>
        <div className="grid p-2 rounded border w-full">
          <h4 className="text-sm ">Locked </h4>
          <div className="text-xs">{metaAmount.locked} META</div>
        </div>
      </div>
    </div>
    <div className="border-t pt-4">
      <h3 className="text-sm  mb-2">Amount</h3>
      <WithdrawForm freeAmount={metaAmount.free} onWithdraw={onWithdraw} />
    </div>
  </div>
);

export default PortfolioWidgetWithdrawAlert;
