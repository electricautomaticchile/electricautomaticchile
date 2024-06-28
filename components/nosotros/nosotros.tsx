"use client"
export default function Component() {
    return (
      <div className="flex flex-col items-center justify-center space-y-8 py-12 md:py-16 lg:py-20">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Electricautomaticchile</h2>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Somos una empresa dedicada a brindar soluciones innovadoras y de calidad a nuestros clientes.
          </p>
        </div>
        <div className="grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col items-center justify-center space-y-4">
            <TargetIcon className="h-12 w-12 text-primary" />
            <div className="space-y-2 text-center">
              <h3 className="text-xl font-bold">Nuestra Misión</h3>
              <p className="text-muted-foreground">
                Nuestra misión es ser líderes en nuestro sector, ofreciendo productos y servicios que superen las
                expectativas de nuestros clientes.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center space-y-4">
            <TelescopeIcon className="h-12 w-12 text-primary" />
            <div className="space-y-2 text-center">
              <h3 className="text-xl font-bold">Nuestra Visión</h3>
              <p className="text-muted-foreground">
                Nuestra visión es convertirnos en la empresa de referencia en nuestro mercado, a través de la innovación
                constante y el compromiso con la excelencia.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  function TargetIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    )
  }
  
  
  function TelescopeIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m10.065 12.493-6.18 1.318a.934.934 0 0 1-1.108-.702l-.537-2.15a1.07 1.07 0 0 1 .691-1.265l13.504-4.44" />
        <path d="m13.56 11.747 4.332-.924" />
        <path d="m16 21-3.105-6.21" />
        <path d="M16.485 5.94a2 2 0 0 1 1.455-2.425l1.09-.272a1 1 0 0 1 1.212.727l1.515 6.06a1 1 0 0 1-.727 1.213l-1.09.272a2 2 0 0 1-2.425-1.455z" />
        <path d="m6.158 8.633 1.114 4.456" />
        <path d="m8 21 3.105-6.21" />
        <circle cx="12" cy="13" r="2" />
      </svg>
    )
  }