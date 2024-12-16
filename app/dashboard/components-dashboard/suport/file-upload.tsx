'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface FileUploadProps {
  onFileUpload: (files: File[]) => void
}

export default function FileUpload({ onFileUpload }: FileUploadProps) {
  const [fileNames, setFileNames] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setFileNames(filesArray.map(file => file.name))
      onFileUpload(filesArray)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-2">
      <Input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
      />
      <Button type="button" onClick={handleClick} variant="outline">
        Adjuntar archivos
      </Button>
      {fileNames.length > 0 && (
        <ul className="text-sm text-gray-600">
          {fileNames.map((name, index) => (
            <li key={index}>{name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

