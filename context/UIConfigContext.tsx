
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UIConfig } from '../types';
import { getUIConfigApi, saveUIConfigApi } from '../services/api';

interface UIConfigContextType {
  config: UIConfig;
  updateConfig: (newConfig: Partial<UIConfig>) => void;
  saveConfig: () => Promise<void>;
  isSaving: boolean;
}

const UIConfigContext = createContext<UIConfigContextType | undefined>(undefined);

export const UIConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<UIConfig | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getUIConfigApi().then(setConfig);
  }, []);

  useEffect(() => {
    if (config) {
      // Inject CSS Variable to document root for real-time color update
      document.documentElement.style.setProperty('--primary-color', config.primaryColor);
    }
  }, [config]);

  const updateConfig = (newConfig: Partial<UIConfig>) => {
    setConfig(prev => prev ? { ...prev, ...newConfig } : null);
  };

  const saveConfig = async () => {
    if (!config) return;
    setIsSaving(true);
    await saveUIConfigApi(config);
    setIsSaving(false);
  };

  if (!config) return null; // Wait for initial config

  return (
    <UIConfigContext.Provider value={{ config, updateConfig, saveConfig, isSaving }}>
      {children}
    </UIConfigContext.Provider>
  );
};

export const useUIConfig = () => {
  const context = useContext(UIConfigContext);
  if (!context) throw new Error('useUIConfig must be used within UIConfigProvider');
  return context;
};
