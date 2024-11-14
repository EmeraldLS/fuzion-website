import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, AlertCircle } from "lucide-react";
import { categories } from "@/utils/mockData";
import { Label } from "./ui/label";

interface ProductFormData {
  name: string;
  price: number;
  discount_percent: number;
  description: string;
  category: string;
  specifications: {
    size: string;
    motor: string;
    blade: string;
    pump: string;
    coating: string;
  };
}

interface ProductUpdateFormProps {
  productId: string;
}

export default function ProductUpdateForm({
  productId,
}: ProductUpdateFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: 0,
    discount_percent: 0,
    description: "",
    category: "",
    specifications: {
      size: "",
      motor: "",
      blade: "",
      pump: "",
      coating: "",
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/private/single/${productId}`);
      if (!response.ok) {
        throw new Error("Failed to load product details");
      }
      const product = await response.json();
      const newProduct = {
        ...product,
        specifications: {
          size: product.size,
          motor: product.motor,
          blade: product.blade,
          pump: product.pump,
          coating: product.coating,
        },
      };
      setFormData(newProduct);
    } catch (error) {
      setError("An error occurred while loading the product details");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "discount_percent"
          ? parseFloat(value)
          : value,
    }));
  };
  const handleSpecificationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      specifications: { ...prev.specifications, [name]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUpdateMessage(null);

    try {
      const response = await fetch(`/api/private/single/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      setUpdateMessage("Product updated successfully!");
    } catch (error) {
      setError("An error occurred while updating the product");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {updateMessage && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{updateMessage}</span>
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Product Name
        </label>
        <Input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700"
        >
          Price
        </label>
        <Input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label
          htmlFor="discount_percent"
          className="block text-sm font-medium text-gray-700"
        >
          Discount Percent
        </label>
        <Input
          type="number"
          id="discount_percent"
          name="discount_percent"
          value={formData.discount_percent}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Category
        </label>
        <Select
          value={formData.category}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, category: value }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Categories</SelectLabel>
              {categories.map((cat, i) => (
                <SelectItem value={cat.id} key={i}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* <fieldset>
        <legend className="text-lg font-medium text-gray-700">
          Specifications
        </legend>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(formData.specifications).map(([key, value]) => (
            <div key={key}>
              <label
                htmlFor={key}
                className="block text-sm font-medium text-gray-700 capitalize"
              >
                {key}
              </label>
              <Input
                type="text"
                id={key}
                name={key}
                value={value}
                onChange={handleSpecificationChange}
              />
            </div>
          ))}
        </div>
      </fieldset> */}
      <div className="space-y-2">
        <Label>Specifications</Label>
        <Input
          name="size"
          placeholder="Size"
          value={formData.specifications.size}
          onChange={handleSpecificationChange}
        />
        <Input
          name="motor"
          placeholder="Motor"
          value={formData.specifications.motor}
          onChange={handleSpecificationChange}
        />
        <Input
          name="blade"
          placeholder="Blade"
          value={formData.specifications.blade}
          onChange={handleSpecificationChange}
        />
        <Input
          name="pump"
          placeholder="Pump"
          value={formData.specifications.pump}
          onChange={handleSpecificationChange}
        />
        <Input
          name="coating"
          placeholder="Coating"
          value={formData.specifications.coating}
          onChange={handleSpecificationChange}
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-primary text-white bg-main"
        disabled={loading}
      >
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Update Product
      </Button>
    </form>
  );
}
