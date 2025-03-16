import { getWeight } from "@/api";
import { useEffect, useState } from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

type WeightData = {
  weight: number;
  date: string;
}[];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function WeightGraph() {
  const [bodyweightData, setBodyweight] = useState<WeightData>([]);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const response = await getWeight();
        if (response && response.length) {
            console.log(response)
            response.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          setBodyweight(response);
        }
      } catch (err) {
        console.error("Error fetching weight:", err);
      }
    };

    fetchHealthData();
  }, []);

  const chartData = bodyweightData;

  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-[200px] min-w-[200px]"
    >
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          top: 20,
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          padding="no-gap"
          tickLine={false}
          axisLine={false}
          tickFormatter={() => ""}
          tick={{fontSize:8}}
          interval={0}
        />
        <YAxis type="number" hide domain={["dataMin-0.5", "dataMax+0.5"]} />

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Line
          dataKey="weight"
          type="natural"
          stroke="hsl(220, 85%, 55%)"
          strokeWidth={2}
          dot={{
            fill: "hsl(220, 85%, 55%)",
          }}
          activeDot={{
            r: 6,
          }}
          connectNulls
        >
          {/* <LabelList
            position="top"
            offset={12}
            // eslint-disable-next-line tailwindcss/no-custom-classname
            className="fill-foreground"
            fontSize={12}
          /> */}
        </Line>
      </LineChart>
    </ChartContainer>
  );
}
