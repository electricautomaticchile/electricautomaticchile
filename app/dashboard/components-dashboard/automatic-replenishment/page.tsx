import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import {
    Card,
    CardHeader,
    CardDescription,
    CardTitle,
    CardContent,
  } from "@/components/ui/card";

const AutomaticEnergy = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  return (
    <Card>
      <CardHeader>
        <CardDescription>Reposición automática</CardDescription>
        <CardTitle>{isEnabled ? 'Activada' : 'Desactivada'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          {isEnabled ? (
            <>
              <Check className="h-5 w-5 text-primary" />
              <p>Tu cuenta está configurada para reposición automática cuando el balance esté bajo.</p>
            </>
          ) : (
            <>
              <X className="h-5 w-5 text-destructive" />
              <p>La reposición automática está desactivada.</p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default AutomaticEnergy