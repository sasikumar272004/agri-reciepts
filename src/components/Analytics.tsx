import React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import { useToast } from "@/hooks/use-toast";
import { useReceiptData } from '@/hooks/useReceiptData';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const subLocs = data.subLocations || {};
    const COLORS = ['#4caf50', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0', '#ffb347'];

    return (
      <div style={{ backgroundColor: 'white', border: '1px solid #ccc', padding: 10, borderRadius: 4, minWidth: 200 }}>
        <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
        <p style={{ margin: '4px 0' }}>Total: ₹{data.value.toFixed(0)}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {Object.entries(subLocs).map(([subLoc, val], index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 12, height: 12, backgroundColor: COLORS[index % COLORS.length], borderRadius: '50%' }}></div>
              <span>{subLoc}: ₹{(val as number).toFixed(0)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

const Analytics = ({ user }: { user: any }) => {
  const { userAccessibleReceipts, receiptsLoading, userCommitteeId } = useReceiptData(user);
  const { toast } = useToast();

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (receiptsLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">Loading analytics data...</div>
      </div>
    );
  }

  let receiptsData = userAccessibleReceipts;

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    receiptsData = receiptsData.filter((receipt: any) => {
      const receiptDate = new Date(receipt.date);
      return receiptDate >= start && receiptDate <= end;
    });
  }

  const districtData = receiptsData.reduce((acc: any, receipt) => {
    const district = receipt.committeeName || 'Unknown';
    if (!acc[district]) {
      acc[district] = { district, count: 0, value: 0 };
    }
    acc[district].count += 1;
    acc[district].value += Number(receipt.value) || 0;
    return acc;
  }, {});

  const districtChartData = Object.values(districtData);

  const commodityData = receiptsData.reduce((acc: any, receipt) => {
    const commodity = receipt.commodity || 'Unknown';
    if (!acc[commodity]) {
      acc[commodity] = { commodity, count: 0, value: 0 };
    }
    acc[commodity].count += 1;
    acc[commodity].value += Number(receipt.value) || 0;
    return acc;
  }, {});

  const commodityChartData = Object.values(commodityData).slice(0, 10);

  const monthlyData = receiptsData.reduce((acc: any, receipt) => {
    const month = new Date(receipt.date).toLocaleString('default', { month: 'short', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = { month, count: 0, value: 0 };
    }
    acc[month].count += 1;
    acc[month].value += Number(receipt.value) || 0;
    return acc;
  }, {});

  const monthlyChartData = Object.values(monthlyData);

  const totalReceipts = receiptsData.length;
  const totalValue = receiptsData.reduce((sum, receipt) => sum + (Number(receipt.value) || 0), 0);
  const totalQuantity = receiptsData.reduce((sum, receipt) => sum + (Number(receipt.quantity) || 0), 0);
  const avgValue = totalReceipts > 0 ? totalValue / totalReceipts : 0;

  const COLORS = ['#4caf50', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0', '#ffb347'];

  const marketFeesReceipts = user.role === 'Supervisor' ? receiptsData.filter((receipt: any) => receipt.nature_of_receipt === "mf") : [];

  const locationData = marketFeesReceipts.reduce((acc: any, receipt: any) => {
    const location = receipt.collection_location || 'Unknown';
    if (!acc[location]) {
      acc[location] = { location, count: 0, value: 0 };
    }
    acc[location].count += 1;
    acc[location].value += Number(receipt.fees_paid) || 0;
    return acc;
  }, {});
  const locationChartData = Object.values(locationData);

  const getAnalyticsTitle = () => {
    switch (user.role) {
      case 'JD':
        return 'District Analytics Dashboard';
      case 'Supervisor':
        return `${user.committee} Analytics Dashboard`;
      default:
        return 'Analytics Dashboard';
    }
  };

  const getAnalyticsDescription = () => {
    switch (user.role) {
      case 'JD':
        return 'Comprehensive overview of AMC receipts across East Godavari District';
      case 'Supervisor':
        return `Committee-level analysis of receipts and trading activity for ${user.committee}`;
      default:
        return 'Analysis of receipts and trading activity';
    }
  };

  if (totalReceipts === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{getAnalyticsTitle()}</h2>
          <p className="text-gray-600">{getAnalyticsDescription()}</p>
        </div>

        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">
              <h3 className="text-lg font-medium mb-2">No Data Available</h3>
              <p>No receipts found for {user.role === 'JD' ? 'the district' : 'your committee'}. Once receipts are added, analytics will be displayed here.</p>
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
    <>
      {user.role === 'Supervisor' ? (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="text-sm text-green-800">
              <p><strong>Committee:</strong> {user.committee}</p>
              <p><strong>Committee ID:</strong> {userCommitteeId ? userCommitteeId.slice(0, 8) + '...' : 'Not Found'}</p>
              <p><strong>Receipts Found:</strong> {totalReceipts}</p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(totalValue / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">Cumulative trade value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quantity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalQuantity / 1000).toFixed(1)}K</div>
            <p className="text-xs text-muted-foreground">Metric tons traded</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Receipt Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{avgValue.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart 1: Top Commodities */}
        <Card>
          <CardHeader>
            <CardTitle>Top Commodities</CardTitle>
            <CardDescription>Most traded commodities by volume</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={commodityChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#4caf50"
                  dataKey="count"
                >
                  {commodityChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart 2: Market Fees by Location */}
        <Card>
          <CardHeader>
            <CardTitle>Market Fees Analysis by Location</CardTitle>
            <CardDescription>Analysis of market fees receipts collected by location</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={(() => {
                    const mainLocations: any = {};
                    marketFeesReceipts.forEach((receipt: any) => {
                      const mainLoc = receipt.collection_location === 'checkpost' ? 'Checkpost' : 'Office';
                      if (!mainLocations[mainLoc]) {
                        mainLocations[mainLoc] = { name: mainLoc, value: 0, subLocations: {} };
                      }
                      mainLocations[mainLoc].value += Number(receipt.fees_paid) || 0;

                      const subLoc = receipt.checkpost_location || 'Unknown';
                      if (!mainLocations[mainLoc].subLocations[subLoc]) {
                        mainLocations[mainLoc].subLocations[subLoc] = 0;
                      }
                      mainLocations[mainLoc].subLocations[subLoc] += Number(receipt.fees_paid) || 0;
                    });
                    return Object.values(mainLocations);
                  })()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#82ca9d"
                  dataKey="value"
                >
                  {(() => {
                    const data = (() => {
                      const mainLocations: any = {};
                      marketFeesReceipts.forEach((receipt: any) => {
                        const mainLoc = receipt.collection_location === 'checkpost' ? 'Checkpost' : 'Office';
                        if (!mainLocations[mainLoc]) {
                          mainLocations[mainLoc] = { name: mainLoc, value: 0, subLocations: {} };
                        }
                        mainLocations[mainLoc].value += Number(receipt.fees_paid) || 0;
                      });
                      return Object.values(mainLocations);
                    })();
                    return data.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ));
                  })()}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Line Chart - Full Width Below */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Monthly Market Fees Trend</CardTitle>
          <CardDescription>MF collected per month (Apr 2024 - Mar 2025)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={[
                { month: 'APR', mf: 391.12 },
                { month: 'MAY', mf: 307.87 },
                { month: 'JUN', mf: 285.15 },
                { month: 'JUL', mf: 203.46 },
                { month: 'AUG', mf: 252.85 },
                { month: 'SEPT', mf: 273.33 },
                { month: 'OCT', mf: 301.11 },
                { month: 'NOV', mf: 298.90 },
                { month: 'DEC', mf: 297.19 },
                { month: 'JAN', mf: 227.90 },
                { month: 'FEB', mf: 220.17 },
                { month: 'MAR', mf: 721.56 },
              ]}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" interval={0} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="mf" stroke="#4caf50" dot />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
};


export default Analytics;
