"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RotateCcw } from "lucide-react";

interface ProductFiltersProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (category: string, checked: boolean) => void;
  // Price range implementation can be added later as it's more complex UI
  onClearFilters: () => void;
  showHeader?: boolean;
}

export function ProductFilters({
  categories,
  selectedCategories,
  onCategoryChange,
  onClearFilters,
  showHeader = true
}: ProductFiltersProps) {
  return (
    <div className="space-y-6">
      {showHeader && (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Filters</h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
            onClick={onClearFilters}
          >
            <RotateCcw className="mr-1 h-3 w-3" />
            Reset
          </Button>
        </div>
        <Separator />
      </div>
      )}

      <div>
        <h4 className="font-medium mb-3">Categories</h4>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => 
                  onCategoryChange(category, checked as boolean)
                }
              />
              <Label
                htmlFor={`category-${category}`}
                className="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {category}
              </Label>
            </div>
          ))}
          <div className="pt-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={onClearFilters}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
