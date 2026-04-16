import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { PRODUCT_CATEGORIES } from '@/utils/constants';
import { LOCATION_OPTIONS } from '@/utils/constants';
import { productSchema } from '@/schemas/productSchemas';
import { Button } from '@/components/common/Button';
import { FormField } from '@/components/common/FormField';
import { Modal } from '@/components/common/Modal';
import { SelectField } from '@/components/common/SelectField';
import './ProductEditorModal.css';

const defaultValues = {
  name: '',
  description: '',
  category: 'Groceries',
  price: 0,
  stock: 0,
  status: 'active',
  image: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&w=800&q=80',
  locationTag: 'Bhubaneswar',
  deliveryMinutes: 15,
  isFastDelivery: true,
};

export function ProductEditorModal({ open, product, onClose, onSubmit }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(
      product
        ? {
            id: product.id,
            name: product.name,
            description: product.description,
            category: product.category,
            price: product.price,
            stock: product.stock,
            status: product.status,
            image: product.image,
            locationTag: product.locationTag,
            deliveryMinutes: product.deliveryMinutes,
            isFastDelivery: product.isFastDelivery,
          }
        : defaultValues,
    );
  }, [product, reset]);

  return (
    <Modal
      description="Use this form to manage your storefront catalog with pricing, stock, location, and fulfillment details."
      onClose={onClose}
      open={open}
      title={product ? 'Edit product' : 'Add a new product'}
    >
      <form
        className="grid gap-4 md:grid-cols-2"
        onSubmit={handleSubmit(async (values) => {
          await onSubmit(values);
          onClose();
        })}
      >
        <div className="md:col-span-2">
          <FormField error={errors.name?.message} label="Product Name" placeholder="Organic honey jar" {...register('name')} />
        </div>
        <div className="md:col-span-2">
          <FormField
            as="textarea"
            error={errors.description?.message}
            label="Description"
            placeholder="Write a concise product pitch for buyers."
            {...register('description')}
          />
        </div>
        <SelectField
          error={errors.category?.message}
          label="Category"
          options={PRODUCT_CATEGORIES.map((category) => ({ value: category, label: category }))}
          {...register('category')}
        />
        <SelectField
          error={errors.status?.message}
          label="Status"
          options={[
            { value: 'active', label: 'Active' },
            { value: 'draft', label: 'Draft' },
          ]}
          {...register('status')}
        />
        <FormField error={errors.price?.message} label="Price" min={1} step="1" type="number" {...register('price')} />
        <FormField error={errors.stock?.message} label="Stock" min={0} step="1" type="number" {...register('stock')} />
        <div className="md:col-span-2">
          <FormField error={errors.image?.message} label="Image URL" placeholder="https://..." type="url" {...register('image')} />
        </div>
        <SelectField
          error={errors.locationTag?.message}
          label="Location Tag"
          options={LOCATION_OPTIONS.map((location) => ({ value: location, label: location }))}
          {...register('locationTag')}
        />
        <FormField
          error={errors.deliveryMinutes?.message}
          label="Delivery ETA (minutes)"
          min={10}
          step="1"
          type="number"
          {...register('deliveryMinutes')}
        />
        <label className="md:col-span-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
          <input className="h-4 w-4 rounded border-slate-300 text-coral focus:ring-coral" type="checkbox" {...register('isFastDelivery')} />
          Mark as 15-minute delivery eligible
        </label>
        <div className="md:col-span-2 flex justify-end gap-3">
          <Button onClick={onClose} type="button" variant="ghost">
            Cancel
          </Button>
          <Button loading={isSubmitting} type="submit" variant="secondary">
            {product ? 'Save changes' : 'Create product'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
