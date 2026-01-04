import { TrendingUp, AlertTriangle, Activity, Shield } from 'lucide-react';
import { Anomalia } from './types';

export const getSeverityInfo = (severity: Anomalia['severidad']) => {
  switch (severity) {
    case 'low':
      return { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300', text: 'Baja' };
    case 'medium':
      return { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300', text: 'Media' };
    case 'high':
      return { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300', text: 'Alta' };
    case 'critical':
      return { color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300', text: 'Crítica' };
  }
};

export const getStatusInfo = (status: Anomalia['estado']) => {
  switch (status) {
    case 'pending':
      return { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300', text: 'Pendiente' };
    case 'investigating':
      return { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300', text: 'Investigando' };
    case 'resolved':
      return { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300', text: 'Resuelto' };
    case 'false_positive':
      return { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300', text: 'Falso Positivo' };
  }
};

export const getTypeInfo = (type: string) => {
  switch (type) {
    case 'consumo_elevado':
      return { icon: TrendingUp, text: 'Consumo Elevado' };
    case 'consumo_cero':
      return { icon: AlertTriangle, text: 'Consumo Cero' };
    case 'voltaje_anormal':
      return { icon: Activity, text: 'Voltaje Anormal' };
    case 'corriente_elevada':
      return { icon: Activity, text: 'Corriente Elevada' };
    case 'potencia_inconsistente':
      return { icon: Shield, text: 'Potencia Inconsistente' };
    default:
      return { icon: AlertTriangle, text: type };
  }
};
