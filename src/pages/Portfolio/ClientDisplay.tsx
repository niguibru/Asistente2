// src/ClientDisplay.tsx
import React, { useState } from 'react';

// 1. Definimos interfaces para la estructura de los datos

// Interfaz para los datos del cliente tal como los queremos mostrar
interface ClientData {
    nombre: string;
    direccion: string;
    cif: string;
    email: string;
    telefono: string;
    website: string;
}

// Interfaz para la respuesta ESPERADA de la API (ejemplo de JSONPlaceholder)
// Es buena práctica tipar la respuesta cruda de la API para saber qué esperar.
interface ApiUserResponse {
    id: number; // Usaremos id si CIF no está disponible directamente
    name: string;
    email: string;
    phone: string;
    website: string;
    address?: { // El objeto address y sus campos pueden ser opcionales
        street?: string;
        suite?: string;
        city?: string;
        zipcode?: string; // Aunque no lo usemos, es bueno tiparlo si existe
    };
    company?: {
        name?: string;
        catchPhrase?: string;
        bs?: string; // Usaremos 'bs' como ejemplo para el CIF
    };
}


const ClientDisplay: React.FC = () => {
    // 2. Tipamos los estados
    const [clientData, setClientData] = useState<ClientData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchClientData = async (): Promise<void> => {
        //const url = 'https://data-hub-production.up.railway.app/company_data?id=70488';
        const url = 'https://data-hub-production.up.railway.app/companies_all';
        //const url = 'https://data-hub.railway.internal/company_data?id=70488';
        
        const token = '4321'; // Tu token de autorización
        setLoading(true);
        setError(null);
        setClientData(null);

        try {
            const response = await fetch(url, {
                method: 'GET', // O el método que necesites (POST, PUT, DELETE, etc.)
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // Puedes añadir otros encabezados aquí si son necesarios
                    // 'Content-Type': 'application/json', 
                }
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            // Le decimos a TypeScript cómo esperamos que sea la respuesta
            const data = await response.json() as ApiUserResponse;

            // Adaptamos la respuesta de la API a nuestra interfaz ClientData
            const processedData: ClientData = {
                nombre: data.name || 'N/A',
                direccion: `${data.address?.street || ''}, ${data.address?.suite || ''}, ${data.address?.city || ''}`.trim() || 'N/A',
                // Para el CIF, usamos 'company.bs' como ejemplo, o el 'id' si no está. Ajusta según tu API.
                cif: data.company?.bs || `ID-${data.id}` || 'N/A (Ejemplo CIF/ID)',
                email: data.email || 'N/A',
                telefono: data.phone || 'N/A',
                website: data.website || 'N/A',
            };

            setClientData(processedData);

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Ocurrió un error desconocido');
            }
            console.error("Error al obtener los datos del cliente:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', border: '1px solid #eee', borderRadius: '8px', maxWidth: '500px', margin: '20px auto' }}>
            <h2>Información del Cliente (TSX)</h2>
            <button onClick={fetchClientData} disabled={loading} style={{ padding: '10px 15px', marginBottom: '20px', cursor: 'pointer' }}>
                {loading ? 'Cargando...' : 'Obtener Datos del Cliente'}
            </button>

            {error && (
                <div style={{ color: 'red', marginBottom: '15px', border: '1px solid red', padding: '10px' }}>
                    <p><strong>Error:</strong> {error}</p>
                    <p>Asegúrate de que la API esté funcionando y la URL sea correcta.</p>
                </div>
            )}

            {clientData && (
                <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '4px' }}>
                    <p><strong>Nombre:</strong> {clientData.nombre}</p>
                    <p><strong>Dirección:</strong> {clientData.direccion}</p>
                    <p><strong>CIF:</strong> {clientData.cif}</p>
                    <p><strong>Email:</strong> {clientData.email}</p>
                    <p><strong>Teléfono:</strong> {clientData.telefono}</p>
                    <p><strong>Sitio Web:</strong> {clientData.website}</p>
                </div>
            )}

            {!loading && !clientData && !error && (
                <p>Presiona el botón para cargar los datos del cliente.</p>
            )}
        </div>
    );
}

export default ClientDisplay;