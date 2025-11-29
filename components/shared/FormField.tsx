"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "textarea";
  value: string | number;
  onChange: (value: string | number) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  rows?: number;
}

export function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  className,
  rows = 4,
}: FormFieldProps) {
  const hasError = !!error;

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className="flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      
      {type === "textarea" ? (
        <Textarea
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={cn(hasError && "border-destructive focus-visible:ring-destructive")}
        />
      ) : (
        <Input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => {
            const val = type === "number" ? Number(e.target.value) : e.target.value;
            onChange(val);
          }}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(hasError && "border-destructive focus-visible:ring-destructive")}
        />
      )}

      {hasError && (
        <div className="flex items-center gap-1 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
