import { create } from 'zustand';

const TEMPLATE_STORAGE_KEY = 'json-formatter-template';
export const PLACEHOLDER = "{{value}}";
const DEFAULT_TEMPLATE = `{"fundName": "${PLACEHOLDER}", "dateType": "oneDay", "env": "production"}`;

interface JsonTemplateState {
  template: string;
  setTemplate: (newTemplate: string) => void;
  resetTemplate: () => void;
  loadTemplate: () => void;
}

export const useJsonTemplate = create<JsonTemplateState>((set, get) => ({
  template: DEFAULT_TEMPLATE,

  loadTemplate: () => {
    if (typeof window !== 'undefined') {
      const savedTemplate = localStorage.getItem(TEMPLATE_STORAGE_KEY);
      if (savedTemplate) {
        set({ template: savedTemplate });
      }
    }
  },

  setTemplate: (newTemplate) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TEMPLATE_STORAGE_KEY, newTemplate);
    }
    set({ template: newTemplate });
  },

  resetTemplate: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TEMPLATE_STORAGE_KEY);
    }
    set({ template: DEFAULT_TEMPLATE });
  },
}));

// Load template on initialization
useJsonTemplate.getState().loadTemplate();