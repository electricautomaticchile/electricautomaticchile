import React, { useState, useRef } from 'react';
import useDocumentos, { TipoDocumento, EntidadRelacionada } from '../hooks/useDocumentos';

interface DocumentoUploaderProps {
  tipoDocumento: TipoDocumento;
  entidadRelacionada: EntidadRelacionada;
  referenciaId: string;
  entidadModelo: string;
  onUploadComplete?: (documento: any) => void;
  onError?: (error: string) => void;
  esPublico?: boolean;
  className?: string;
  buttonText?: string;
  acceptedFiles?: string;
  maxSizeMB?: number;
  showPreview?: boolean;
  isPublicForm?: boolean;
}

/**
 * Componente para subir documentos a S3
 */
const DocumentoUploader: React.FC<DocumentoUploaderProps> = ({
  tipoDocumento,
  entidadRelacionada,
  referenciaId,
  entidadModelo,
  onUploadComplete,
  onError,
  esPublico = false,
  className = '',
  buttonText = 'Subir documento',
  acceptedFiles = 'image/*,application/pdf,.doc,.docx,.xls,.xlsx',
  maxSizeMB = 10,
  showPreview = true,
  isPublicForm = false
}) => {
  const { subirDocumento, progreso, estadoSubida, error, reiniciarEstadoSubida } = useDocumentos();
  const [archivo, setArchivo] = useState<File | null>(null);
  const [vistaPrevia, setVistaPrevia] = useState<string | null>(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manejar selección de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Verificar tamaño máximo
      if (file.size > maxSizeMB * 1024 * 1024) {
        if (onError) {
          onError(`El archivo excede el tamaño máximo permitido de ${maxSizeMB}MB`);
        }
        return;
      }
      
      setArchivo(file);
      setNombre(file.name);
      
      // Generar vista previa para imágenes
      if (file.type.startsWith('image/') && showPreview) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setVistaPrevia(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      } else {
        setVistaPrevia(null);
      }
      
      // Reiniciar estado de subida
      reiniciarEstadoSubida();
    }
  };

  // Manejar envío de formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!archivo) {
      if (onError) {
        onError('Por favor seleccione un archivo para subir');
      }
      return;
    }
    
    try {
      // Crear opciones para la subida
      const opcionesSubida = {
        archivo,
        tipoDocumento,
        entidadRelacionada,
        referenciaId,
        entidadModelo,
        nombre: nombre || archivo.name,
        descripcion: descripcion || undefined,
        esPublico,
      };
      
      // Si es un formulario público, añadir una cabecera especial
      const headers = isPublicForm ? 
        { 'X-Form-Type': 'contacto' } : 
        undefined;
      
      const resultado = await subirDocumento(opcionesSubida, headers);
      
      // Limpiar formulario
      setArchivo(null);
      setVistaPrevia(null);
      setNombre('');
      setDescripcion('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Notificar al componente padre
      if (onUploadComplete) {
        onUploadComplete(resultado);
      }
    } catch (err) {
      console.error('Error al subir documento:', err);
      // El error ya se maneja en el hook
    }
  };

  // Seleccionar archivo manualmente
  const handleSelectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`documento-uploader ${className}`}>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept={acceptedFiles}
        />
        
        {archivo ? (
          <div className="documento-seleccionado">
            {vistaPrevia && (
              <div className="vista-previa">
                <img src={vistaPrevia} alt="Vista previa" style={{ maxHeight: '150px', maxWidth: '100%' }} />
              </div>
            )}
            
            <div className="detalles-archivo">
              <h4>{archivo.name}</h4>
              <p>Tipo: {archivo.type || 'Desconocido'}</p>
              <p>Tamaño: {(archivo.size / 1024 / 1024).toFixed(2)}MB</p>
            </div>
            
            <div className="campos-adicionales">
              <div className="campo">
                <label htmlFor="nombre">Nombre del documento:</label>
                <input
                  type="text"
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre personalizado (opcional)"
                  className="form-input"
                />
              </div>
              
              <div className="campo">
                <label htmlFor="descripcion">Descripción:</label>
                <textarea
                  id="descripcion"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Descripción del documento (opcional)"
                  className="form-textarea"
                  rows={3}
                />
              </div>
            </div>
            
            {estadoSubida === 'subiendo' ? (
              <div className="progreso">
                <div className="barra-progreso">
                  <div
                    className="progreso-completado"
                    style={{ width: `${progreso}%` }}
                  ></div>
                </div>
                <span>{progreso}%</span>
              </div>
            ) : (
              <div className="acciones">
                <button
                  type="submit"
                  className="btn-subir"
                  disabled={estadoSubida === 'subiendo'}
                >
                  {estadoSubida === 'subiendo' ? 'Subiendo...' : 'Subir'}
                </button>
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => {
                    setArchivo(null);
                    setVistaPrevia(null);
                    setNombre('');
                    setDescripcion('');
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                    reiniciarEstadoSubida();
                  }}
                >
                  Cancelar
                </button>
              </div>
            )}
            
            {error && (
              <div className="mensaje-error">
                {error}
              </div>
            )}
            
            {estadoSubida === 'exito' && (
              <div className="mensaje-exito">
                ¡Documento subido correctamente!
              </div>
            )}
          </div>
        ) : (
          <div className="seleccionar-archivo">
            <button
              type="button"
              onClick={handleSelectFile}
              className="btn-seleccionar"
            >
              {buttonText}
            </button>
            <p className="hint">
              Formatos aceptados: {acceptedFiles.split(',').join(', ')}
            </p>
            <p className="hint">
              Tamaño máximo: {maxSizeMB}MB
            </p>
          </div>
        )}
      </form>
      
      <style jsx>{`
        .documento-uploader {
          padding: 1rem;
          border: 1px solid #e0e0e0;
          border-radius: 0.5rem;
          background-color: #f9f9f9;
          max-width: 500px;
        }
        
        .hidden {
          display: none;
        }
        
        .documento-seleccionado {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .vista-previa {
          display: flex;
          justify-content: center;
          border: 1px solid #ddd;
          padding: 0.5rem;
          background-color: white;
          border-radius: 0.25rem;
        }
        
        .detalles-archivo {
          margin-bottom: 1rem;
        }
        
        .detalles-archivo h4 {
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
          word-break: break-all;
        }
        
        .detalles-archivo p {
          margin: 0.25rem 0;
          font-size: 0.875rem;
          color: #555;
        }
        
        .campos-adicionales {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .campo label {
          display: block;
          margin-bottom: 0.25rem;
          font-size: 0.875rem;
          color: #333;
        }
        
        .form-input, .form-textarea {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 0.25rem;
          font-size: 0.875rem;
        }
        
        .form-textarea {
          resize: vertical;
        }
        
        .progreso {
          margin: 1rem 0;
        }
        
        .barra-progreso {
          height: 0.5rem;
          background-color: #eee;
          border-radius: 1rem;
          overflow: hidden;
          margin-bottom: 0.25rem;
        }
        
        .progreso-completado {
          height: 100%;
          background-color: #4caf50;
          transition: width 0.3s ease;
        }
        
        .acciones {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        
        .btn-subir, .btn-cancelar, .btn-seleccionar {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 0.25rem;
          cursor: pointer;
          font-size: 0.875rem;
          transition: background-color 0.2s;
        }
        
        .btn-subir {
          background-color: #4caf50;
          color: white;
        }
        
        .btn-subir:hover {
          background-color: #45a049;
        }
        
        .btn-cancelar {
          background-color: #f44336;
          color: white;
        }
        
        .btn-cancelar:hover {
          background-color: #d32f2f;
        }
        
        .btn-seleccionar {
          background-color: #2196f3;
          color: white;
          padding: 0.75rem 1.25rem;
          font-size: 1rem;
        }
        
        .btn-seleccionar:hover {
          background-color: #0b7dda;
        }
        
        .seleccionar-archivo {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 2rem 1rem;
          border: 2px dashed #ccc;
          border-radius: 0.5rem;
          background-color: rgba(0, 0, 0, 0.01);
        }
        
        .hint {
          margin: 0.25rem 0 0 0;
          font-size: 0.75rem;
          color: #666;
        }
        
        .mensaje-error {
          padding: 0.75rem;
          background-color: #ffebee;
          color: #d32f2f;
          border-radius: 0.25rem;
          font-size: 0.875rem;
        }
        
        .mensaje-exito {
          padding: 0.75rem;
          background-color: #e8f5e9;
          color: #388e3c;
          border-radius: 0.25rem;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
};

export default DocumentoUploader; 