import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

interface ProductFormData {
  name: string;
  price: number;
  isNew: boolean;
  description: string;
  image: File | null;
  rating: number;
  discountPercent: number;
  specifications: {
    size: string;
    motor: string;
    blade: string;
    pump: string;
    coating: string;
  };
}

const ProductUploadForm: React.FC = () => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: 0,
    isNew: false,
    description: "",
    image: null,
    rating: 0,
    discountPercent: 0,
    specifications: {
      size: "",
      motor: "",
      blade: "",
      pump: "",
      coating: "",
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isNew: checked }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting product data:", formData);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Product Uploaded",
      description: "Your product has been successfully added to the catalog.",
    });

    setFormData({
      name: "",
      price: 0,
      isNew: false,
      description: "",
      image: null,
      rating: 0,
      discountPercent: 0,
      specifications: {
        size: "",
        motor: "",
        blade: "",
        pump: "",
        coating: "",
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="isNew"
          checked={formData.isNew}
          onCheckedChange={handleSwitchChange}
        />
        <Label htmlFor="isNew">New Product</Label>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="image">Product Image</Label>
        <Input
          id="image"
          name="image"
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          required
        />
      </div>
      <div>
        <Label htmlFor="rating">Rating</Label>
        <Input
          id="rating"
          name="rating"
          type="number"
          min="0"
          max="5"
          step="0.1"
          value={formData.rating}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="discountPercent">Discount Percentage</Label>
        <Input
          id="discountPercent"
          name="discountPercent"
          type="number"
          min="0"
          max="100"
          value={formData.discountPercent}
          onChange={handleInputChange}
          required
        />
      </div>
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
      <Button type="submit">Upload Product</Button>
    </form>
  );
};

export default ProductUploadForm;
