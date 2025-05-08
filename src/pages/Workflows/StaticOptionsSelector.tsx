// src/components/StaticOptionsSelector.tsx
import React from 'react';

export interface SelectOption { // Exportamos para usarla en el formulario padre
  value: string;
  label: string;
}

interface StaticOptionsSelectorProps {
  options: SelectOption[];
  selectedValue: string;
  onChange: (name: string, value: string) => void;
  name: string;
  // defaultOptionLabel ya no es necesario si la primera opción en `options` actúa como tal
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const StaticOptionsSelector: React.FC<StaticOptionsSelectorProps> = ({
  options,
  selectedValue,
  onChange,
  name,
  disabled = false,
  className = "",
  style = {}
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.name, e.target.value);
  };

  const defaultStyles: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    fontSize: '17px',
    borderRadius: '6px',
    border: '1px solid #bbb',
    background: '#fafbfc',
    boxShadow: '0 1px 2px #0001',
  };

  return (
    <select
      name={name}
      value={selectedValue}
      onChange={handleChange}
      disabled={disabled}
      className={className}
      style={{ ...defaultStyles, ...style }}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default StaticOptionsSelector;