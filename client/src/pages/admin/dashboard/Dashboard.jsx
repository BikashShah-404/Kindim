import React from "react";
import AdminMenu from "../AdminMenu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenuePerDay } from "./RevenuePerDay";
import {
  useGetDashboardAnalyticsQuery,
  useGetLowStockProductsQuery,
  useGetOrderAnalyticsQuery,
  useGetRevenuePerDayQuery,
  useGetTopSellingProductsQuery,
} from "@/redux/api/analyticsSlice";
import TotalCard from "./TotalCard";
import OrderCard from "./OrderCard";
import { TopSellingProducts } from "./TopSellingProducts";
import LowStockProducts from "./LowStockProducts";

const Dashboard = () => {
  const { data: revenuePerDay, isLoading: isRevenuePerDayLoading } =
    useGetRevenuePerDayQuery();
  const { data: totalAnalytics, isLoading: isTotalAnalyticsLoading } =
    useGetDashboardAnalyticsQuery();
  const { data: ordersAnalytics, isLoading: isOrdersAnalyticsLoading } =
    useGetOrderAnalyticsQuery();

  const { data: topProducts, isLoading: isTopProductsLoading } =
    useGetTopSellingProductsQuery();

  const { data: lowStockProducts, isLoading: isLowStockProductsLoading } =
    useGetLowStockProductsQuery();

  console.log(lowStockProducts);

  return (
    <div className="bg-gradient-to-br from-black via-gray-700 to-gray-600 text-secondary min-h-screen pt-8 px-4 pb-16">
      <AdminMenu />
      <div className="w-full grid grid-cols-4 gap-6 mt-16">
        {/* Revenue Chart - full width always */}
        <div className="col-span-4">
          {!isRevenuePerDayLoading && (
            <RevenuePerDay revenuePerDay={revenuePerDay} />
          )}
        </div>

        {/* Order Analytics - takes more space */}
        <div className="col-span-4 md:col-span-2  flex flex-1   ">
          {!isOrdersAnalyticsLoading && (
            <OrderCard ordersAnalytics={ordersAnalytics?.data} />
          )}
        </div>

        <div className="col-span-4 md:col-span-2  flex flex-col  gap-4 ">
          <div className=" ">
            {!isTopProductsLoading && (
              <TopSellingProducts topProducts={topProducts?.data} />
            )}
          </div>

          {/* Low Stock Products */}
          <div className="col-span-1 xl:col-span-1">
            {!isLowStockProductsLoading && (
              <LowStockProducts products={lowStockProducts?.data} />
            )}
          </div>
        </div>

        {/* Total Cards - full width */}
        <div className="col-span-4">
          {!isTotalAnalyticsLoading && (
            <TotalCard totalAnalytics={totalAnalytics?.data} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
