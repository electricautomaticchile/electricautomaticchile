"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Card, CardHeader, CardDescription, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { ResponsiveLine } from "@nivo/line"
import { ResponsiveBar } from "@nivo/bar"
import Image from "next/image"
import { Settings } from 'lucide-react';
import { Search } from 'lucide-react';
import { Package2 } from 'lucide-react';
import { Map } from 'lucide-react';
import { Home } from 'lucide-react';
import { DollarSign } from 'lucide-react';
import { CircleAlert } from 'lucide-react';
import { Check } from 'lucide-react';
import { Bolt } from 'lucide-react';
import { Bell } from 'lucide-react';



export default function Component() {
  return (
    <div className="grid min-h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link href="#" className="flex items-center gap-2 font-semibold" prefetch={false}>
              <Package2 className="h-6 w-6" />
              <span className="">Dashboard</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only"></span>
            </Button>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg  px-3 py-2 text-primary  transition-all hover:text-primary"
                prefetch={false}
              >
                <Home className="h-4 w-4" />
                Inicio
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2  transition-all hover:text-primary"
                prefetch={false}
              >
                <Bolt className="h-4 w-4" />
                Control de consumo
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2  transition-all hover:text-primary"
                prefetch={false}
              >
                <DollarSign className="h-4 w-4" />
                Pagos
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2  transition-all hover:text-primary"
                prefetch={false}
              >
                <Map className="h-4 w-4" />
                Sectores sin energia
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
                prefetch={false}
              >
                <Settings className="h-4 w-4" />
                Configuración
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b  px-6">
          <Link href="#" className="lg:hidden" prefetch={false}>
            <Package2 className="h-6 w-6" />
            <span className="sr-only">Inicio</span>
          </Link>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search"
                  className="w-full shadow-none appearance-none pl-8 md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full border w-8 h-8">
                <Image src="/placeholder.svg" width="32" height="32" className="rounded-full" alt="Avatar" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Configuración</DropdownMenuItem>
              <DropdownMenuItem>Soporte</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Cerrar Sesion</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Card>
              <CardHeader>
                <CardDescription>Energia usada en el mes</CardDescription>
                <CardTitle>2,345 kWh</CardTitle>
              </CardHeader>
              <CardContent>
              <LineChart data={[]} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Reposicion automatica</CardDescription>
                <CardTitle>Activada</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <p>Your account is set to automatically top-up when your balance is low.</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Total de energia consumida</CardDescription>
                <CardTitle>12,345 kWh</CardTitle>
              </CardHeader>
              <CardContent>
              <BarChart data={[]} /> 
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Total de energia usada en los 3 meses</CardDescription>
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <div>3,456 kWh</div>
                    <div className=" text-sm">
                      <span className="text-primary">+12%</span> Dentro del ultimo mes
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
              <LineChart data={[]}  />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Card>
              <CardHeader>
                <CardDescription>Ultimos pagos</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Monto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>June 15, 2023</TableCell>
                      <TableCell>$125.00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>May 12, 2023</TableCell>
                      <TableCell>$150.00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>April 10, 2023</TableCell>
                      <TableCell>$100.00</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Consumo por horas</CardDescription>
              </CardHeader>
              <CardContent>
              <LineChart data={[]}  />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Sectores sin energia</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <CircleAlert className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-medium">Sector A</p>
                      <p className="text-sm ">Tiempo estimado de Reposición: 2 hours</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CircleAlert className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-medium">Sector B</p>
                      <p className="text-sm ">Tiempo estimado de Reposición: 1 hour</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}



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
  )
}
function LineChart(props: ChartProps) {
  return (
    <div className="aspect-[4/3]"  {...props}>
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
  )
}