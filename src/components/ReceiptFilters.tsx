
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface ReceiptFiltersProps {
  userRole: string;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterCommittee: string;
  setFilterCommittee: (value: string) => void;
  filterCommodity: string;
  setFilterCommodity: (value: string) => void;
  filterPayee: string;
  setFilterPayee: (value: string) => void;
  filterBuyer: string;
  setFilterBuyer: (value: string) => void;
  filterNatureOfReceipt: string;
  setFilterNatureOfReceipt: (value: string) => void;
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  filteredCommittees: any[];
  commodities: string[];
  committeesLoading: boolean;
  receiptsLoading: boolean;
}

export const ReceiptFilters = ({
  userRole,
  searchTerm,
  setSearchTerm,
  filterCommittee,
  setFilterCommittee,
  filterCommodity,
  setFilterCommodity,
  filterPayee,
  setFilterPayee,
  filterBuyer,
  setFilterBuyer,
  filterNatureOfReceipt,
  setFilterNatureOfReceipt,
  showFilters,
  setShowFilters,
  filteredCommittees,
  commodities,
  committeesLoading,
  receiptsLoading
}: ReceiptFiltersProps) => {
  return (
    <>
      <div className="space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden w-full"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Desktop Filters or Mobile Expanded Filters */}
      <div className={`${showFilters ? 'block' : 'hidden'} sm:block`}>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          {/* Search input */}
          <div className="flex-1">
            <Label htmlFor="search" className="sr-only">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Search receipts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Nature of Receipt filter */}
          <div className="w-full sm:w-48">
            <Label htmlFor="filterNatureOfReceipt" className="sr-only">Filter by Nature of Receipt</Label>
            <Select
              onValueChange={(value) => setFilterNatureOfReceipt(value)}
              value={filterNatureOfReceipt}
              defaultValue="all"
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Nature of Receipt" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="LF">Licence Fees (LF)</SelectItem>
                <SelectItem value="MF">Market Fees (MF)</SelectItem>
                <SelectItem value="UC">User Charges (UC)</SelectItem>
                <SelectItem value="others">Others</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </>
  );
};
