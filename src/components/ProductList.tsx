import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  price: number;
  isNew: boolean;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const mockProducts: Product[] = [
        { id: "1", name: "Product 1", price: 99.99, isNew: true },
        { id: "2", name: "Product 2", price: 149.99, isNew: false },
        { id: "3", name: "Product 3", price: 199.99, isNew: true },
      ];
      setProducts(mockProducts);
    };

    fetchProducts();
  }, []);

  const handleEdit = (id: string) => {
    window.location.href = `/admin/edit/${id}`;
    console.log("Edit product", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete product", id);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>New</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>{product.name}</TableCell>
            <TableCell>${product.price.toFixed(2)}</TableCell>
            <TableCell>{product.isNew ? "Yes" : "No"}</TableCell>
            <TableCell>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(product.id)}
                className="mr-2"
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(product.id)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProductList;
