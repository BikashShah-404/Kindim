import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from "@/components/ui/card";

import {
  ShoppingCart,
  DollarSign,
  Users,
  Package,
  ChartNoAxesCombined,
} from "lucide-react";

const TotalCard = ({ totalAnalytics }) => {
  const {
    totalOrders,
    totalOrdersToday,
    totalRevenue,
    totalUsers,
    totalProducts,
  } = totalAnalytics;

  const cards = [
    {
      label: "Total Orders",
      value: totalOrders,
      icon: ShoppingCart,
      color: "var(--chart-1)",
      bg: "bg-slate-100/10",
    },
    {
      label: "Total Revenue",
      value: totalRevenue,
      icon: DollarSign,
      color: "var(--chart-2)",
      bg: "bg-slate-100/10",
    },
    {
      label: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "var(--chart-3)",
      bg: "bg-slate-100/10",
    },
    {
      label: "Total Products",
      value: totalProducts,
      icon: Package,
      color: "var(--chart-4)",
      bg: "bg-slate-100/10",
    },
  ];
  return (
    <Card className="w-full bg-gray-950 text-secondary">
      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <ChartNoAxesCombined className="h-5 w-5 text-secondary" />
          <CardTitle className="text-base font-alegreya text-2xl">
            Total Analytics
          </CardTitle>
        </div>
        <div className=" font-alegreya text-muted-foreground flex justify-center items-center gap-x-4">
          Total Orders Today:{" "}
          <span className="font-semibold text-secondary text-xl">
            {!totalAnalytics ? "..." : `${totalOrdersToday} `}
          </span>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 divide-y sm:grid-cols-4 sm:divide-x sm:divide-y-0 p-0">
        {cards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="flex items-center gap-4 p-5">
            <div className={`rounded-xl p-3 ${bg}`}>
              <Icon className="h-5 w-5" style={{ color }} />
            </div>
            <div className="flex flex-col">
              <span className=" font-alegreya text-white/80">{label}</span>
              <span className="text-2xl font-bold" style={{ color }}>
                {!totalAnalytics ? "..." : value.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TotalCard;
