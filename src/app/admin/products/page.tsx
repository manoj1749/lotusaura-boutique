"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string;
  imagePath: string;
  category: string | null;
  stock: number;
  tags: string | null;
  published: boolean | null;
  createdAt: string | null;
};

async function fetchProducts(search?: string): Promise<Product[]> {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  const res = await fetch(`/api/admin/products?${params.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  return data.products ?? [];
}

export default function AdminProductsPage() {
  const [items, setItems] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  // Edit State
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);

  // form state
  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [price, setPrice] = React.useState<number>(999);
  const [stock, setStock] = React.useState<number>(0);
  const [tags, setTags] = React.useState("");
  const [published, setPublished] = React.useState(true);
  const [isCustomCategory, setIsCustomCategory] = React.useState(false);
  const [description, setDescription] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  // Derived unique categories
  const categories = React.useMemo(() => {
    const list = Array.from(new Set(items.map((i) => i.category).filter(Boolean)));
    return list.sort();
  }, [items]);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const p = await fetchProducts(search);
      setItems(p);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load, search]); // reload when search changes

  function openEdit(p: Product) {
    setEditingId(p.id);
    setName(p.name);
    setCategory(p.category ?? "");
    setIsCustomCategory(false); // Reset first
    
    // Check if category exists in list or if it's new
    // Actually we can't check 'categories' array here because it depends on 'items' state
    // but openEdit is called after load.
    // We'll let the Select handle it: if value matches, good.
    // But if p.category is NOT in the list? We should probably treat it as custom or add to list?
    // For simplicity: If category is truthy, we set it. 
    // If we want to show it in Select, it must be in list.
    // If it's a legacy category not in standard list, should we show Custom?
    // Let's rely on standard text match.
    
    setPrice(p.price);
    setStock(p.stock);
    setTags(p.tags ?? "");
    setPublished(p.published !== false); // default to true if null
    setDescription(p.description ?? "");
    setFile(null); // Keep null to signify "no change" unless user picks one
    setOpen(true);
  }

  function openCreate() {
    setEditingId(null);
    setName("");
    setCategory("");
    setIsCustomCategory(false);
    setPrice(999);
    setStock(0);
    setTags("");
    setPublished(true);
    setDescription("");
    setFile(null);
    setOpen(true);
  }

  async function handleSave() {
    if (!name.trim()) return toast.error("Name is required");
    // If creating, file is required. If editing, file is optional.
    if (!editingId && !file) return toast.error("Image is required");
    if (!Number.isFinite(price) || price < 0) return toast.error("Price is invalid");

    setSubmitting(true);
    try {
      let url = "";
      let pathname = "";

      // 1) upload to blob if file exists
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const up = await fetch("/api/admin/upload", { method: "POST", body: formData });
        if (!up.ok) {
          const err = await up.json().catch(() => ({}));
          throw new Error(err.error ?? "Upload failed");
        }
        const data = await up.json();
        url = data.url;
        pathname = data.pathname;
      }

      // 2) insert or update
      const payload: any = {
        name: name.trim(),
        category: category.trim() || null,
        price,
        description: description.trim() || null,
        stock,
        tags: tags || null,
        published,
      };

      if (url) {
        payload.imageUrl = url;
        payload.imagePath = pathname;
      }

      const method = editingId ? "PUT" : "POST";
      const apiPath = editingId ? `/api/admin/products/${editingId}` : "/api/admin/products";

      const req = await fetch(apiPath, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!req.ok) {
        const err = await req.json().catch(() => ({}));
        throw new Error(err.error ?? "Save failed");
      }

      toast.success(editingId ? "Product updated" : "Product added");
      setOpen(false);
      openCreate(); // reset
      await load();
    } catch (e: any) {
      toast.error(e?.message ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/products/${deleteId}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Delete failed");
      }
      toast.success("Deleted");
      setDeleteId(null);
      await load();
    } catch (e: any) {
      toast.error(e?.message ?? "Delete failed");
    }
  }

  async function toggleStatus(p: Product, currentStatus: boolean) {
    // Optimistic update (optional, but let's just wait for load)
    try {
      const res = await fetch(`/api/admin/products/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...p, // send all data to be safe, or API should handle partials
          // actually API expects full payload currently in my implementation?
          // Let's check PUT implementation. It extracts specific fields.
          // It requires name, price etc validation?
          // Lines 36-40 of route.ts checks: name string, price number.
          // So we must send full payload.
          name: p.name,
          category: p.category,
          price: p.price,
          description: p.description,
          stock: p.stock,
          tags: p.tags,
          imageUrl: p.imageUrl,
          imagePath: p.imagePath,
          published: !currentStatus 
        }),
      });

      if (!res.ok) throw new Error("Update failed");
      toast.success(currentStatus ? "Unpublished" : "Published");
      await load();
    } catch (error) {
       toast.error("Failed to update status");
    }
  }



  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Admin · Products</h1>
          <p className="text-sm text-muted-foreground">Upload and manage the catalog.</p>
        </div>

        <div className="flex gap-2">
           <Input 
             placeholder="Search products..." 
             value={search} 
             onChange={(e) => setSearch(e.target.value)} 
             className="w-[200px]"
           />
           <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>Add product</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <div className="flex items-center justify-between pr-8">
                <DialogTitle>{editingId ? "Edit Product" : "Add a product"}</DialogTitle>
                <div className="flex items-center gap-2">
                  <Label htmlFor="pub-top" className="text-sm text-muted-foreground">Published</Label>
                  <Switch 
                    id="pub-top" 
                    checked={published} 
                    onCheckedChange={setPublished} 
                  />
                </div>
              </div>
            </DialogHeader>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Linen Kurti" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                {isCustomCategory ? (
                   <div className="flex gap-2">
                      <Input 
                        id="category" 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)} 
                        placeholder="Type new category..." 
                        autoFocus
                      />
                       <Button variant="ghost" onClick={() => setIsCustomCategory(false)}>
                         Cancel
                       </Button>
                   </div>
                ) : (
                  <Select 
                    value={categories.includes(category as any) ? category : (category ? "custom" : "")} 
                    onValueChange={(val) => {
                      if (val === "new") {
                        setIsCustomCategory(true);
                        setCategory("");
                      } else {
                        setCategory(val);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c as string} value={c as string}>
                          {c}
                        </SelectItem>
                      ))}
                      <SelectItem value="new" className="font-semibold text-primary">
                        + Create New Category
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
                {/* Fallback hidden input to ensure category is preserved if it was "custom" logic above matched */}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  min={0}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    min={0}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags (comma sep)</Label>
                  <Input
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="New, Sale, Summer"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short details (fabric, size, etc.)"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="image">{editingId ? "Change Image (Optional)" : "Image"}</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
                {file ? (
                  <div className="relative mt-2 h-20 w-20 overflow-hidden rounded-md border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt="Preview" 
                      className="h-full w-full object-cover" 
                    />
                  </div>
                ) : editingId && items.find(i => i.id === editingId)?.imageUrl ? (
                   <div className="relative mt-2 h-20 w-20 overflow-hidden rounded-md border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={items.find(i => i.id === editingId)?.imageUrl} 
                      alt="Current" 
                      className="h-full w-full object-cover" 
                    />
                  </div>
                ) : null}
              </div>

              <div className="flex justify-between items-center bg-gray-50 -mx-6 -mb-6 px-6 py-4 mt-6">
                 {editingId ? (
                    <Button variant="destructive" type="button" onClick={() => setDeleteId(editingId)}>
                      Delete Product
                    </Button>
                  ) : <div></div>}
                  <Button onClick={handleSave} disabled={submitting}>
                    {submitting ? "Saving..." : (editingId ? "Update Product" : "Add Product")}
                  </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>

      <div className="rounded-xl border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[72px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  No products yet.
                </TableCell>
              </TableRow>
            ) : (
              items.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.category ?? "-"}</TableCell>
                  <TableCell className="text-right">₹{p.price}</TableCell>
                  <TableCell className="text-right">{p.stock}</TableCell>
                   <TableCell className="space-x-4 flex items-center">
                     <Switch 
                        checked={p.published !== false}
                        onCheckedChange={() => toggleStatus(p, p.published !== false)}
                     />
                     <Button variant="outline" size="sm" onClick={() => openEdit(p)}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>


      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product?</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Confirm Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
