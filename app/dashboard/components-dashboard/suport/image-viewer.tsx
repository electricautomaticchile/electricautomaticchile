'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ImageViewerProps {
  file: File
}

export default function ImageViewer({ file }: ImageViewerProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null)

  const handleViewImage = () => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setImageSrc(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="text-xs p-0 h-auto" onClick={handleViewImage}>
          Ver imagen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        {imageSrc && (
          <div className="relative w-full h-64">
            <Image
              src={imageSrc}
              alt={file.name}
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

