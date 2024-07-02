import {Card,CardHeader,CardDescription,CardTitle,CardContent} from "@/components/ui/card";
import { CircleAlert } from "lucide-react";

const SectorEnergy = () => {
    return(
        <Card>
              <CardHeader>
                <CardDescription>Sectores sin energia</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <CircleAlert className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-medium">Sector A</p>
                      <p className="text-sm ">
                        Tiempo estimado de Reposición: 2 hours
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CircleAlert className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-medium">Sector B</p>
                      <p className="text-sm ">
                        Tiempo estimado de Reposición: 1 hour
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
    )
}

export default SectorEnergy