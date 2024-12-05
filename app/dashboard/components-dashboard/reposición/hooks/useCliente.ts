import { useState } from 'react'

interface Cliente {
  id: string
  nombre: string
  direccion: string
  deuda: number
  diasAtraso: number
  deudaRegularizada: boolean
}

const clientesData: Cliente[] = [
  {
    id: "00001",
    nombre: "Juan Pérez",
    direccion: "Calle Principal 123",
    deuda: 150.50,
    diasAtraso: 30,
    deudaRegularizada: false
  },
  {
    id: "00002",
    nombre: "María González",
    direccion: "Avenida Central 456",
    deuda: 0,
    diasAtraso: 0,
    deudaRegularizada: true
  }
]

export function useCliente() {
  const [numeroCliente, setNumeroCliente] = useState('')
  const [cliente, setCliente] = useState<Cliente | null>(null)

  const buscarCliente = () => {
    const clienteEncontrado = clientesData.find(c => c.id === numeroCliente)
    setCliente(clienteEncontrado || null)
  }

  return { numeroCliente, setNumeroCliente, cliente, buscarCliente }
}

