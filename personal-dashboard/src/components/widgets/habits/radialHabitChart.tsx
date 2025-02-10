/* eslint-disable tailwindcss/no-custom-classname */
"use client";

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Habit } from "@/types/habit";

interface ChartData {
  incomplete: number;
  [key: string]: number | string | undefined;
}

function mapDataToChart(data: Habit[]): ChartData {
  const totalTarget = data.reduce((sum, item) => sum + item.target, 0);
  const totalProgress = data.reduce(
    (sum, item) => sum + item.current_progress,
    0
  );
  const incomplete = totalTarget - totalProgress;

  const resultObj: ChartData = { incomplete };

  data.forEach((item) => {
    resultObj[item.name] = item.current_progress;
  });

  return resultObj;
}

export function RadialHabitChart({data}:{data:Habit[]}) {
  const chartData = mapDataToChart(data);
  const dataKeys = Object.keys(chartData);

  const habitColorMap = data.reduce((acc, habit) => {
    acc[habit.name] = habit.colour; // or habit.colour (depending on your field name)
    return acc;
  }, {} as Record<string, string>);

  const chartConfig = dataKeys.reduce<Record<string, { label: string}>>(
      (acc, key) => {
        if (key === "incomplete") {
          acc[key] = {
            label: "Incomplete",
          };
        } else {
          acc[key] = {
            label: key,
          };
        }
        return acc;
      },
      {}
    ) satisfies ChartConfig;

  const totalVisitors = Object.entries(chartData)
    .filter(([key]) => key !== "incomplete")
    .reduce(
      (sum, [, value]) => sum + (typeof value === "number" ? value : 0),
      0
    );

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto size-[200px] "
    >
      <RadialBarChart
        data={[chartData]}
        startAngle={0}
        endAngle={360}
        innerRadius={80}
        outerRadius={130}
      >
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) - 7}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {totalVisitors.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 15}
                      className="fill-muted-foreground"
                    >
                      Habits Complete
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>

        {/* 6. Dynamically render one RadialBar per key */}
        {dataKeys.map((key) => {
          // "incomplete" always gets --dark
          if (key === "incomplete") {
            return (
              <RadialBar
                key={key}
                dataKey={key}
                stackId="a"
                cornerRadius={5}
                fill="var(--dark)"
                className="stroke-transparent opacity-20"
              />
            );
          }

          const colour = habitColorMap[key];

          return (
            <RadialBar
              key={key}
              dataKey={key}
              stackId="a"
              cornerRadius={5}
              fill={colour}
              className="stroke-transparent stroke-2"
            />
          );
        })}
      </RadialBarChart>
    </ChartContainer>
  );
}
