// src/components/ClientSelector.tsx
import React, { useState, useEffect } from 'react';

interface ItemFromApi {
  id: number | string; // ID puede ser número o string
  name: string;        // La propiedad que se mostrará como etiqueta
}

interface ClientSelectorProps {
  apiUrl: string;
  apiToken: string;
  selectedValue: string;
  onChange: (name: string, value: string) => void;
  name: string;
  defaultOptionLabel?: string;
  disabled?: boolean;
  triggerFetch?: boolean; // Para controlar cuándo hacer la llamada a la API
  className?: string;
  style?: React.CSSProperties;
}

const ClientSelector: React.FC<ClientSelectorProps> = ({
  apiUrl,
  apiToken,
  selectedValue,
  onChange,
  name,
  defaultOptionLabel = 'Selecciona una opción',
  disabled = false,
  triggerFetch = true, // Por defecto, intentar cargar si el componente se renderiza y triggerFetch es true
  className = "",
  style = {}
}) => {
  const [items, setItems] = useState<ItemFromApi[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItemsFromApi = async () => {
      if (!apiUrl || !apiToken || !triggerFetch) {
        if (!triggerFetch) setItems([]); // Limpiar si no se debe hacer fetch
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${apiToken}` },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error HTTP: ${response.status} - ${errorText || response.statusText}`);
        }

        const data = await response.json();

        // Asumimos que la API devuelve un array de objetos con 'id' y 'name'
        if (Array.isArray(data)) {
          setItems(data.map(item => ({
            id: item.id ?? `unknown-id-${Math.random().toString(36).substr(2, 9)}`, // Fallback
            name: item.name || 'Nombre no disponible', // Fallback
          })));
        } else {
          console.error("Respuesta de API no es un array:", data);
          setItems([]);
          setError("Formato de datos de API inesperado.");
        }
      } catch (err) {
        console.error(`Error fetching data for ${name}:`, err);
        setError(err instanceof Error ? err.message : 'Error desconocido al cargar datos.');
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItemsFromApi();
  }, [apiUrl, apiToken, triggerFetch, name]); // Incluir 'name' si la lógica de error/log lo usa

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
    // marginBottom: 16, // El margen inferior se controlará en el componente padre
  };

  return (
    <select
      name={name}
      value={selectedValue}
      onChange={handleChange}
      disabled={loading || disabled || !!error}
      className={className}
      style={{ ...defaultStyles, ...style }}
    >
      <option value="">
        {loading ? 'Cargando...' : (error ? `Error (ver consola)` : defaultOptionLabel)}
      </option>
      {!loading && !error && items.map(item => (
        <option key={item.id} value={String(item.id)}>
          {item.name}
        </option>
      ))}
    </select>
  );
};

export default ClientSelector;