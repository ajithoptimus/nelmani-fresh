"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { productsApi, adminApi } from "@/lib/api";
import { PhotoIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function ProductForm({ initialData = null }: { initialData?: any }) {
  const router = useRouter();
  const isEditing = !!initialData;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    short_description: initialData?.short_description || "",
    description: initialData?.description || "",
    heritage_story: initialData?.heritage_story || "",
    health_benefits: initialData?.health_benefits || "",
    cooking_instructions: initialData?.cooking_instructions || "",
    is_featured: initialData?.is_featured || false,
    is_active: initialData?.is_active ?? true,
    sort_order: initialData?.sort_order || 0,
  });

  const [variants, setVariants] = useState<any[]>(
    initialData?.variants?.length
      ? initialData.variants
      : [{ size_kg: 1, sku: "", price: 0, stock_quantity: 0 }]
  );

  const [images, setImages] = useState<any[]>(initialData?.images || []);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([...variants, { size_kg: 0, sku: "", price: 0, stock_quantity: 0 }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    setUploadingImage(true);
    try {
      const file = e.target.files[0];
      const { data } = await adminApi.uploadImage(file);
      setImages([
        ...images,
        {
          cloudinary_public_id: data.public_id,
          url: data.url,
          is_primary: images.length === 0,
        },
      ]);
    } catch (err) {
      console.error("Image upload failed", err);
      alert("Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload = {
      ...formData,
      variants,
      images,
    };

    try {
      if (isEditing) {
        await productsApi.update(initialData.id, payload);
      } else {
        await productsApi.create(payload);
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      console.error("Save failed", err);
      setError(err.response?.data?.detail || "Failed to save product.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        <h2 className="text-lg font-bold text-gray-900 border-b pb-4">Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
            <input
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug *</label>
            <input
              required
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="e.g. rakthashali-rice"
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
          <textarea
            required
            name="short_description"
            value={formData.short_description}
            onChange={handleChange}
            rows={2}
            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>
      </div>

      {/* Premium Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        <h2 className="text-lg font-bold text-gray-900 border-b pb-4">Premium Details</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Heritage Story</label>
          <textarea
            name="heritage_story"
            value={formData.heritage_story}
            onChange={handleChange}
            rows={3}
            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Health Benefits</label>
          <textarea
            name="health_benefits"
            value={formData.health_benefits}
            onChange={handleChange}
            rows={3}
            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cooking Instructions</label>
          <textarea
            name="cooking_instructions"
            value={formData.cooking_instructions}
            onChange={handleChange}
            rows={3}
            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>
      </div>

      {/* Variants (Pricing & Stock) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-lg font-bold text-gray-900">Variants (Size, Price, Stock)</h2>
          <button
            type="button"
            onClick={addVariant}
            className="text-primary hover:text-primary-dark font-medium flex items-center text-sm"
          >
            <PlusIcon className="w-4 h-4 mr-1" /> Add Variant
          </button>
        </div>
        
        <div className="space-y-4">
          {variants.map((variant, index) => (
            <div key={index} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">Size (KG)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={variant.size_kg}
                  onChange={(e) => handleVariantChange(index, "size_kg", parseFloat(e.target.value))}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">SKU</label>
                <input
                  required
                  value={variant.sku}
                  onChange={(e) => handleVariantChange(index, "sku", e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">Price (₹)</label>
                <input
                  type="number"
                  required
                  value={variant.price}
                  onChange={(e) => handleVariantChange(index, "price", parseFloat(e.target.value))}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">Stock</label>
                <input
                  type="number"
                  required
                  value={variant.stock_quantity}
                  onChange={(e) => handleVariantChange(index, "stock_quantity", parseInt(e.target.value))}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
              {variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="mt-5 text-red-500 hover:text-red-700 p-2"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        <h2 className="text-lg font-bold text-gray-900 border-b pb-4">Product Images</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img, index) => (
            <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group">
              <img src={img.url} alt="Product" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1.5 bg-white text-red-600 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
              {img.is_primary && (
                <div className="absolute bottom-0 left-0 right-0 bg-primary/90 text-white text-xs text-center py-1">
                  Primary
                </div>
              )}
            </div>
          ))}
          
          <label className="aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
            {uploadingImage ? (
              <span className="text-sm text-gray-500">Uploading...</span>
            ) : (
              <>
                <PhotoIcon className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-600">Add Image</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
              </>
            )}
          </label>
        </div>
      </div>

      {/* Settings & Submission */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6 flex justify-between items-center">
        <div className="flex space-x-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
              className="rounded text-primary focus:ring-primary border-gray-300"
            />
            <span className="text-sm font-medium text-gray-700">Featured on Homepage</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="rounded text-primary focus:ring-primary border-gray-300"
            />
            <span className="text-sm font-medium text-gray-700">Active (Visible in shop)</span>
          </label>
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary-dark text-white px-8 py-2.5 rounded-lg font-medium shadow-sm transition-colors disabled:opacity-70"
          >
            {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </div>
    </form>
  );
}
