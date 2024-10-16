"use client"
import {
    Card,
    CardHeader,
    CardDescription,
    CardTitle,
    CardContent,
  } from "@/components/ui/card";
  import { ResponsiveBar } from "@nivo/bar";




  interface ChartProps {
    data: any[];
  }

  function BarChart(props: ChartProps) {
    return (
      <div className="aspect-[4/3]" {...props}>
        <ResponsiveBar
          data={[
            { name: "Jan", count: 111 },
            { name: "Feb", count: 157 },
            { name: "Mar", count: 129 },
            { name: "Apr", count: 150 },
            { name: "May", count: 119 },
            { name: "Jun", count: 72 },
          ]}
          keys={["count"]}
          indexBy="name"
          margin={{ top: 0, right: 0, bottom: 40, left: 40 }}
          padding={0.3}
          colors={["#2563eb"]}
          axisBottom={{
            tickSize: 0,
            tickPadding: 16,
          }}
          axisLeft={{
            tickSize: 0,
            tickValues: 4,
            tickPadding: 16,
          }}
          gridYValues={4}
          theme={{
            tooltip: {
              chip: {
                borderRadius: "9999px",
              },
              container: {
                color: "black",
                fontSize: "12px",
                textTransform: "capitalize",
                borderRadius: "6px",
              },
            },
            grid: {
              line: {
                stroke: "#f3f4f6",
              },
            },
          }}
          tooltipLabel={({ id }) => `${id}`}
          enableLabel={false}
          role="application"
          ariaLabel="A bar chart showing data"
        />
      </div>
    );
  }

const EnergyConsumed = () => {
    return(
        <Card>
              <CardHeader>
                <CardDescription>Total de energia consumida</CardDescription>
                <CardTitle>12,345 kWh</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart data={[]} />
              </CardContent>
            </Card>
    )
}

export default EnergyConsumed
