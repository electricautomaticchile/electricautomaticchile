import type { NextApiRequest, NextApiResponse } from 'next'
import mongoose from 'mongoose'

// Conectar a la base de datos de MongoDB
const conectarDB = async () => {
    if (mongoose.connection.readyState >= 1) return
    await mongoose.connect(process.env.MONGODB_URI2 || '', {
    })
}

// Definir el esquema y modelo de Mongoose
const formularioSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    file: File, // Puedes ajustar esto según cómo manejes los archivos
})

const Formulario = mongoose.models.formulario || mongoose.model('Formulario', formularioSchema)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        await conectarDB()

        const { name, email, message, file } = req.body

        const nuevoFormulario = new Formulario({ name, email, message, file })
        await nuevoFormulario.save()

        res.status(201).json({ message: 'Formulario enviado con éxito' })
    } else {
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Método ${req.method} no permitido`)
    }
} 