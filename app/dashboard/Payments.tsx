import {Card,CardHeader,CardDescription,CardTitle,CardContent} from "@/components/ui/card";
import {Table,TableHeader,TableRow,TableHead,TableBody,TableCell} from "@/components/ui/table";

const Payments = () => {
    return(
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
    )
}

export default Payments