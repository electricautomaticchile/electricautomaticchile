'use client'
import { Card, CardHeader, CardDescription, CardTitle, CardContent } from "@/components/ui/card"
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

export type PaymentsProps = {
  showDownload: boolean;
};

const Payments = ({ showDownload }: PaymentsProps) => {
  // Removed isClient state and related logic

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
                  {showDownload && <PDFDownloadButton paymentData={[row]} />}
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

