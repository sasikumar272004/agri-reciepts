
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
  filterDateRange: { start: Date | null; end: Date | null };
  setFilterDateRange: (value: { start: Date | null; end: Date | null }) => void;
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
  filterDateRange,
  setFilterDateRange,
  showFilters,
  setShowFilters,
  filteredCommittees,
  commodities,
  committeesLoading,
  receiptsLoading
}: ReceiptFiltersProps) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
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

      {/* Desktop Filters or Mobile Expanded Filters */}
      <div className={`${showFilters ? 'block' : 'hidden'} sm:block`}>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
      {/* Conditionally render Committee filter */}
      {(userRole !== 'DEO' && userRole !== 'Supervisor') && (
        <div className="w-full sm:w-48">
          <Select value={filterCommittee} onValueChange={setFilterCommittee} disabled={committeesLoading}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by committee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Committees</SelectItem>
              {filteredCommittees?.map((committee) => (
                <SelectItem key={committee.name} value={committee.name}>
                  {committee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Conditionally render Commodity filter */}
      {(userRole === 'Supervisor' || userRole === 'JD') && (
        <div className="w-full sm:w-48">
          <Select value={filterCommodity} onValueChange={setFilterCommodity} disabled={receiptsLoading}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by commodity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Commodities</SelectItem>
              {commodities.map((commodity) => (
                <SelectItem key={commodity} value={commodity}>
                  {commodity}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Payee filter */}
      <div className="w-full sm:w-48">
        <Label htmlFor="filterPayee" className="sr-only">Filter by Payee</Label>
        <Input
          id="filterPayee"
          placeholder="Filter by Payee"
          value={filterPayee}
          onChange={(e) => setFilterPayee(e.target.value)}
        />
      </div>

      {/* Buyer filter */}
      <div className="w-full sm:w-48">
        <Label htmlFor="filterBuyer" className="sr-only">Filter by Buyer</Label>
        <Input
          id="filterBuyer"
          placeholder="Filter by Buyer"
          value={filterBuyer}
          onChange={(e) => setFilterBuyer(e.target.value)}
        />
      </div>

      {/* Date range filter */}
      <div className="w-full sm:w-48">
        <Label htmlFor="filterDateStart" className="sr-only">Start Date</Label>
        <Input
          type="date"
          id="filterDateStart"
          value={filterDateRange.start ? filterDateRange.start.toISOString().substring(0, 10) : ''}
          onChange={(e) => setFilterDateRange({ ...filterDateRange, start: e.target.value ? new Date(e.target.value) : null })}
        />
      </div>
      <div className="w-full sm:w-48">
        <Label htmlFor="filterDateEnd" className="sr-only">End Date</Label>
        <Input
          type="date"
          id="filterDateEnd"
          value={filterDateRange.end ? filterDateRange.end.toISOString().substring(0, 10) : ''}
          onChange={(e) => setFilterDateRange({ ...filterDateRange, end: e.target.value ? new Date(e.target.value) : null })}
        />
      </div>
        </div>
      </div>
    </div>
  );
};
