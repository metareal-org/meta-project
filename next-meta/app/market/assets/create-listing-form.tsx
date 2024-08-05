import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CreateListingFormProps {
  onCreate: (data: { asset_type: string; amount: number; price_in_bnb: number }) => void;
}

const validationSchema = Yup.object().shape({
  asset_type: Yup.string().required('Asset type is required'),
  amount: Yup.number().required('Amount is required').min(1, 'Amount must be at least 1'),
  price_in_bnb: Yup.number().required('Price is required').min(0, 'Price must be 0 or higher'),
});

export const CreateListingForm: React.FC<CreateListingFormProps> = ({ onCreate }) => {
  return (
    <Formik
      initialValues={{ asset_type: '', amount: 1, price_in_bnb: 0 }}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        onCreate({
          asset_type: values.asset_type,
          amount: values.amount,
          price_in_bnb: values.price_in_bnb
        });
        resetForm();
      }}
    >
      {({ setFieldValue }) => (
        <Form className="space-y-4">
          <div>
            <Select onValueChange={(value) => setFieldValue('asset_type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select asset type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gift">Gift</SelectItem>
                <SelectItem value="ticket">Ticket</SelectItem>
                <SelectItem value="wood">Wood</SelectItem>
                <SelectItem value="stone">Stone</SelectItem>
                <SelectItem value="sand">Sand</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
              </SelectContent>
            </Select>
            <ErrorMessage name="asset_type" component="div" className="text-red-500" />
          </div>
          <div>
            <Field
              as={Input}
              type="number"
              name="amount"
              placeholder="Amount"
            />
            <ErrorMessage name="amount" component="div" className="text-red-500" />
          </div>
          <div>
            <Field
              as={Input}
              type="number"
              name="price_in_bnb"
              step="0.00000001"
              placeholder="Price in BNB"
            />
            <ErrorMessage name="price_in_bnb" component="div" className="text-red-500" />
          </div>
          <Button type="submit">Create Listing</Button>
        </Form>
      )}
    </Formik>
  );
};