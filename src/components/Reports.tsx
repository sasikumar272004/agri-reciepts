import React from "react"
import { Button } from "./ui/button"

const Reports: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Row 1: Proforma 1 Report */}
      <div className="flex items-center justify-between border rounded-md p-4">
        <div className="font-semibold text-lg">Report for Market Fees</div>
        <div className="space-x-4">
          <Button variant="default" size="sm">Download Excel</Button>
          <Button variant="default" size="sm">Download PDF</Button>
        </div>
      </div>

      {/* Row 2: Proforma 2 Report */}
      <div className="flex items-center justify-between border rounded-md p-4">
        <div className="font-semibold text-lg">Report for Market Fees in checkpost</div>
        <div className="space-x-4">
          <Button variant="default" size="sm">Download Excel</Button>
          <Button variant="default" size="sm">Download PDF</Button>
        </div>
      </div>

      {/* Row 3: Commodity Report */}
      <div className="flex items-center justify-between border rounded-md p-4">
        <div className="font-semibold text-lg">Commodity Report</div>
        <div className="space-x-4">
          <Button variant="default" size="sm">Download Excel</Button>
          <Button variant="default" size="sm">Download PDF</Button>
        </div>
      </div>
    </div>
  )
}

export default Reports
