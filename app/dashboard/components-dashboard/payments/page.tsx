'use client'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { format } from 'date-fns'
import dynamic from 'next/dynamic'
import { es } from 'date-fns/locale'
const PDFDownloadButton = dynamic(() => import('../payments/pdfgenerator'), { ssr: false })

// Sample data
const paymentData = [
  { date: new Date('2023-06-15T00:00:00'), amount: 80000.00, consumption: 500, watts: 2000 },
  { date: new Date('2023-05-12T00:00:00'), amount: 70000.00, consumption: 600, watts: 2400 },
  { date: new Date('2023-04-10T00:00:00'), amount: 15000.00, consumption: 400, watts: 1600 },
]



const Payments = () => {
  // Define accountDetails, meterReadings y monthlyConsumption aquí
  const accountDetails = {
    electricityConsumption: 100,
    administrationService: 10,
    coordination: 5,
    agreement: 0,
    delayInterest: 0,
    commonService: 2,
    previousBalance: 0,
    total: 117,
  };

  const meterReadings = {
    current: 150,
    previous: 100,
    consumption: 50,
    meterNumber: "12345",
  };

  const monthlyConsumption = [100, 120, 130, 110, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Pagos</CardTitle>
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
            {paymentData.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{format(row.date, 'PPP', { locale: es })}</TableCell>
                <TableCell>${row.amount.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</TableCell>
                <TableCell>
                   <PDFDownloadButton 
                     paymentData={[row]} 
                     accountDetails={accountDetails}
                     meterReadings={meterReadings}
                     monthlyConsumption={monthlyConsumption}
                   />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default Payments

