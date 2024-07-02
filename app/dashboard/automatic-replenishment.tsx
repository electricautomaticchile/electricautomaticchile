import {
    Card,
    CardHeader,
    CardDescription,
    CardTitle,
    CardContent,
  } from "@/components/ui/card";
import { Check } from "lucide-react";


const AutomaticEnergy = () => {
    return(
        <Card>
              <CardHeader>
                <CardDescription>Reposicion automatica</CardDescription>
                <CardTitle>Activada</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <p>
                    Your account is set to automatically top-up when your
                    balance is low.
                  </p>
                </div>
              </CardContent>
            </Card>
    )
}

export default AutomaticEnergy