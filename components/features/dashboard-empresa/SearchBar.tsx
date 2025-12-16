"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X, Users, Battery, FileText, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SearchResult {
  id: string;
  type: "cliente" | "dispositivo" | "reporte" | "estadistica";
  title: string;
  subtitle?: string;
  icon: any;
}

// TODO: Conectar con API real para búsqueda
const searchData: SearchResult[] = [];

interface SearchBarProps {
  onResultClick?: (result: SearchResult) => void;
}

export function SearchBar({ onResultClick }: SearchBarProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search
  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      // TODO: Implementar búsqueda real con API
      const filtered = searchData.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle?.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    setQuery("");
    if (onResultClick) {
      onResultClick(result);
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "cliente":
        return "Cliente";
      case "dispositivo":
        return "Dispositivo";
      case "reporte":
        return "Reporte";
      case "estadistica":
        return "Estadística";
      default:
        return type;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar clientes, dispositivos, reportes..."
            className="pl-10 pr-10 w-full bg-muted/50 border-border"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
              onClick={() => {
                setQuery("");
                setResults([]);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandList>
            {isSearching ? (
              <div className="p-4 text-sm text-muted-foreground text-center">
                Buscando...
              </div>
            ) : results.length === 0 && query.length >= 2 ? (
              <CommandEmpty>
                <div className="p-4 text-center">
                  <Search className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No se encontraron resultados para &quot;{query}&quot;
                  </p>
                </div>
              </CommandEmpty>
            ) : results.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground text-center">
                Escribe al menos 2 caracteres para buscar
              </div>
            ) : (
              <>
                {["cliente", "dispositivo", "reporte", "estadistica"].map(
                  (type) => {
                    const typeResults = results.filter((r) => r.type === type);
                    if (typeResults.length === 0) return null;

                    return (
                      <CommandGroup
                        key={type}
                        heading={getTypeLabel(type) + "s"}
                      >
                        {typeResults.map((result) => {
                          const Icon = result.icon;
                          return (
                            <CommandItem
                              key={result.id}
                              onSelect={() => handleSelect(result)}
                              className="cursor-pointer"
                            >
                              <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
                              <div className="flex-1">
                                <div className="font-medium">{result.title}</div>
                                {result.subtitle && (
                                  <div className="text-xs text-muted-foreground">
                                    {result.subtitle}
                                  </div>
                                )}
                              </div>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    );
                  }
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
