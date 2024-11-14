"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { ImageUploadResponse } from "@/model/model";
import { v4 as uuidv4 } from "uuid";
import { categories } from "@/utils/mockData";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface ProductFormData {
  name: string;
  price: number;
  isNew: boolean;
  description: string;
  image: File | null;
  rating: number;
  discountPercent: number;
  category: string;
  specifications: {
    size: string;
    motor: string;
    blade: string;
    pump: string;
    coating: string;
  };
}

export default function ProductUploadForm() {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: 0,
    isNew: false,
    description: "",
    image: null,
    rating: 0,
    discountPercent: 0,
    category: "",
    specifications: {
      size: "",
      motor: "",
      blade: "",
      pump: "",
      coating: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );

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

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/private/image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = (await response.json()) as ImageUploadResponse;

      console.log(data);

      return data.filePath;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      let imageUrl = "";
      if (formData.image) {
        imageUrl = await uploadImage(formData.image);
      }

      const productData = {
        id: uuidv4(),
        price: formData.price,
        isNew: formData.isNew,
        name: formData.name,
        imageUrl,
        rating: formData.rating,
        discountPercent: formData.discountPercent,
        description: formData.description,
        category: formData.category,
        specifications: formData.specifications,
      };

      console.log(productData);

      const response = await fetch("/api/private/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error("Failed to upload product");
      }

      setMessage("Your product has been successfully added to the catalog.");
      setMessageType("success");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      window.dispatchEvent(new Event("productUploaded"));

      setFormData({
        name: "",
        price: 0,
        isNew: false,
        description: "",
        image: null,
        rating: 0,
        discountPercent: 0,
        category: "",
        specifications: {
          size: "",
          motor: "",
          blade: "",
          pump: "",
          coating: "",
        },
      });
    } catch (error) {
      console.error("Error uploading product:", error);
      setMessage("Failed to upload product. Please try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {message && (
        <div
          className={`p-4 rounded-lg ${
            messageType === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </motion.div>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleInputChange}
          required
        />
      </motion.div>

      <Select
        onValueChange={(v) => setFormData({ ...formData, category: v })}
        required
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

      <motion.div
        className="flex items-center space-x-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Switch
          id="isNew"
          checked={formData.isNew}
          onCheckedChange={handleSwitchChange}
        />
        <Label htmlFor="isNew">New Product</Label>
      </motion.div>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
      </motion.div>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Label htmlFor="image">Product Image</Label>
        <Input
          id="image"
          name="image"
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          required
        />
      </motion.div>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
      </motion.div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
      </motion.div>
      <motion.div
        className="space-y-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
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
      </motion.div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Upload Product"
          )}
        </Button>
      </motion.div>
    </motion.form>
  );
}
