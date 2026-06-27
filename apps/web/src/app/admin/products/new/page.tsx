import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/products" className="p-2 text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-sm text-gray-500 mt-1">Create a new rice variety for your store.</p>
        </div>
      </div>

      <ProductForm />
    </div>
  );
}
