# 🚀 Script de Docker para Desarrollo Local - Electric Automatic Chile
# Configuración simplificada para desarrollo local rápido y eficiente

param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

function Write-Info {
    param($Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warn {
    param($Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param($Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Test-Docker {
    Write-Info "Verificando Docker..."
    
    if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Error "Docker no está instalado. Instala Docker Desktop: https://www.docker.com/products/docker-desktop/"
        exit 1
    }
    
    if (!(Get-Command docker-compose -ErrorAction SilentlyContinue)) {
        Write-Error "Docker Compose no está disponible."
        exit 1
    }
    
    Write-Info "Docker está listo"
}

function Start-Development {
    Write-Info "🚀 Iniciando ambiente de desarrollo..."
    
    # Construir y levantar servicios
    docker-compose -f docker-compose.dev.yml up -d --build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "🎉 Ambiente de desarrollo iniciado correctamente!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📱 Tu aplicación está disponible en:" -ForegroundColor Cyan
        Write-Host "   → http://localhost:3000" -ForegroundColor White
        Write-Host ""
        Write-Host "🗄️  Servicios disponibles:" -ForegroundColor Cyan
        Write-Host "   → MongoDB: localhost:27017" -ForegroundColor White
        Write-Host "   → Redis: localhost:6379" -ForegroundColor White
        Write-Host "   → MongoDB UI: http://localhost:8081 (admin/admin)" -ForegroundColor White
        Write-Host ""
        Write-Host "💡 Para ver logs: .\scripts\docker-setup.ps1 logs" -ForegroundColor Yellow
    } else {
        Write-Error "Error iniciando el ambiente de desarrollo"
        exit 1
    }
}

function Stop-Development {
    Write-Info "🛑 Deteniendo ambiente de desarrollo..."
    docker-compose -f docker-compose.dev.yml down
    Write-Info "Ambiente detenido"
}

function Show-Logs {
    Write-Info "📋 Mostrando logs de la aplicación..."
    docker-compose -f docker-compose.dev.yml logs -f app
}

function Show-Status {
    Write-Info "📊 Estado de los servicios:"
    docker-compose -f docker-compose.dev.yml ps
}

function Restart-Development {
    Write-Info "🔄 Reiniciando ambiente de desarrollo..."
    Stop-Development
    Start-Sleep -Seconds 2
    Start-Development
}

function Open-App {
    Write-Info "🌐 Abriendo aplicación en el navegador..."
    Start-Process "http://localhost:3000"
}

function Clean-Everything {
    Write-Warn "🧹 Limpiando contenedores, volúmenes e imágenes..."
    
    $confirm = Read-Host "¿Estás seguro? Esto eliminará todos los datos (y/N)"
    if ($confirm -eq 'y' -or $confirm -eq 'Y') {
        docker-compose -f docker-compose.dev.yml down -v --remove-orphans
        docker system prune -f
        Write-Info "Limpieza completada"
    } else {
        Write-Info "Operación cancelada"
    }
}

function Install-Dependencies {
    Write-Info "📦 Instalando dependencias en el contenedor..."
    docker-compose -f docker-compose.dev.yml exec app npm install
}

function Run-Tests {
    Write-Info "🧪 Ejecutando tests..."
    docker-compose -f docker-compose.dev.yml exec app npm test
}

# Función principal
switch ($Command.ToLower()) {
    "start" {
        Test-Docker
        Start-Development
    }
    "stop" {
        Stop-Development
    }
    "restart" {
        Restart-Development
    }
    "logs" {
        Show-Logs
    }
    "status" {
        Show-Status
    }
    "open" {
        Open-App
    }
    "clean" {
        Clean-Everything
    }
    "install" {
        Install-Dependencies
    }
    "test" {
        Run-Tests
    }
    "help" {
        Write-Host "🚀 Docker Setup para Desarrollo Local - Electric Automatic Chile" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Comandos disponibles:" -ForegroundColor White
        Write-Host "  start     - Iniciar ambiente de desarrollo" -ForegroundColor Green
        Write-Host "  stop      - Detener servicios" -ForegroundColor Red
        Write-Host "  restart   - Reiniciar servicios" -ForegroundColor Yellow
        Write-Host "  logs      - Ver logs de la aplicación" -ForegroundColor Blue
        Write-Host "  status    - Estado de servicios" -ForegroundColor Magenta
        Write-Host "  open      - Abrir aplicación en navegador" -ForegroundColor Cyan
        Write-Host "  install   - Instalar dependencias npm" -ForegroundColor White
        Write-Host "  test      - Ejecutar tests" -ForegroundColor White
        Write-Host "  clean     - Limpiar todo (⚠️ elimina datos)" -ForegroundColor DarkRed
        Write-Host ""
        Write-Host "Uso típico:" -ForegroundColor Yellow
        Write-Host "  .\scripts\docker-setup.ps1 start    # Primera vez" 
        Write-Host "  .\scripts\docker-setup.ps1 open     # Abrir en navegador"
        Write-Host "  .\scripts\docker-setup.ps1 logs     # Ver logs"
        Write-Host "  .\scripts\docker-setup.ps1 stop     # Al terminar"
    }
    default {
        Write-Error "Comando no reconocido: $Command"
        Write-Host "Usa '.\scripts\docker-setup.ps1 help' para ver comandos disponibles"
    }
} 