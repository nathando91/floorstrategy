import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Search } from "lucide-react";

interface NFTFiltersProps {
  sortBy: string;
  onSortChange: (value: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  collections: string[];
  selectedCollection: string;
  onCollectionChange: (value: string) => void;
}

export function NFTFilters({
  sortBy,
  onSortChange,
  searchTerm,
  onSearchChange,
  collections,
  selectedCollection,
  onCollectionChange
}: NFTFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-card border rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="search">Tìm kiếm</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Tìm theo tên collection..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="collection">Collection</Label>
        <Select value={selectedCollection} onValueChange={onCollectionChange}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn collection" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả collections</SelectItem>
            {collections.map((collection) => (
              <SelectItem key={collection} value={collection}>
                {collection}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="sort">Sắp xếp theo</Label>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn cách sắp xếp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-asc">Giá: Thấp đến Cao</SelectItem>
            <SelectItem value="price-desc">Giá: Cao đến Thấp</SelectItem>
            <SelectItem value="name-asc">Tên: A-Z</SelectItem>
            <SelectItem value="name-desc">Tên: Z-A</SelectItem>
            <SelectItem value="collection">Theo Collection</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}