import React, { useState, useMemo, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Building2 } from "lucide-react";
import { useReceiptData } from '@/hooks/useReceiptData';
import { useReceiptFilters } from '@/hooks/useReceiptFilters';
import { handleExport, getReceiptListTitle, getReceiptListDescription } from '@/utils/receiptUtils';
import { ReceiptFilters } from './ReceiptFilters';
import { ReceiptMobileView } from './ReceiptMobileView';
import { ReceiptDesktopTable } from './ReceiptDesktopTable';
import ReceiptDetailModal from './ReceiptDetailModal';
import ReceiptEntry from './ReceiptEntry';

import { parseISO, isWithinInterval } from 'date-fns';

const ReceiptList = ({ user }) => {
  const { receiptsLoading, committeesLoading, filteredCommittees, userAccessibleReceipts, userCommitteeId } = useReceiptData(user);
  
  const {
    searchTerm,
    setSearchTerm,
    filterCommittee,
    setFilterCommittee,
    filterCommodity,
    setFilterCommodity,
    showFilters,
    setShowFilters,
    commodities,
  } = useReceiptFilters(userAccessibleReceipts);

  // New filters state
  const [filterPayee, setFilterPayee] = useState('');
  const [filterBuyer, setFilterBuyer] = useState('');
  const [filterNatureOfReceipt, setFilterNatureOfReceipt] = useState('all');

  // Filter receipts based on all filters
  const filteredReceipts = useMemo(() => {
    return userAccessibleReceipts.filter((receipt) => {
      const matchesSearch = receipt.trader_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            receipt.payee_name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCommittee = filterCommittee === 'all' || !filterCommittee || receipt.committeeName === filterCommittee;
      const matchesCommodity = filterCommodity === 'all' || !filterCommodity || receipt.commodity === filterCommodity;
      const matchesPayee = !filterPayee || receipt.payee_name?.toLowerCase().includes(filterPayee.toLowerCase());
      const matchesBuyer = !filterBuyer || receipt.trader_name?.toLowerCase().includes(filterBuyer.toLowerCase());
      const matchesNature = filterNatureOfReceipt === 'all' || !filterNatureOfReceipt || receipt.nature_of_receipt?.toLowerCase() === filterNatureOfReceipt.toLowerCase();

      return matchesSearch && matchesCommittee && matchesCommodity && matchesPayee && matchesBuyer && matchesNature;
    });
  }, [userAccessibleReceipts, searchTerm, filterCommittee, filterCommodity, filterPayee, filterBuyer, filterNatureOfReceipt]);

  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const onExport = () => handleExport(filteredReceipts);

  const handleView = (receipt) => {
    setSelectedReceipt(receipt);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const receiptEntryRef = React.useRef(null);

  const handleEdit = (receipt) => {
    setSelectedReceipt(receipt);
    setIsEditMode(true);
    setIsModalOpen(true);

    // Scroll to ReceiptEntry component after a short delay to ensure it is rendered
    setTimeout(() => {
      if (receiptEntryRef.current) {
        receiptEntryRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleCloseModal = () => {
    setSelectedReceipt(null);
    setIsModalOpen(false);
    setIsEditMode(false);
  };

  // Extract unique payee and buyer names for autocomplete suggestions
  const uniquePayees = Array.from(new Set(userAccessibleReceipts.map(r => r.payee_name).filter(Boolean)));
  const uniqueBuyers = Array.from(new Set(userAccessibleReceipts.map(r => r.trader_name).filter(Boolean)));

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="flex items-center">
              <FileText className="mr-2 h-5 w-5 flex-shrink-0" />
              <span className="truncate">{getReceiptListTitle(user.role)}</span>
            </span>
            {(user.role === 'Supervisor' || user.role === 'JD') && (
              <Button onClick={onExport} variant="outline" size="sm" className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            )}
          </CardTitle>
          <CardDescription className="text-sm">
            {getReceiptListDescription(user.role)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Committee Access Debug Info - only show for Supervisor and DEO */}
          {(user.role === 'Supervisor' || user.role === 'DEO') && (
            <div className="mb-4 p-3 border rounded-lg bg-blue-50 border-blue-200">
              <div className="flex items-center space-x-2 text-sm">
                <Building2 className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">Committee Access:</span>
                <span className="text-blue-700">
                  {user.committee} {userCommitteeId ? `(ID: ${userCommitteeId.slice(0, 8)}...)` : '(Not Found)'}
                </span>
              </div>
              <div className="text-xs text-blue-600 mt-1">
                You can only see receipts from your assigned committee. Found {userAccessibleReceipts.length} accessible receipts.
              </div>
            </div>
          )}

          <ReceiptFilters
            userRole={user.role}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterCommittee={filterCommittee}
            setFilterCommittee={setFilterCommittee}
            filterCommodity={filterCommodity}
            setFilterCommodity={setFilterCommodity}
            filterPayee={filterPayee}
            setFilterPayee={setFilterPayee}
            filterBuyer={filterBuyer}
            setFilterBuyer={setFilterBuyer}
            filterNatureOfReceipt={filterNatureOfReceipt}
            setFilterNatureOfReceipt={setFilterNatureOfReceipt}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            filteredCommittees={filteredCommittees}
            commodities={commodities}
            committeesLoading={committeesLoading}
            receiptsLoading={receiptsLoading}
          />

          <ReceiptMobileView
            receiptsLoading={receiptsLoading}
            filteredReceipts={filteredReceipts}
            user={user}
            onView={handleView}
            onEdit={handleEdit}
          />

          <ReceiptDesktopTable
            receiptsLoading={receiptsLoading}
            filteredReceipts={filteredReceipts}
            user={user}
            onView={handleView}
            onEdit={handleEdit}
          />

          {/* Summary Footer */}
          <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-sm text-gray-600">
            <span>
              Showing {filteredReceipts.length} of {userAccessibleReceipts.length} receipts
            </span>
            <span className="font-medium">
              Total Amount Paid: ₹{filteredReceipts.reduce((sum, receipt: any) => sum + Number(receipt.amount_paid ?? receipt.fees_paid), 0).toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>

      <ReceiptDetailModal
        isOpen={isModalOpen && !isEditMode}
        onClose={handleCloseModal}
        receipt={selectedReceipt}
      />

      {isEditMode && selectedReceipt && (
        <div ref={receiptEntryRef}>
          <ReceiptEntry
            user={user}
            receiptToEdit={selectedReceipt}
            onClose={handleCloseModal}
          />
        </div>
      )}
    </div>
  );
};

export default ReceiptList;
