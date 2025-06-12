# 🚀 Docker - Inicio Rápido

## ⚡ Empezar en 2 minutos

### 1️⃣ Iniciar desarrollo

```powershell
.\scripts\docker-setup.ps1 start
```

### 2️⃣ Abrir la aplicación

```powershell
.\scripts\docker-setup.ps1 open
```

### 3️⃣ Al terminar

```powershell
.\scripts\docker-setup.ps1 stop
```

## 🎯 Eso es todo!

Tu aplicación estará corriendo en:

- **App**: http://localhost:3000
- **MongoDB UI**: http://localhost:8081 (admin/admin)

## 📋 Comandos útiles

```powershell
# Ver logs en tiempo real
.\scripts\docker-setup.ps1 logs

# Reiniciar servicios
.\scripts\docker-setup.ps1 restart

# Ver estado
.\scripts\docker-setup.ps1 status

# Limpiar todo (si hay problemas)
.\scripts\docker-setup.ps1 clean

# Ver todos los comandos
.\scripts\docker-setup.ps1 help
```

## 🔥 Desarrollo con Hot Reload

Los cambios en tu código se reflejan **automáticamente** en el navegador. No necesitas reiniciar nada.

## 🆘 Si algo no funciona

1. Asegúrate de tener Docker Desktop instalado
2. Ejecuta: `.\scripts\docker-setup.ps1 restart`
3. Si persiste: `.\scripts\docker-setup.ps1 clean` y luego `start`
