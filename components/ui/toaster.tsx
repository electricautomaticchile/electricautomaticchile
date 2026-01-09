"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        const titleText = typeof title === 'object' && title !== null 
          ? JSON.stringify(title) 
          : String(title || '');
        
        const descriptionText = typeof description === 'object' && description !== null 
          ? JSON.stringify(description) 
          : String(description || '');

        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{titleText}</ToastTitle>}
              {description && (
                <ToastDescription>{descriptionText}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
