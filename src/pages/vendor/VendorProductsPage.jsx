import { useState } from 'react';
import { PackagePlus, PencilLine, Trash2, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/common/Skeleton';
import { DashboardTopbar } from '@/components/navigation/DashboardTopbar';
import { ProductEditorModal } from '@/components/product/ProductEditorModal';
import { useAuth } from '@/hooks/useAuth';
import { useMarketplace } from '@/hooks/useMarketplace';
import { useToast } from '@/hooks/useToast';
import { formatCurrency } from '@/utils/format';
import { getVerificationVariant } from '@/utils/status';
import './VendorProductsPage.css';

export function VendorProductsPage() {
  const { user } = useAuth();
  const { products, isHydrating, saveVendorProduct, removeVendorProduct } = useMarketplace();
  const { showToast } = useToast();
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  if (!user || user.role !== 'vendor') return null;

  const vendorProducts = products
    .filter((product) => product.vendorId === user.id)
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());

  return (
    <div className="space-y-8 vendor-products-fade-in">
      <DashboardTopbar
        subtitle="Keep your catalog clean, manage stock, and prepare for backend-powered operations."
        title="Vendor product center"
      />

      {/* ================= HEADER SECTION ================= */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-2">Catalog</p>
          <h1 className="font-display text-4xl font-bold text-white tracking-tight">
            {user.storeName} <span className="text-white/30 text-2xl font-medium">inventory</span>
          </h1>
        </div>
        <Button
          onClick={() => {
            setSelectedProduct(null);
            setEditorOpen(true);
          }}
          className="bg-gradient-to-r from-orange-500 to-pink-600 border-none shadow-[0_0_20px_rgba(249,115,22,0.3)] py-6 px-8 rounded-2xl font-bold text-white hover:scale-[1.02]"
          type="button"
        >
          <PackagePlus className="h-5 w-5" />
          Add product
        </Button>
      </div>

      {/* ================= STATUS INFO CARD ================= */}
      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#0a0a0e] p-6 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.05),transparent_50%)] pointer-events-none" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
             <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-orange-500">
                <ShieldCheck className="h-6 w-6" />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Verification status</p>
                <div className="mt-1">
                  <Badge variant={getVerificationVariant(user.verificationStatus)}>{user.verificationStatus}</Badge>
                </div>
             </div>
          </div>
          <p className="text-sm font-medium text-white/40 max-w-md md:text-right">
            Only active products appear in the customer storefront. Drafts stay internal to the vendor dashboard.
          </p>
        </div>
      </div>

      {/* ================= CATALOG TABLE ================= */}
      {isHydrating ? (
        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-24 rounded-[32px] bg-white/[0.03]" />
          ))}
        </div>
      ) : vendorProducts.length ? (
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[#0a0a0e] shadow-2xl">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/40">
                <tr>
                  <th className="px-8 py-5">Product Details</th>
                  <th className="px-5 py-5">Category</th>
                  <th className="px-5 py-5">Price</th>
                  <th className="px-5 py-5">Stock</th>
                  <th className="px-5 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {vendorProducts.map((product) => (
                  <tr key={product.id} className="transition-colors hover:bg-white/[0.02] group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <img alt={product.name} className="h-16 w-16 rounded-2xl object-cover border border-white/10" src={product.image} />
                        <div>
                          <p className="font-bold text-white text-base tracking-wide">{product.name}</p>
                          <p className="mt-1 text-xs font-medium text-white/30">{product.locationTag}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-6 font-semibold text-white/60">{product.category}</td>
                    <td className="px-5 py-6 font-display text-lg font-black text-white">{formatCurrency(product.price)}</td>
                    <td className="px-5 py-6">
                       <span className={`text-sm font-bold ${product.stock < 10 ? 'text-orange-500' : 'text-white/60'}`}>
                         {product.stock} pcs
                       </span>
                    </td>
                    <td className="px-5 py-6">
                      <Badge className="px-3 py-1" variant={product.status === 'active' ? 'success' : 'warning'}>{product.status}</Badge>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setEditorOpen(true);
                          }}
                          className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white transition-all"
                        >
                          <PencilLine className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            void removeVendorProduct(user.id, product.id)
                              .then(() => showToast({ title: 'Product deleted', variant: 'success' }))
                              .catch((error) => showToast({ title: 'Delete failed', description: error.message, variant: 'error' }));
                          }}
                          className="h-10 w-10 flex items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          actionLabel="Create first product"
          description="Use the modal editor to add your first listing, set delivery ETA, and control active versus draft status."
          icon={PackagePlus}
          onAction={() => {
            setSelectedProduct(null);
            setEditorOpen(true);
          }}
          title="Your catalog is empty"
        />
      )}

      <ProductEditorModal
        onClose={() => setEditorOpen(false)}
        onSubmit={async (values) => {
          await saveVendorProduct(user.id, values);
          showToast({ title: selectedProduct ? 'Product updated' : 'Product created', variant: 'success' });
        }}
        open={editorOpen}
        product={selectedProduct}
      />
    </div>
  );
}