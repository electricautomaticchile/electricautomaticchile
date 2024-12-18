'use client'
import React from 'react'
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image, Font } from '@react-pdf/renderer'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Button } from "@/components/ui/button"

// Registrar una fuente de respaldo
Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
})

// Definir estilos para PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
    padding: 30,
    fontFamily: "Roboto",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: "bold",
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
    borderBottomWidth: 1,
    borderBottomColor: "#bfbfbf",
    minHeight: 25,
    alignItems: "center",
  },
  tableColHeader: {
    width: "25%",
    padding: 5,
    backgroundColor: "#f0f0f0",
  },
  tableCol: {
    width: "25%",
    padding: 5,
  },
  tableCell: {
    margin: 'auto',
    marginTop: 5,
    fontSize: 10,
  },
  barChart: {
    height: 150,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  bar: {
    width: 20,
    backgroundColor: "#666",
    position: "absolute",
    bottom: 0,
  },
  text: {
    fontSize: 10,
  },
  textBold: {
    fontSize: 10,
    fontWeight: "bold",
  },
})

// Definir la interfaz para los datos de pago
interface PaymentData {
  date: Date;
  amount: number;
  consumption: number;
  watts: number;
}

// Definir el tipo para las props de MyDocument
interface MyDocumentProps {
  paymentData: PaymentData[];
  accountDetails: {
    electricityConsumption: number;
    administrationService: number;
    coordination: number;
    agreement: number;
    delayInterest: number;
    commonService: number;
    previousBalance: number;
    total: number;
  };
  meterReadings: {
    current: number;
    previous: number;
    consumption: number;
    meterNumber: string;
  };
  monthlyConsumption: number[];
}

// Componente del documento PDF
const MyDocument: React.FC<MyDocumentProps> = ({ paymentData, accountDetails, meterReadings, monthlyConsumption }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Detalle de la cuenta */}
      <View style={styles.section}>
        <Text style={styles.title}>Detalle de mi cuenta</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCell}>Servicio eléctrico (implica corte)</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>${accountDetails.electricityConsumption}</Text>
            </View>
          </View>
          {/* Agregar más filas para otros cargos */}
        </View>
      </View>

      {/* Informe de Consumo de Electricidad */}
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
            <View style={styles.tableCol}></View>
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
    

      {/* Gráfico de Consumo */}
      <View style={styles.section}>
        <Text style={styles.title}>¿Cuál fue mi consumo en los últimos 13 meses?</Text>
        <View style={styles.barChart}>
          {monthlyConsumption.map((value, index) => (
            <View
              key={index}
              style={{
                ...styles.bar,
                height: `${(value / Math.max(...monthlyConsumption)) * 100}%`,
                left: index * 30,
              }}
            />
          ))}
        </View>
      </View>

      {/* Sección Comparativa */}
      <View style={styles.section}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ width: "45%" }}>
            <Text style={styles.textBold}>Mismo mes del año pasado</Text>
            <Text style={styles.text}>{monthlyConsumption[12]} kWh</Text>
          </View>
          <View style={{ width: "45%" }}>
            <Text style={styles.textBold}>Mes pasado</Text>
            <Text style={styles.text}>{monthlyConsumption[11]} kWh</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
)

// Definir el tipo para las props de PDFDownloadButton
interface PDFDownloadButtonProps {
  paymentData: PaymentData[];
  accountDetails: {
    electricityConsumption: number;
    administrationService: number;
    coordination: number;
    agreement: number;
    delayInterest: number;
    commonService: number;
    previousBalance: number;
    total: number;
  };
  meterReadings: {
    current: number;
    previous: number;
    consumption: number;
    meterNumber: string;
  };
  monthlyConsumption: number[];
}

// Componente del botón de descarga de PDF
const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({ paymentData, accountDetails, meterReadings, monthlyConsumption }) => {
  const fechaActual = new Date().toISOString().split('T')[0];
  return (
    <PDFDownloadLink document={<MyDocument paymentData={paymentData} accountDetails={accountDetails} meterReadings={meterReadings} monthlyConsumption={monthlyConsumption} />} fileName={`Reporte de consumo ${fechaActual}.pdf`}>
      <Button>
        Descargar reporte
      </Button>
    </PDFDownloadLink>
  );
}

export default PDFDownloadButton

