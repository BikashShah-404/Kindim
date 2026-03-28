import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";

const getStockColor = (stock) => {
  if (stock <= 2) return "#ef4444"; // red
  if (stock <= 5) return "#f97316"; // orange
  if (stock <= 8) return "#eab301"; // yellow
  if (stock <= 12) return "var(--chart-1)"; // blue
  return "#22c55e"; // green
};

const chartConfig = {
  stock: {
    label: "Stock",
  },
};

const LowStockProducts = ({ products }) => {
  const data = products?.map((p) => ({
    name: p.name,
    stock: p.stock,
    fill: getStockColor(p.stock),
  }));

  return (
    <Card className="bg-gray-950 text-secondary">
      <CardHeader>
        <CardTitle className={"font-alegreya text-xl"}>
          Low Stock Products
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full h-[300px]">
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{ left: 0, right: 40 }}
            barSize={18}
          >
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              width={120}
              fontFamily="alegreya"
              fontSize={13}
              tickFormatter={(value) => value.slice(0, 14)}
              style={{ fill: "#fff" }}
            />
            <XAxis dataKey="stock" type="number" />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  className={""}
                  labelClassName={"text-white"}
                />
              }
            />
            <Bar dataKey="stock" layout="vertical" radius={5}>
              {data?.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default LowStockProducts;
