import React from "react";
import { useAuth } from "@/lib/hooks/useApi";
import { LogOut, User } from "lucide-react";
import { ProfileImageManager } from "@/components/ui/profile-image-manager";

const HeaderCliente: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-orange-500 px-4 py-3 shadow-md">
      <h1 className="text-lg font-semibold text-white">Dashboard Cliente</h1>
      <div className="flex items-center gap-4 text-white">
        {user && (
          <>
            <span className="hidden text-sm sm:inline">
              #{user.numeroCliente}
            </span>
            <div className="flex items-center gap-3">
              <ProfileImageManager
                userId={user._id || user.id}
                tipoUsuario="cliente"
                userName={user.nombre || "Cliente"}
                size="sm"
                showEditButton={true}
                className="border-2 border-white/20"
              />
              <span className="hidden sm:inline text-sm font-medium">
                {user.nombre}
              </span>
            </div>
          </>
        )}
        <button
          onClick={logout}
          title="Cerrar sesión"
          className="rounded hover:bg-orange-600 p-1"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default HeaderCliente;
