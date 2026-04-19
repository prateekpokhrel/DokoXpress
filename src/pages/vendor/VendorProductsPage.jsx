import { useState, useEffect, useCallback } from 'react';
import { PackagePlus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/common/Skeleton';
import { DashboardTopbar } from '@/components/navigation/DashboardTopbar';
import { ProductEditorModal } from '@/components/product/ProductEditorModal';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { formatCurrency } from '@/utils/format';
import { apiClient } from '@/services/api/client';
import './VendorProductsPage.css';

export function VendorProductsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [isHydrating, setIsHydrating] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Guard: vendor only
  if (!user || user.role !== 'vendor') return null;

  const vendorId = Number(user.id);

  // Fetch this vendor's products from backend 
  const fetchProducts = useCallback(async () => {
    setIsHydrating(true);
    try {
      const res = await apiClient.get('/products');
      const all = res.data ?? [];
      const mine = all
        .filter((p) => Number(p.vendorId) === vendorId)
        .sort((a, b) => b.id - a.id);
      setProducts(mine);
    } catch (err) {
      console.error('Fetch error:', err);
      showToast({ title: 'Failed to load products', variant: 'error' });
    } finally {
      setIsHydrating(false);
    }
  }, [vendorId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Build backend-compatible payload 
  function buildPayload(values) {
    return {
      vendorId,
      name: values.name,
      description: values.description ?? '',
      price: Number(values.price),
      stock: Number(values.stock ?? 0),
      category: values.category ?? '',
      status: (values.status ?? 'active').toUpperCase(),
      imageUrl: values.image ?? null,
    };
  }

  // Save: create or update 
  const handleSubmit = async (values) => {
    try {
      const payload = buildPayload(values);
      if (values.id) {
        await apiClient.put(`/products/${values.id}`, payload);
      } else {
        await apiClient.post('/products', payload);
      }
      await fetchProducts();
      showToast({
        title: values.id ? 'Product updated' : 'Product added',
        variant: 'success',
      });
      setEditorOpen(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error('Save error:', err?.response?.data ?? err.message);
      showToast({
        title: 'Failed to save product',
        description: err?.response?.data?.message ?? err.message,
        variant: 'error',
      });
    }
  };

  // Delete 
  const handleDelete = async (productId) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await apiClient.delete(`/products/${productId}`);
      await fetchProducts();
      showToast({ title: 'Product deleted', variant: 'success' });
    } catch (err) {
      showToast({ title: 'Delete failed', variant: 'error' });
    }
  };

  return (
    <div className="space-y-8 vendor-products-fade-in">
      <DashboardTopbar
        subtitle="Manage your real backend-powered catalog"
        title="Vendor product center"
      />

      {/* HEADER */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-2">
            Catalog
          </p>
          <h1 className="font-display text-4xl font-bold text-white tracking-tight">
            {user.storeName ?? user.name}{' '}
            <span className="text-white/30 text-2xl">inventory</span>
          </h1>
        </div>

        <Button
          onClick={() => {
            setSelectedProduct(null);
            setEditorOpen(true);
          }}
          className="bg-gradient-to-r from-orange-500 to-pink-600"
        >
          <PackagePlus className="h-5 w-5" />
          Add product
        </Button>
      </div>

      {/* TABLE / LOADING */}
      {isHydrating ? (
        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-[32px]" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <table className="w-full text-white border border-white/10">
          <thead>
            <tr className="bg-white/5">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-t border-white/10 hover:bg-white/5 transition-colors"
              >
                <td className="p-3 font-medium">{product.name}</td>
                <td className="p-3 text-white/60">{product.category || '—'}</td>
                <td className="p-3">{formatCurrency(product.price || 0)}</td>
                <td className="p-3">{product.stock ?? 0}</td>
                <td className="p-3">
                  <span
                    className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${product.status === 'ACTIVE' || product.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-white/10 text-white/40'
                      }`}
                  >
                    {product.status?.toLowerCase() ?? 'active'}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedProduct({
                          id: product.id,
                          name: product.name,
                          description: product.description ?? '',
                          category: product.category ?? '',
                          price: product.price,
                          stock: product.stock ?? 0,
                          status: product.status?.toLowerCase() ?? 'active',
                          image: product.imageUrl ?? product.image ?? '',
                          locationTag: '',
                          isFastDelivery: false,
                        });
                        setEditorOpen(true);
                      }}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <EmptyState
          title="No products yet"
          description="Start by adding your first product"
          actionLabel="Add Product"
          onAction={() => setEditorOpen(true)}
        />
      )}

      {/* MODAL */}
      <ProductEditorModal
        open={editorOpen}
        product={selectedProduct}
        onClose={() => {
          setEditorOpen(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}