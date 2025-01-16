import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const hourlyData = [
  { hour: "00:00", restauraciones: 5, cortes: 2 },
  { hour: "02:00", restauraciones: 3, cortes: 1 },
  { hour: "04:00", restauraciones: 2, cortes: 3 },
  { hour: "06:00", restauraciones: 6, cortes: 2 },
  { hour: "08:00", restauraciones: 8, cortes: 4 },
  { hour: "10:00", restauraciones: 10, cortes: 3 },
  { hour: "12:00", restauraciones: 7, cortes: 5 },
  { hour: "14:00", restauraciones: 9, cortes: 2 },
  { hour: "16:00", restauraciones: 12, cortes: 3 },
  { hour: "18:00", restauraciones: 8, cortes: 4 },
  { hour: "20:00", restauraciones: 6, cortes: 2 },
  { hour: "22:00", restauraciones: 4, cortes: 1 },
]

export function HourlyChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Restauraciones y Cortes por Hora</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData}>
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar name="Restauraciones" dataKey="restauraciones" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar name="Cortes" dataKey="cortes" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

