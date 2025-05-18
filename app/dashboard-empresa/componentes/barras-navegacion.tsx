"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Users, 
  Home, 
  BarChart2, 
  Battery, 
  BellRing, 
  Lightbulb, 
  Search, 
  MessageSquare, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Menu, 
  X,
  CircleUserRound,
  Building
} from 'lucide-react';

interface BarrasNavegacionProps {
  titulo?: string;
  nombreEmpresa?: string;
  rol?: string;
}

export function BarrasNavegacion({ 
  titulo = "Dashboard Empresa", 
  nombreEmpresa = "Constructora Santiago S.A.", 
  rol = "Administrador" 
}: BarrasNavegacionProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  return (
    <>
      {/* Sidebar (navegación lateral) */}
      <div className="fixed left-0 top-0 bottom-0 w-16 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-gray-800 flex flex-col items-center py-4 z-30">
        <div className="flex-1 flex flex-col gap-4 pt-8">
          <div className="flex justify-center items-center w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600">
            <Building className="h-5 w-5" />
          </div>
          <div className="w-full border-t border-gray-200 dark:border-gray-800 pt-4 flex flex-col items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <a href="#dashboard">
                <Home className="h-5 w-5" />
              </a>
            </Button>
            
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <a href="#clientes">
                <Users className="h-5 w-5" />
              </a>
            </Button>
            
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <a href="#estadisticas">
                <BarChart2 className="h-5 w-5" />
              </a>
            </Button>
            
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <a href="#dispositivos">
                <Battery className="h-5 w-5" />
              </a>
            </Button>
            
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <a href="#alertas">
                <BellRing className="h-5 w-5" />
              </a>
            </Button>
            
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <a href="#consumo">
                <Lightbulb className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full text-red-600">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Header (barra superior) */}
      <div className="fixed top-0 left-16 right-0 h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 z-20">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setShowMobileMenu(!showMobileMenu)}>
            {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <h1 className="text-xl font-bold">{titulo}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative rounded-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Buscar..."
              className="w-64 pl-9"
            />
          </div>
          
          <Button variant="ghost" size="icon" className="relative">
            <BellRing className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
          </Button>
          
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" alt={nombreEmpresa} />
                  <AvatarFallback className="bg-orange-100 text-orange-600">
                    <CircleUserRound className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium truncate max-w-[140px]">{nombreEmpresa}</div>
                  <div className="text-xs text-gray-500">{rol}</div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <CircleUserRound className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Mensajes</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Menú móvil */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setShowMobileMenu(false)}>
          <div 
            className="absolute top-16 left-0 w-64 bottom-0 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-gray-800 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Buscar..."
                  className="w-full pl-9"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#dashboard">
                  <Home className="h-5 w-5 mr-3" />
                  Dashboard
                </a>
              </Button>
              
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#clientes">
                  <Users className="h-5 w-5 mr-3" />
                  Clientes
                </a>
              </Button>
              
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#estadisticas">
                  <BarChart2 className="h-5 w-5 mr-3" />
                  Estadísticas
                </a>
              </Button>
              
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#dispositivos">
                  <Battery className="h-5 w-5 mr-3" />
                  Dispositivos
                </a>
              </Button>
              
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#alertas">
                  <BellRing className="h-5 w-5 mr-3" />
                  Alertas
                </a>
              </Button>
              
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#consumo">
                  <Lightbulb className="h-5 w-5 mr-3" />
                  Consumo
                </a>
              </Button>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4 pt-4 border-t border-gray-200 dark:border-gray-800">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="h-5 w-5 mr-3" />
                Configuración
              </Button>
              
              <Button variant="ghost" className="w-full justify-start text-red-600">
                <LogOut className="h-5 w-5 mr-3" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 