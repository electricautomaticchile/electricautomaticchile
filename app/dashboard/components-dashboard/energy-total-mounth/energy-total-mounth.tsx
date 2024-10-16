import {Card,CardHeader,CardDescription,CardTitle,CardContent} from "@/components/ui/card";
import { ResponsiveLine } from "@nivo/line";


interface ChartProps {
    data: any[];
  }

function LineChart(props: ChartProps) {
    return (
      <div className="aspect-[4/3]" {...props}>
        <ResponsiveLine
          data={[
            {
              id: "Desktop",
              data: [
                { x: "Jan", y: 43 },
                { x: "Feb", y: 137 },
                { x: "Mar", y: 61 },
                { x: "Apr", y: 145 },
                { x: "May", y: 26 },
                { x: "Jun", y: 154 },
              ],
            },
            {
              id: "Mobile",
              data: [
                { x: "Jan", y: 60 },
                { x: "Feb", y: 48 },
                { x: "Mar", y: 177 },
                { x: "Apr", y: 78 },
                { x: "May", y: 96 },
                { x: "Jun", y: 204 },
              ],
            },
          ]}
          margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
          xScale={{
            type: "point",
          }}
          yScale={{
            type: "linear",
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 0,
            tickPadding: 16,
          }}
          axisLeft={{
            tickSize: 0,
            tickValues: 5,
            tickPadding: 16,
          }}
          colors={["#2563eb", "#e11d48"]}
          pointSize={6}
          useMesh={true}
          gridYValues={6}
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
          role="application"
        />
      </div>
    );
  }
  




const EnergyMounth3 = () => {
    return(
        <Card>
        <CardHeader>
          <CardDescription>
            Total de energia usada en los 3 meses
          </CardDescription>
          <CardTitle>
            <div className="flex items-center gap-2">
              <div>3,456 kWh</div>
              <div className=" text-sm">
                <span className="text-primary">+12%</span> Dentro del
                ultimo mes
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart data={[]} />
        </CardContent>
      </Card>
    )
}

export default EnergyMounth3