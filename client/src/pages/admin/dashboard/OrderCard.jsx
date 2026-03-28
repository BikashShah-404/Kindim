import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartNoAxesCombined, ChartPie } from "lucide-react";
import { Pie, PieChart, Sector, Tooltip } from "recharts";

// #endregion
const renderActiveShape = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
  payload,
  percent,
  value,
}) => {
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * (midAngle ?? 1));
  const cos = Math.cos(-RADIAN * (midAngle ?? 1));
  const sx = (cx ?? 0) + ((outerRadius ?? 0) + 10) * cos;
  const sy = (cy ?? 0) + ((outerRadius ?? 0) + 10) * sin;
  const mx = (cx ?? 0) + ((outerRadius ?? 0) + 30) * cos;
  const my = (cy ?? 0) + ((outerRadius ?? 0) + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill={"white"}
        fontFamily="alegreya"
        fontSize={25}
      >
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill="var(--chart-5)"
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={(outerRadius ?? 0) + 6}
        outerRadius={(outerRadius ?? 0) + 10}
        fill="white"
        className=""
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={"white"}
        fill="none"
        className=""
      />
      <circle cx={ex} cy={ey} r={2} fill={"white"} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="white"
        fontSize={25}
        fontFamily="alegreya"
      >{`${value} orders`}</text>
    </g>
  );
};

const OrderCard = ({ defaultIndex, ordersAnalytics }) => {
  console.log(ordersAnalytics);

  return (
    <Card className="w-full bg-gradient-to-br   from-black via-gray-800 to-gray-950  text-secondary  ">
      <CardHeader className="flex flex-row  items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <ChartPie className="h-5 w-5 text-secondary" />
          <CardTitle className="text-xl font-alegreya">
            Order Analytics
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent
        className={"flex flex-1 justify-center items-center overflow-visible  "}
      >
        <PieChart
          style={{
            width: "100%",
            aspectRatio: 1,
          }}
          responsive
          width={800}
          height={500}
        >
          <Pie
            activeShape={renderActiveShape}
            data={ordersAnalytics}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="80%"
            fill="black"
            dataKey="value"
            isAnimationActive={true}
          />
          <Tooltip content={() => null} defaultIndex={defaultIndex} />
        </PieChart>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
