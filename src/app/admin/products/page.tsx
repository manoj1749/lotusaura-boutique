"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, Plus, Upload, X } from "lucide-react";

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
  // New fields
  dispatchTime: string | null;
  material: string | null;
  washCare: string | null;
  pattern: string | null;
  // TODO: Fetch additional images if needed, but for list view main image is enough
};

import { PaginationControl } from "@/components/ui/PaginationControl";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

async function fetchProducts(page: number, search?: string): Promise<{ products: Product[], totalPages: number }> {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  if (search) params.append("search", search);
  
  const res = await fetch(`/api/admin/products?${params.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export default function AdminProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentPage = Number(searchParams.get("page") ?? "1");

  const [items, setItems] = React.useState<Product[]>([]);
  const [totalPages, setTotalPages] = React.useState(1);
  const [loading, setLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false); // Sheet open state
  const [search, setSearch] = React.useState("");

  // Edit State
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [deleteId, setDeleteId] = React.useState<number | null>(null); // For delete dialog

  // ... (rest of state items are same)

  // Form State
  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [price, setPrice] = React.useState<number>(999);
  const [stock, setStock] = React.useState<number>(0);
  const [tags, setTags] = React.useState("");
  const [published, setPublished] = React.useState(true);
  const [isCustomCategory, setIsCustomCategory] = React.useState(false);
  const [description, setDescription] = React.useState("");
  
  // New Fields State
  const [dispatchTime, setDispatchTime] = React.useState("3-4 working days");
  const [material, setMaterial] = React.useState("");
  const [washCare, setWashCare] = React.useState("Dry clean only");
  const [pattern, setPattern] = React.useState("");

  // Image State
  const [mainFile, setMainFile] = React.useState<File | null>(null);
  const [mainPreview, setMainPreview] = React.useState<string | null>(null);
  
  // Additional Images State
  type ImageItem = { 
    id: string; // temp id
    file?: File; 
    url: string; 
    path?: string; // if existing
    isNew: boolean;
  };
  const [additionalImages, setAdditionalImages] = React.useState<ImageItem[]>([]);

  const [submitting, setSubmitting] = React.useState(false);

  // Derived unique categories
  const categories = React.useMemo(() => {
    // Note: With pagination, this only shows categories FROM THE CURRENT PAGE if we rely on `items`.
    // Ideally we should fetch all categories separately or accept that it only shows active ones.
    // For now let's keep it as is, or remove it and just text input if list is incomplete.
    // Better UX: Text Input with suggestions, or just fetch categories API if exists.
    // We will stick to current behavior but know its limitation.
    const list = Array.from(new Set(items.map((i) => i.category).filter(Boolean)));
    return list.sort();
  }, [items]);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchProducts(currentPage, search);
      setItems(data.products);
      setTotalPages(data.totalPages);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [search, currentPage]);

  React.useEffect(() => {
    load();
  }, [load]);

  async function fetchProductDetails(id: number) {
    const res = await fetch(`/api/admin/products/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load details");
    const data = await res.json();
    return data.product;
  }

  function resetForm() {
    setEditingId(null);
    setName("");
    setCategory("");
    setIsCustomCategory(false);
    setPrice(999);
    setStock(0);
    setTags("");
    setPublished(true);
    setDescription("");
    setDispatchTime("3-4 working days");
    setMaterial("");
    setWashCare("Dry clean only");
    setPattern("");
    setMainFile(null);
    setMainPreview(null);
    setAdditionalImages([]);
  }

  function openCreate() {
    resetForm();
    setOpen(true);
  }

  async function openEdit(currentProductList: Product) {
    // We already have some data in the list item, but we need full details (DESCRIPTION, images, etc. might be incomplete in list view if we optimize later)
    // Actually, `items` currently has all fields except `images` (as per my TODO comment in type definition).
    // So let's fetch the full details including images.
    
    try {
        const p = await fetchProductDetails(currentProductList.id);
        
        setEditingId(p.id);
        setName(p.name);
        setCategory(p.category ?? "");
        setIsCustomCategory(false);
        setPrice(p.price);
        setStock(p.stock);
        setTags(p.tags ?? "");
        setPublished(p.published !== false);
        setDescription(p.description ?? "");
        
        setDispatchTime(p.dispatchTime ?? "3-4 working days");
        setMaterial(p.material ?? "");
        setWashCare(p.washCare ?? "Dry clean only");
        setPattern(p.pattern ?? "");

        setMainFile(null);
        setMainPreview(p.imageUrl);
        
        // Populate additional images
        if (p.images && Array.isArray(p.images)) {
             setAdditionalImages(p.images.map((img: any) => ({
                 id: String(img.id),
                 url: img.imageUrl,
                 path: img.imagePath,
                 isNew: false
             })));
        } else {
            setAdditionalImages([]); 
        }
        
        setOpen(true);
    } catch (e) {
        toast.error("Failed to load product details");
    }
  }

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setMainFile(f);
      setMainPreview(URL.createObjectURL(f));
    }
  };

  const handleAddAdditionalImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages: ImageItem[] = Array.from(e.target.files).map(f => ({
        id: Math.random().toString(36),
        file: f,
        url: URL.createObjectURL(f),
        isNew: true
      }));
      setAdditionalImages(prev => [...prev, ...newImages]);
    }
  };

  const removeAdditionalImage = (id: string) => {
    setAdditionalImages(prev => prev.filter(img => img.id !== id));
  };

  async function handleSave() {
    if (!name.trim()) return toast.error("Name is required");
    if (!editingId && !mainFile) return toast.error("Main image is required");
    if (!Number.isFinite(price) || price < 0) return toast.error("Price is invalid");

    setSubmitting(true);
    try {
      let mainUrl = mainPreview;
      let mainPath = editingId ? items.find(i => i.id === editingId)?.imagePath : "";

      // 1) Upload main image if changed
      if (mainFile) {
        const formData = new FormData();
        formData.append("file", mainFile);
        const up = await fetch("/api/admin/upload", { method: "POST", body: formData });
        if (!up.ok) throw new Error("Main image upload failed");
        const data = await up.json();
        mainUrl = data.url;
        mainPath = data.pathname;
      }

      // 2) Upload additional images
      const processedAdditionalImages = [];
      for (const img of additionalImages) {
        if (img.isNew && img.file) {
          const formData = new FormData();
          formData.append("file", img.file);
          const up = await fetch("/api/admin/upload", { method: "POST", body: formData });
          if (up.ok) {
            const data = await up.json();
            processedAdditionalImages.push({ url: data.url, path: data.pathname });
          }
        } else {
          // Existing image (if we had fetched them)
          processedAdditionalImages.push({ url: img.url, path: img.path });
        }
      }

      // 3) Submit data
      const payload: any = {
        name: name.trim(),
        category: category.trim() || null,
        price,
        description: description.trim() || null,
        stock,
        tags: tags || null,
        published,
        dispatchTime: dispatchTime || null,
        material: material || null,
        washCare: washCare || null,
        pattern: pattern || null,
        additionalImages: processedAdditionalImages
      };

      if (mainFile) {
        payload.imageUrl = mainUrl;
        payload.imagePath = mainPath;
      } else if (editingId) {
         // Keep existing main image
         // handled by backend if we don't send it? 
         // Our backend logic: if imageUrl string provided, it updates.
         // If we don't provide mainFile, we might not want to send imageUrl unless checking strictly.
         // Let's rely on backend check: if no imageUrl in payload, it doesn't update.
         // OR we send the existing one.
         payload.imageUrl = mainPreview;
         payload.imagePath = mainPath;
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
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Deleted");
      setDeleteId(null);
      setEditingId(null);
      setOpen(false); // Close sheet if open
      await load();
    } catch (e: any) {
      toast.error(e?.message ?? "Delete failed");
    }
  }

  async function toggleStatus(p: Product, currentStatus: boolean) {
    try {
      const res = await fetch(`/api/admin/products/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...p, published: !currentStatus }),
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success(currentStatus ? "Unpublished" : "Published");
      await load();
    } catch (error) {
       toast.error("Failed to update status");
    }
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-medium text-foreground">Products Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your catalog, inventory, and details.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
           <Input 
             placeholder="Search products..." 
             value={search} 
             onChange={(e) => setSearch(e.target.value)} 
             className="w-full sm:w-[240px] bg-background"
           />
           <Button onClick={openCreate} className="gap-2 w-full sm:w-auto">
             <Plus className="h-4 w-4" /> Add Product
           </Button>
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-center hidden md:table-cell">Stock</TableHead>
                <TableHead className="text-center hidden sm:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">Loading...</TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">No products found.</TableCell>
                </TableRow>
              ) : (
                items.map((p) => (
                  <TableRow key={p.id} className="hover:bg-muted/10 transition-colors">
                    <TableCell>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.imageUrl} alt={p.name} className="h-12 w-10.5 rounded-md object-cover border border-border" />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="line-clamp-2">{p.name}</div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                        {p.category ?? "Uncategorized"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium">₹{p.price.toLocaleString()}</TableCell>
                    <TableCell className="text-center hidden md:table-cell">
                      <span className={p.stock > 0 ? "text-green-600" : "text-red-600"}>{p.stock}</span>
                    </TableCell>
                    <TableCell className="text-center hidden sm:table-cell">
                      <Switch 
                        checked={p.published !== false}
                        onCheckedChange={() => toggleStatus(p, p.published !== false)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                       <div className="flex justify-end gap-2">
                         <Button variant="ghost" size="sm" onClick={() => openEdit(p)}>Edit</Button>
                         <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setDeleteId(p.id)}>
                           <Trash2 className="h-4 w-4" />
                         </Button>
                       </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <PaginationControl 
        totalPages={totalPages} 
        hasNextPage={currentPage < totalPages} 
        hasPrevPage={currentPage > 1}
        totalSize={0}
      />

      {/* Edit/Create Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="sm:max-w-2xl w-full p-0 flex flex-col gap-0 border-l shadow-2xl">
          <SheetHeader className="px-6 py-5 border-b sticky top-0 bg-background z-10">
            <SheetTitle className="text-xl font-display">
              {editingId ? "Edit Product" : "Create New Product"}
            </SheetTitle>
          </SheetHeader>
          
          <ScrollArea className="flex-1 px-6 py-6">
            <div className="grid gap-8 pb-10">
              
              {/* Main Info Section */}
              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Basic Information</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Katan Silk Saree" />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                       <Label>Category</Label>
                        {isCustomCategory ? (
                          <div className="flex gap-2">
                              <Input 
                                value={category} 
                                onChange={(e) => setCategory(e.target.value)} 
                                placeholder="New Category"
                                autoFocus
                              />
                              <Button size="icon" variant="ghost" onClick={() => setIsCustomCategory(false)}>
                                <X className="h-4 w-4" />
                              </Button>
                          </div>
                        ) : (
                          <Select 
                            value={categories.includes(category as any) ? category : (category ? "new" : "")} 
                            onValueChange={(val) => {
                              if(val === "new") {
                                setIsCustomCategory(true);
                                setCategory("");
                              } else {
                                setCategory(val);
                                setIsCustomCategory(false);
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map(c => <SelectItem key={c as string} value={c as string}>{c}</SelectItem>)}
                              <SelectItem value="new" className="text-primary font-medium">+ Add New</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="price">Price (₹) *</Label>
                      <Input id="price" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea 
                      id="description" 
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Product details..."
                    />
                  </div>
                </div>
              </section>

              {/* Media Section */}
              <section className="space-y-4 border-t pt-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Media</h3>
                
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>Main Image *</Label>
                    <div className="flex items-start gap-4">
                      <div className="relative aspect-[3/4] w-24 bg-muted rounded-md overflow-hidden border">
                        {mainPreview ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={mainPreview} alt="Main" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                            <Upload className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <Input type="file" accept="image/*" onChange={handleMainImageChange} />
                        <p className="text-xs text-muted-foreground mt-2">Recommended aspect ratio 3:4. This will be the primary card image.</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Gallery Images</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {additionalImages.map((img) => (
                         <div key={img.id} className="relative aspect-[3/4] bg-muted rounded-md overflow-hidden border group">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img.url} alt="Gallery" className="w-full h-full object-cover" />
                            <button 
                              onClick={() => removeAdditionalImage(img.id)}
                              className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                         </div>
                      ))}
                      <label className="aspect-[3/4] border border-dashed border-muted-foreground/30 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-muted/30 transition-colors">
                        <Plus className="h-6 w-6 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground mt-1">Add</span>
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleAddAdditionalImage} />
                      </label>
                    </div>
                  </div>
                </div>
              </section>

              {/* Inventory & Status */}
              <section className="space-y-4 border-t pt-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Inventory & Status</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input id="stock" type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Visibility</Label>
                    <div className="flex items-center justify-between border rounded-md p-3">
                      <span className="text-sm">Published</span>
                      <Switch checked={published} onCheckedChange={setPublished} />
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                   <Label htmlFor="tags">Tags</Label>
                   <Input id="tags" value={tags} onChange={e => setTags(e.target.value)} placeholder="Comma separated (e.g. New, Bestseller)" />
                </div>
              </section>

              {/* Specifications */}
              <section className="space-y-4 border-t pt-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="material">Material</Label>
                    <Input id="material" value={material} onChange={e => setMaterial(e.target.value)} placeholder="e.g. Pure Silk" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="pattern">Pattern/Weave</Label>
                    <Input id="pattern" value={pattern} onChange={e => setPattern(e.target.value)} placeholder="e.g. Handloom" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="washCare">Wash Care</Label>
                    <Input id="washCare" value={washCare} onChange={e => setWashCare(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dispatch">Dispatch Time</Label>
                    <Input id="dispatch" value={dispatchTime} onChange={e => setDispatchTime(e.target.value)} />
                  </div>
                </div>
              </section>



            </div>
          </ScrollArea>
          
          <SheetFooter className="p-6 border-t bg-background mt-auto sticky bottom-0 z-10">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={submitting}>
              {submitting ? "Saving..." : "Save Product"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <DialogContent>
           <DialogHeader>
             <DialogTitle>Delete Product?</DialogTitle>
           </DialogHeader>
           <p className="text-sm text-muted-foreground">
             Are you sure you want to permanently delete this product? This action cannot be undone.
           </p>
           <div className="flex justify-end gap-2 mt-4">
             <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
             <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
           </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
