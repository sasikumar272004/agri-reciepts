import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Edit, Eye } from "lucide-react";

interface ReceiptDesktopTableProps {
  receiptsLoading: boolean;
  filteredReceipts: any[];
  user: any;
  onView: (receipt: any) => void;
  onEdit: (receipt: any) => void;
}

export const ReceiptDesktopTable = ({ receiptsLoading, filteredReceipts, user, onView, onEdit }: ReceiptDesktopTableProps) => {
  return (
    <div className="hidden sm:block border rounded-lg overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[100px]">Date</TableHead>
            <TableHead className="min-w-[120px]">Book/Receipt</TableHead>
            <TableHead className="min-w-[150px]">Trader</TableHead>
            <TableHead className="min-w-[150px]">Payee</TableHead>
            {/* Removed Committee, Commodity, Quantity columns */}
            <TableHead className="min-w-[100px]">Amount Paid</TableHead>
            {/* Removed Status column as per request */}
            <TableHead className="min-w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {receiptsLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={10}><Skeleton className="h-8 w-full" /></TableCell>
              </TableRow>
            ))
          ) : filteredReceipts.length > 0 ? (
            filteredReceipts.map((receipt: any) => (
              <TableRow key={receipt.id}>
                <TableCell className="font-medium">
                  {new Date(receipt.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium">{receipt.book_number}</div>
                    <div className="text-gray-500">{receipt.receipt_number}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium truncate max-w-[120px]">
                      {receipt.trader_name || 'N/A'}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium truncate max-w-[120px]">
                      {receipt.payee_name || 'N/A'}
                    </div>
                  </div>
                </TableCell>
                {/* Removed Committee, Commodity, Quantity cells */}
                <TableCell>₹{Number(receipt.fees_paid).toLocaleString()}</TableCell>
                {/* Removed Status cell as per request */}
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => onView(receipt)}>
                      <Eye className="h-3 w-3" />
                    </Button>
                    {(user.role === 'DEO' && receipt.created_by === user.id) && (
                      <Button variant="outline" size="sm" onClick={() => onEdit(receipt)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-8">
                <div className="text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No receipts found</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
