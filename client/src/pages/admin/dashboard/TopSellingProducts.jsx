"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  sold: {
    label: "Sold",
    color: "var(--chart-1)",
  },
  label: {
    color: "var(--background)",
  },
};

export function TopSellingProducts({ topProducts }) {
  console.log(topProducts);

  return (
    <Card
      className={
        "bg-gradient-to-br   from-black via-gray-800 to-gray-950  text-secondary  "
      }
    >
      <CardHeader>
        <CardTitle className={"font-alegreya text-xl"}>
          Top Selling Products
        </CardTitle>
      </CardHeader>
      <CardContent className={""}>
        <ChartContainer config={chartConfig} className={"w-full h-[300px] "}>
          <BarChart
            accessibilityLayer
            data={topProducts}
            layout="vertical"
            margin={{
              right: 20,
            }}
            barSize={50}
          >
            <CartesianGrid horizontal={false} className="" />
            <YAxis
              dataKey="product"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="sold" type="number" />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  className={"text-black"}
                />
              }
            />
            <Bar
              dataKey="sold"
              layout="vertical"
              fill="var(--color-sold)"
              radius={8}
            >
              <LabelList
                dataKey="product"
                position="insideLeft"
                offset={8}
                fontFamily="alegreya"
                className="fill-(--color-label)"
                fontSize={12}
              />
              <LabelList
                dataKey="sold"
                position="right"
                offset={8}
                className="fill-accent"
                fontSize={15}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
