import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import { useToast } from "@/components/hooks/use-toast";
import { Search, TrendingUp, User, DollarSign, Package, Calendar } from 'lucide-react';
import { useReceiptData } from '@/components/hooks/useReceiptData';

// Updated Receipt interface to match actual data structure
interface Receipt {
  id: string;
  date: string;
  trader_name: string;
  commodity: string;
  quantity: number;
  value: number;
  committee_id: string;
  committeeName?: string;
  book_number?: string;
  receipt_number?: string;
  payee_name?: string;
  trader_address?: string;
  unit?: string;
  fees_paid?: number;
  nature_of_receipt?: string;
  vehicle_number?: string;
  invoice_number?: string;
  payee_address?: string;
  collection_location?: string;
  designation?: string;
  generated_by?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  status?: string;
  collected_by?: string;
  checkpost_location?: string;
}

interface TraderData {
  name: string;
  receipts: Receipt[];
  totalValue: number;
  totalQuantity: number;
  commodities: string[];
  avgValue: number;
  lastTransaction: string | null;
}

const TraderAnalytics = ({ user }: { user: any }) => {
  const { userAccessibleReceipts, receiptsLoading } = useReceiptData(user);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrader, setSelectedTrader] = useState<string | null>(null);
  const { toast } = useToast();

  if (receiptsLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">Loading trader analytics...</div>
      </div>
    );
  }

  const receiptsData = userAccessibleReceipts;

  const traderData: Record<string, TraderData> = receiptsData.reduce((acc, receipt: Receipt) => {
    const traderName = receipt.trader_name || 'Unknown Trader';
    if (!acc[traderName]) {
      acc[traderName] = {
        name: traderName,
        receipts: [],
        totalValue: 0,
        totalQuantity: 0,
        commodities: [],
        avgValue: 0,
        lastTransaction: null
      };
    }
    
    acc[traderName].receipts.push(receipt);
    // Sum fees_paid only if nature_of_receipt is 'mf'
    const isMarketFees = receipt.nature_of_receipt === 'mf';
    console.log('Receipt:', receipt.id, 'isMarketFees:', isMarketFees, 'fees_paid:', receipt.fees_paid);
    acc[traderName].totalValue += isMarketFees ? (Number(receipt.fees_paid) || 0) : 0;
    acc[traderName].totalQuantity += Number(receipt.quantity) || 0;
    
    const commoditiesSet = new Set(acc[traderName].commodities);
    commoditiesSet.add(receipt.commodity);
    acc[traderName].commodities = Array.from(commoditiesSet);
    
    if (!acc[traderName].lastTransaction || new Date(receipt.date) > new Date(acc[traderName].lastTransaction)) {
      acc[traderName].lastTransaction = receipt.date;
    }
    
    return acc;
  }, {} as Record<string, TraderData>);

  Object.keys(traderData).forEach(traderName => {
    const trader = traderData[traderName];
    trader.avgValue = trader.receipts.length > 0 ? trader.totalValue / trader.receipts.length : 0;
  });

  const filteredTraders = Object.values(traderData).filter((trader: TraderData) =>
    trader.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const topTraders = Object.values(traderData)
    .sort((a: TraderData, b: TraderData) => b.totalValue - a.totalValue)
    .slice(0, 10);

  const selectedTraderData = selectedTrader ? traderData[selectedTrader] : null;

  const getTraderMonthlyData = (trader: TraderData) => {
    if (!trader) return [];
    
    const monthlyData = trader.receipts.reduce((acc: any, receipt: Receipt) => {
      const month = new Date(receipt.date).toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!acc[month]) {
        acc[month] = { month, count: 0, value: 0 };
      }
      acc[month].count += 1;
      const isMarketFees = receipt.nature_of_receipt === 'mf';
      acc[month].value += isMarketFees ? (Number(receipt.fees_paid) || 0) : 0;
      return acc;
    }, {});
    
    return Object.values(monthlyData);
  };

  const COLORS = ['#4caf50', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0', '#ffb347'];

  if (Object.keys(traderData).length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Trader Performance Analytics</h2>
          <p className="text-gray-600">Comprehensive analysis of trader performance and trading patterns</p>
        </div>

        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">
              <h3 className="text-lg font-medium mb-2">No Trader Data Available</h3>
              <p>No receipts with trader information found for {user.role === 'JD' ? 'the district' : 'your committee'}. Once receipts with trader data are added, analytics will be displayed here.</p>
              {user.role === 'Supervisor' && (
                <p className="mt-2 text-sm">Committee: {user.committee}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Trader Performance Analytics</h2>
        <p className="text-gray-600">Comprehensive analysis of trader performance and trading patterns</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Traders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Search by trader name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" onClick={() => setSelectedTrader(null)}>
              Clear Selection
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Traders by Market Fees</CardTitle>
            <CardDescription>Highest trading volume by market fees</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topTraders}
                  dataKey="totalValue"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#4caf50"
                  label={(entry) => entry.name}
                >
                  {topTraders.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Total Market Fees']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trader Directory</CardTitle>
            <CardDescription>Click on a trader to view detailed analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {filteredTraders.map((trader: TraderData, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedTrader === trader.name 
                      ? 'bg-green-50 border-green-200' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedTrader(trader.name)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{trader.name}</h4>
                      <p className="text-sm text-gray-600">
                        {trader.receipts.length} receipts • {trader.commodities.length} commodities
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">₹{(trader.totalValue / 100000).toFixed(1)}L</div>
                      <div className="text-sm text-gray-600">Total Market Fees</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedTraderData && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {selectedTraderData.name} - Detailed Analytics
              </CardTitle>
              <CardDescription>
                Comprehensive performance analysis for the selected trader
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{selectedTraderData.receipts.length}</div>
                  <div className="text-sm text-green-600">Total Receipts</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">₹{(selectedTraderData.totalValue / 100000).toFixed(1)}L</div>
                  <div className="text-sm text-green-600">Total Market Fees</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">₹{selectedTraderData.avgValue.toFixed(0)}</div>
                  <div className="text-sm text-yellow-600">Avg Market Fees per Receipt</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{selectedTraderData.commodities.length}</div>
                  <div className="text-sm text-purple-600">Commodities</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">Monthly Trading Pattern</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={getTraderMonthlyData(selectedTraderData)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#4caf50" name="Value" />
                      <Line type="monotone" dataKey="count" stroke="#82ca9d" name="Count" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Commodities Traded</h4>
                  <div className="space-y-2">
                    {selectedTraderData.commodities.map((commodity: string, index: number) => (
                      <Badge key={index} variant="secondary" className="mr-2">
                        {commodity}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p><strong>Last Transaction:</strong> {selectedTraderData.lastTransaction ? new Date(selectedTraderData.lastTransaction).toLocaleDateString() : 'N/A'}</p>
                    <p><strong>Total Quantity:</strong> {selectedTraderData.totalQuantity.toLocaleString()} units</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TraderAnalytics;