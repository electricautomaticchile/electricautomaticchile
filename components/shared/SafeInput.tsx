"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sanitizeInput, sanitizeEmail, sanitizeNumeric, sanitizeRUT, sanitizeTelefono } from "@/lib/utils/sanitize";
import { forwardRef } from "react";

interface SafeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  sanitizeType?: 'default' | 'email' | 'numeric' | 'rut' | 'telefono';
}

export const SafeInput = forwardRef<HTMLInputElement, SafeInputProps>(
  ({ sanitizeType = 'default', onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let sanitizedValue = e.target.value;

      switch (sanitizeType) {
        case 'email':
          sanitizedValue = sanitizeEmail(sanitizedValue);
          break;
        case 'numeric':
          sanitizedValue = sanitizeNumeric(sanitizedValue);
          break;
        case 'rut':
          sanitizedValue = sanitizeRUT(sanitizedValue);
          break;
        case 'telefono':
          sanitizedValue = sanitizeTelefono(sanitizedValue);
          break;
        default:
          sanitizedValue = sanitizeInput(sanitizedValue);
      }

      e.target.value = sanitizedValue;
      onChange?.(e);
    };

    return <Input ref={ref} onChange={handleChange} {...props} />;
  }
);

SafeInput.displayName = "SafeInput";

interface SafeTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const SafeTextarea = forwardRef<HTMLTextAreaElement, SafeTextareaProps>(
  ({ onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const sanitizedValue = sanitizeInput(e.target.value);
      e.target.value = sanitizedValue;
      onChange?.(e);
    };

    return <Textarea ref={ref} onChange={handleChange} {...props} />;
  }
);

SafeTextarea.displayName = "SafeTextarea";
