import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { productSchema } from '@/schemas/productSchemas';
import { Button } from '@/components/common/Button';
import { FormField } from '@/components/common/FormField';
import { Modal } from '@/components/common/Modal';
import { SelectField } from '@/components/common/SelectField';
import { Image as ImageIcon, Upload } from 'lucide-react';
import './ProductEditorModal.css';

const defaultValues = {
  name: '',
  description: '',
  category: '',
  price: 0,
  stock: 0,
  status: 'active',
  image: '',
  locationTag: '',
  deliveryMinutes: 15,
  isFastDelivery: false,
};

export function ProductEditorModal({ open, product, onClose, onSubmit }) {
  const [imagePreview, setImagePreview] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  const isFastDelivery = watch('isFastDelivery');

  useEffect(() => {
    if (product) {
      reset({
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
      });
      setImagePreview(product.image || '');
    } else {
      reset(defaultValues);
      setImagePreview('');
    }
  }, [product, reset, open]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result.toString();
      setImagePreview(result);
      setValue('image', result, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
  };

  return (
    <Modal
      description="Use this form to manage your storefront catalog with pricing, stock, location, and fulfillment details."
      onClose={onClose}
      open={open}
      title={product ? 'Edit product' : 'Add a new product'}
    >
      <form
        className="grid gap-x-6 gap-y-2 md:grid-cols-2"
        onSubmit={handleSubmit(async (values) => {
          await onSubmit(values);
          onClose();
        })}
      >
        <div className="md:col-span-2">
          <FormField
            error={errors.name?.message}
            label="Product Name"
            placeholder="e.g. Organic Honey"
            {...register('name')}
          />
        </div>

        <div className="md:col-span-2">
          <FormField
            as="textarea"
            error={errors.description?.message}
            label="Description"
            placeholder="Describe your product features and benefits..."
            {...register('description')}
          />
        </div>

        <FormField
          error={errors.category?.message}
          label="Category"
          placeholder="e.g. Groceries, Clothing, Electronics"
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

        <FormField
          error={errors.price?.message}
          label="Price (Local Currency)"
          min={1}
          type="number"
          {...register('price')}
        />
        <FormField
          error={errors.stock?.message}
          label="Available Stock"
          min={0}
          type="number"
          {...register('stock')}
        />

        {/* ---- IMAGE UPLOAD using native label → input (most reliable) ---- */}
        <div className="md:col-span-2 mt-2">
          <span className="block text-[11px] font-black uppercase tracking-[0.15em] text-white/50 ml-1 mb-2">
            Product Image
          </span>

          {/* The label IS the clickable area — clicking it opens the file picker natively */}
          <label
            htmlFor="product-image-upload"
            className="group relative flex h-36 w-full cursor-pointer items-center justify-center rounded-[12px] border-2 border-dashed transition-all overflow-hidden"
            style={{ borderColor: '#cbd5e1', backgroundColor: '#f8fbfc' }}
          >
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full w-full object-contain p-2 rounded-xl"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-[16px]">
                  <Upload className="h-6 w-6 text-white mb-1" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Change image</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 select-none" style={{ color: '#94a3b8' }}>
                <ImageIcon className="h-10 w-10" />
                <span className="text-xs font-bold uppercase tracking-wider">Click to upload image</span>
                <span className="text-[10px] text-white/20">JPG, PNG, WEBP supported</span>
              </div>
            )}

            {/* Hidden native file input — triggered by the parent label */}
            <input
              id="product-image-upload"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleFileChange}
            />
          </label>

          {/* Hidden field to hold the base64 value for Zod validation */}
          <input type="hidden" {...register('image')} />

          <div className="min-h-[1.25rem] px-1 mt-1">
            {errors.image && (
              <span className="text-[11px] font-bold text-red-400 flex items-center gap-1 shake">
                {errors.image.message}
              </span>
            )}
          </div>
        </div>

        {/* Location + conditional Delivery ETA */}
        <div className={isFastDelivery ? 'md:col-span-1' : 'md:col-span-2'}>
          <FormField
            error={errors.locationTag?.message}
            label="Location (City/Area)"
            placeholder="e.g. Kathmandu, Sector 4"
            {...register('locationTag')}
          />
        </div>

        {isFastDelivery && (
          <FormField
            error={errors.deliveryMinutes?.message}
            label="Delivery ETA (minutes)"
            min={1}
            type="number"
            {...register('deliveryMinutes')}
          />
        )}

        <div className="md:col-span-2 mt-2">
          <label className="flex items-center gap-3 rounded-[12px] border px-5 py-4 text-sm font-medium cursor-pointer transition-all active:scale-[0.98]" style={{ borderColor: '#e2eaed', backgroundColor: '#f8fbfc', color: '#475569' }}>
            <input
              type="checkbox"
              className="h-5 w-5 rounded-md border-white/20 bg-white/5 text-orange-500 focus:ring-orange-500/40"
              {...register('isFastDelivery')}
            />
            <span>
              Mark as <span className="text-orange-400 font-bold">15-minute delivery</span> eligible
            </span>
          </label>
        </div>

        <div className="md:col-span-2 flex justify-end gap-3 pt-6">
          <Button onClick={onClose} type="button" variant="ghost">
            Cancel
          </Button>
          <Button loading={isSubmitting} type="submit" variant="secondary">
            {product ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
