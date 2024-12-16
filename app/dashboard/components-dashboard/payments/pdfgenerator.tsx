'use client'
import React from 'react'
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Button } from "@/components/ui/button"

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: 'auto',
    marginTop: 5,
    fontSize: 10,
  },
})

// Define la interfaz para los datos de pago
interface PaymentData {
  date: Date;
  amount: number;
  consumption: number;
  watts: number;
}

// Define el tipo para las props de MyDocument
interface MyDocumentProps {
  paymentData: PaymentData[];
}

// PDF Document component
const MyDocument: React.FC<MyDocumentProps> = ({ paymentData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Informe de Consumo de Electricidad</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Fecha</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Monto</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Consumo(kWh)</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Watts</Text>
            </View>
          </View>
          {paymentData.map((row: PaymentData, i) => (
            <View style={styles.tableRow} key={i}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{format(row.date, 'PPP', { locale: es })}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>${row.amount.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{row.consumption}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{row.watts}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
)

// Define el tipo para las props de PDFDownloadButton
interface PDFDownloadButtonProps {
  paymentData: PaymentData[];
}

// PDF Download Button component
const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({ paymentData }) => {
  const fechaActual = new Date().toISOString().split('T')[0];
  return (
    <PDFDownloadLink document={<MyDocument paymentData={paymentData} />} fileName={`Reporte de consumo ${fechaActual}.pdf`}>
        <Button >
        Descargar reporte
        </Button>
    </PDFDownloadLink>
  );
}

export default PDFDownloadButton

