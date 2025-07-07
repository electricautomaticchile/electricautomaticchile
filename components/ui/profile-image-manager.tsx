"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import ImagenPerfilService from "@/lib/api/services/imagenPerfilService";
import {
  Upload,
  Camera,
  X,
  Edit2,
  Trash2,
  Check,
  ImageIcon,
  Loader2,
} from "lucide-react";
import Image from "next/image";

interface ProfileImageManagerProps {
  userId: string;
  tipoUsuario: "usuario" | "empresa" | "cliente" | "superadmin";
  currentImageUrl?: string;
  userName?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showEditButton?: boolean;
  showUploadArea?: boolean;
  onImageUpdate?: (imageUrl: string) => void;
  className?: string;
}

export function ProfileImageManager({
  userId,
  tipoUsuario,
  currentImageUrl,
  userName = "Usuario",
  size = "md",
  showEditButton = true,
  showUploadArea = false,
  onImageUpdate,
  className,
}: ProfileImageManagerProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(
    currentImageUrl || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Configuración de tamaños
  const sizeConfig = {
    sm: { avatar: "h-8 w-8", upload: "h-24 w-24", text: "text-xs" },
    md: { avatar: "h-10 w-10", upload: "h-32 w-32", text: "text-sm" },
    lg: { avatar: "h-14 w-14", upload: "h-40 w-40", text: "text-base" },
    xl: { avatar: "h-20 w-20", upload: "h-56 w-56", text: "text-lg" },
  };

  const currentSize = sizeConfig[size];

  // Cargar imagen actual al montar el componente
  useEffect(() => {
    if (!currentImageUrl) {
      loadCurrentImage();
    }
  }, [userId, tipoUsuario, currentImageUrl]);

  // Limpiar URLs de preview al desmontar
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const loadCurrentImage = async () => {
    if (!userId || !tipoUsuario) return;

    setIsLoading(true);
    try {
      const result = await ImagenPerfilService.getProfileImage(
        tipoUsuario,
        userId
      );
      if (result.success && result.data?.imagenPerfil) {
        setImageUrl(result.data.imagenPerfil);
      }
    } catch (error) {
      console.error("Error al cargar imagen:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (file: File) => {
    // Validar archivo
    const validation = ImagenPerfilService.validateImageFile(file);
    if (!validation.isValid) {
      toast({
        title: "Error de validación",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);

    // Crear preview
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    const newPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(newPreviewUrl);

    if (showUploadArea) {
      // Auto-upload si estamos en modo área de subida
      uploadImage(file);
    }
  };

  const uploadImage = async (file: File) => {
    if (!file || !userId || !tipoUsuario) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simular progreso
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const result = await ImagenPerfilService.uploadAndUpdateProfileImage(
        file,
        tipoUsuario,
        userId
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success && result.data?.imageUrl) {
        setImageUrl(result.data.imageUrl);
        onImageUpdate?.(result.data.imageUrl);

        toast({
          title: "¡Éxito!",
          description: "Imagen de perfil actualizada correctamente",
        });

        // Limpiar estado
        setSelectedFile(null);
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
        setIsDialogOpen(false);
      } else {
        throw new Error(result.error || "Error al subir imagen");
      }
    } catch (error: any) {
      console.error("Error al subir imagen:", error);
      toast({
        title: "Error",
        description: error.message || "Error al subir la imagen",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteImage = async () => {
    if (!userId || !tipoUsuario) return;

    setIsLoading(true);
    try {
      const result = await ImagenPerfilService.deleteProfileImage(
        tipoUsuario,
        userId
      );

      if (result.success) {
        setImageUrl(null);
        onImageUpdate?.("");

        toast({
          title: "Imagen eliminada",
          description: "La imagen de perfil ha sido eliminada",
        });

        setIsDialogOpen(false);
      } else {
        throw new Error(result.error || "Error al eliminar imagen");
      }
    } catch (error: any) {
      console.error("Error al eliminar imagen:", error);
      toast({
        title: "Error",
        description: error.message || "Error al eliminar la imagen",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const getCurrentImageUrl = () => {
    return ImagenPerfilService.createImageUrlWithFallback(
      imageUrl,
      tipoUsuario
    );
  };

  const getInitials = () => {
    return userName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Versión simple para mostrar solo la imagen
  if (!showEditButton && !showUploadArea) {
    return (
      <Avatar
        className={cn(
          currentSize.avatar,
          "ring-2 ring-orange-500 hover:ring-4 transition-all duration-200",
          className
        )}
      >
        <Image
          src={getCurrentImageUrl()}
          alt={userName}
          fill
          sizes="64px"
          className="object-cover rounded-full"
        />
        <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-700 text-white">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            getInitials()
          )}
        </AvatarFallback>
      </Avatar>
    );
  }

  // Versión con área de subida
  if (showUploadArea) {
    return (
      <Card className={cn("border-2 border-dashed", className)}>
        <CardContent className="p-6">
          <div
            className={cn(
              "flex flex-col items-center justify-center space-y-4 min-h-[200px] transition-colors",
              isDragging && "bg-blue-50 border-blue-300 dark:bg-blue-900/20"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <Avatar className={cn(currentSize.upload, "mx-auto mb-4")}>
                <Image
                  src={getCurrentImageUrl()}
                  alt={userName}
                  fill
                  sizes="128px"
                  className="object-cover rounded-full"
                />
                <AvatarFallback>
                  {isLoading ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  )}
                </AvatarFallback>
              </Avatar>

              <h3 className="text-lg font-semibold mb-2">Imagen de Perfil</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Arrastra una imagen aquí o haz clic para seleccionar
              </p>

              <div className="flex flex-col items-center space-y-2">
                <Badge variant="secondary" className="text-xs">
                  PNG, JPG, JPEG, WebP (máx. 5MB)
                </Badge>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? "Subiendo..." : "Seleccionar Imagen"}
                </Button>
              </div>
            </div>

            {isUploading && (
              <div className="w-full max-w-xs">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-center mt-2 text-gray-600">
                  {uploadProgress}% completado
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Versión con botón de edición
  return (
    <div className={cn("flex items-center space-x-3", className)}>
      <Avatar
        className={cn(
          currentSize.avatar,
          "ring-2 ring-orange-500 hover:ring-4 transition-all duration-200"
        )}
      >
        <Image
          src={getCurrentImageUrl()}
          alt={userName}
          fill
          sizes="64px"
          className="object-cover rounded-full"
        />
        <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-700 text-white">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            getInitials()
          )}
        </AvatarFallback>
      </Avatar>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Edit2 className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cambiar Imagen de Perfil</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex justify-center">
              <Avatar className="w-24 h-24 relative">
                <Image
                  src={previewUrl || getCurrentImageUrl()}
                  alt={userName}
                  fill
                  sizes="96px"
                  className="object-cover rounded-full"
                />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
            </div>

            <div className="flex justify-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Camera className="w-4 h-4 mr-2" />
                Cambiar
              </Button>

              {(imageUrl || previewUrl) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteImage}
                  disabled={isLoading}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </Button>
              )}
            </div>

            {selectedFile && (
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                    Archivo seleccionado: {selectedFile.name}
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedFile(null);
                      if (previewUrl) {
                        URL.revokeObjectURL(previewUrl);
                        setPreviewUrl(null);
                      }
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => uploadImage(selectedFile)}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4 mr-2" />
                    )}
                    {isUploading ? "Subiendo..." : "Guardar"}
                  </Button>
                </div>
              </div>
            )}

            {isUploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-center text-gray-600">
                  {uploadProgress}% completado
                </p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
            className="hidden"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProfileImageManager;
