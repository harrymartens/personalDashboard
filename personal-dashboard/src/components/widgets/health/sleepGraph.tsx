import { getSleepDuration } from "@/api";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { Label, Pie, PieChart } from "recharts";

function convertTime(decimalTime:string):string{
    const totalHours = parseFloat(decimalTime);
    let hours = Math.floor(totalHours);
    let minutes = Math.round((totalHours - hours) * 60);
  
    if (minutes === 60) {
      hours += 1;
      minutes = 0;
    }
  
    return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
  }

type SleepData = {
  sleep: number;
  sleep_awake: number;
  sleep_core: number;
  sleep_rem: number;
  sleep_deep:number;
};

export default function SleepGraph(){
    const [sleepData, setSleepData] = useState<SleepData>({sleep:0, sleep_awake:0, sleep_core:0, sleep_rem:0,sleep_deep:0});

    useEffect(() => {
        const fetchHealthData = async () => {
          try {
            const response = await getSleepDuration();
            if (response && response.length) {
              console.log(response)
              setSleepData(response[0]);
            }
          } catch (err) {
            console.error("Error fetching sleep duration:", err);
          }
        };
    
        fetchHealthData();
      }, []);

      const fillColors = {
        sleep_awake: "#FBD356",
        sleep_rem: "hsl(310, 85%, 55%)",    
        sleep_deep: "hsl(280, 85%, 55%)",
        sleep_core: "hsl(220, 85%, 55%)",
      };
    
    
      const { sleep: sleepDuration, ...sleepStages } = sleepData;

      const chartData = Object.entries(sleepStages || {}).map(([key, value]) => ({
        stage: key,
        time: value,
        fill: fillColors[key as keyof typeof fillColors],
      }));
    
      const chartConfig = {
        time: {
          label: "time",
        },
        sleep_awake: {
          label: "Awake",
        },
        sleep_rem: {
          label: "REM",
        },
        sleep_deep: {
          label: "Deep",
        },
        sleep_core: {
          label: "Core",
        }
      } satisfies ChartConfig;

    return (
        <ChartContainer
              config={chartConfig}
              className="size-[300px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="time"
                  nameKey="stage"
                  innerRadius={55}
                  outerRadius={75}
                  strokeWidth={5}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) -5}
                              // eslint-disable-next-line tailwindcss/no-custom-classname
                              className="fill-foreground text-2xl font-bold"
                            >
                              {convertTime(sleepDuration.toLocaleString())}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 15}
                              // eslint-disable-next-line tailwindcss/no-custom-classname
                              className="fill-muted-foreground"
                            >
                              Sleep Duration
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
    )
}