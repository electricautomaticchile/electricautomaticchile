"use client"
import { useState, useEffect, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { EstadoLED, HistorialCambio } from '@/lib/constants';
import { Button } from '@/components/ui/button';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


export default function Arduino() {
  const [ledEstado, setLedEstado] = useState<boolean>(false);
  const [conexionEstado, setConexionEstado] = useState<boolean>(false);
  const [historial, setHistorial] = useState<HistorialCambio[]>([]);
  const [modo, setModo] = useState<'manual' | 'temporizador' | 'secuencia'>('manual');
  const [tiempoTemporizador, setTiempoTemporizador] = useState<number>(5);
  const [temporizadorActivo, setTemporizadorActivo] = useState<boolean>(false);
  const [PDFDownloadLinkComponent, setPDFDownloadLinkComponent] = useState<JSX.Element | null>(null);

  const toggleLED = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/led/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ modo }),
      });
      const data = await response.json();
      setLedEstado(data.estado);
      
      // Actualizar historial
      const nuevoCambio = {
        estado: data.estado,
        timestamp: new Date().toISOString(),
        modo
      };
      setHistorial(prev => [...prev, nuevoCambio]);

      // Enviar datos a la base de datos
      await fetch('http://localhost:5000/api/historial', { // Cambia la URL según tu API
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoCambio),
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }, [modo]);

  // Verificar conexión
  useEffect(() => {
    const verificarConexion = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/estado');
        setConexionEstado(response.ok);
      } catch {
        setConexionEstado(false);
      }
    };

    verificarConexion();
    const interval = setInterval(verificarConexion, 5000);
    return () => clearInterval(interval);
  }, []);

  // Manejar temporizador
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (temporizadorActivo && modo === 'temporizador') {
      interval = setInterval(() => {
        toggleLED();
      }, tiempoTemporizador * 1000);
    }
    return () => clearInterval(interval);
  }, [temporizadorActivo, tiempoTemporizador, modo, toggleLED]);

  // Conectar a la base de datos al iniciar el componente

  const datosGrafico = {
    labels: historial.slice(-10).map(h => new Date(h.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Estado LED',
        data: historial.slice(-10).map(h => h.estado ? 1 : 0),
        borderColor: 'rgb(234, 88, 12)', // Color naranja
        tension: 0.7
      }
    ]
  };
 

  // Definir la función cargarPDF
  const cargarPDF = useCallback(async () => {
    const { PDFDownloadLink, Document, Page, Text, View, Image } = await import('@react-pdf/renderer');
    return { PDFDownloadLink, Document, Page, Text, View ,Image };
  }, []);

  // Llamar a la función asincrónica en un useEffect
  useEffect(() => {
    const obtenerPDF = async () => {
      const { PDFDownloadLink, Document, Page, Text, View , Image } = await cargarPDF();
      
      const MyDocument: React.FC<MyDocumentProps> = ({ historial }) => (
        <Document>
          <Page size="A4" style={{ padding: 0 }}>
            <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: 20, backgroundColor: '#000' }}>
              <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 10, color: '#FFA500', textAlign: 'center' }}>Historial de Cambios</Text>
              {historial.length > 0 ? (
                <View style={{ border: '2px solid #FFA500', width: '100%', padding: 10, borderRadius: 5 }}>
                  {historial.map((cambio, index) => (
                    <View key={index} style={{ borderBottom: '1px solid #FFF', padding: 5, backgroundColor: index % 2 === 0 ? '#1a1a1a' : '#333' }}>
                      <Text style={{ fontSize: 16, color: '#FFF' }}>
                        {`${index + 1}. ${new Date(cambio.timestamp).toLocaleString()} - LED ${cambio.estado ? 'Encendido' : 'Apagado'} - Modo: ${cambio.modo}`}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={{ fontSize: 16, color: '#FFA500' }}>No hay cambios registrados.</Text>
              )}
            </View>
          </Page>
        </Document>
      );

      // Almacenar el componente PDFDownloadLink en el estado
      setPDFDownloadLinkComponent(
        <PDFDownloadLink document={<MyDocument historial={historial} />} fileName="historial_cambios.pdf">
          <Button>Descargar Historial</Button>
        </PDFDownloadLink>
      );
    };
    
    obtenerPDF();
  }, [cargarPDF, historial]);

  interface MyDocumentProps {
    historial: HistorialCambio[]; // Define el tipo de historial
  }
  
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8 ">
        {/* Estado de Conexión */}
        <div className=" p-4 rounded-lg shadow-md hover:shadow-orange-500 hover:border-orange-500 border">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${conexionEstado ? 'bg-green-500' : 'bg-red-500'}`} />
            <span>{conexionEstado ? 'Conectado' : 'Desconectado'}</span>
          </div>
        </div>

        {/* Control Principal */}
        <div className=" p-6 rounded-lg shadow-md hover:shadow-orange-500 hover:border-orange-500 border">
          <h2 className="text-xl font-bold mb-4">Control LED</h2>
          <div className="flex items-center space-x-4">
            <div className={`w-20 h-20 rounded-full ${ledEstado ? 'bg-orange-600' : 'bg-gray-600'}`} />
            <div className="space-y-4">
              <select 
                className="border rounded text-black  p-2"
                value={modo}
                onChange={(e) => setModo(e.target.value as any)}
              >
                <option value="manual">Manual</option>
                <option value="temporizador">Temporizador</option>
                <option value="secuencia">Secuencia</option>
              </select>

              {modo === 'temporizador' && (
                <div className="space-y-2">
                  <input 
                    type="number"
                    value={tiempoTemporizador}
                    onChange={(e) => setTiempoTemporizador(Number(e.target.value))}
                    className="border rounded p-2 text-black"
                    min="1"
                  />
                  <button
                    onClick={() => setTemporizadorActivo(!temporizadorActivo)}
                    className="px-4 py-2 rounded bg-orange-600"
                  >
                    {temporizadorActivo ? 'Detener' : 'Iniciar'} Temporizador
                  </button>
                </div>
              )}

              <button
                onClick={toggleLED}
                className="px-4 py-2  rounded bg-orange-600"
                disabled={modo === 'temporizador' && temporizadorActivo}
              >
                {ledEstado ? 'Encender LED' : 'Apagar LED'}
              </button>
            </div>
          </div>
        </div>

        {/* Historial */}
        <div className="p-6 rounded-lg shadow-md hover:shadow-orange-500 hover:border-orange-500 border">
          <h2 className="text-xl font-bold mb-4">Historial de Cambios</h2>
          <div className="max-h-60 overflow-y-auto">
            {historial.slice().reverse().map((cambio, index) => (
              <div key={index} className="border-b py-2">
                <p>
                  {new Date(cambio.timestamp).toLocaleString()} - 
                  LED {cambio.estado ? 'Encendido' : 'Apagado'} - 
                  Modo: {cambio.modo}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico */}
        <div className=" p-6 rounded-lg shadow-md hover:shadow-orange-500 hover:border-orange-500 border mb-4">
          <h2 className="text-xl font-bold mb-4">Gráfico de Actividad</h2>
          <Line data={datosGrafico} />
        </div>

        {/* Mostrar el botón de descargar historial */}
        <div className="mt-4">
          {PDFDownloadLinkComponent}
        </div>
      </div>
    </div>
  );
}