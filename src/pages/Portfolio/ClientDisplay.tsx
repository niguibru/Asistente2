// src/ClientDisplay.tsx
import React, { useState } from 'react';

// 1. Definimos interfaces para la estructura de los datos

// Interfaz para los datos del cliente tal como los queremos mostrar
interface ClientData {
    id: number;
    name: string;
}

// Interfaz para la respuesta ESPERADA de la API
interface ApiUserResponse extends Array<{
    id: number;
    name: string;
}> {}

// Interfaz para los datos detallados de la compañía
interface CompanyDetails {
    id: number;
    name: string;
    x_studio_categoria: string;
    x_studio_industria: string;
    x_studio_servicios: string;
    x_studio_necesidades: string;
}

const ClientDisplay: React.FC = () => {
    // 2. Tipamos los estados
    const [clientData, setClientData] = useState<ClientData[]>([]);
    const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
    const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingDetails, setLoadingDetails] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [errorDetails, setErrorDetails] = useState<string | null>(null);

    const fetchClientData = async (): Promise<void> => {
        const url = 'https://data-hub-production.up.railway.app/companies_all';
        
        const token = '4321'; // Tu token de autorización
        setLoading(true);
        setError(null);
        setClientData([]);
        setSelectedClient(null);
        setCompanyDetails(null);

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            // Le decimos a TypeScript cómo esperamos que sea la respuesta
            const data = await response.json() as ApiUserResponse;

            // La respuesta ya está en el formato correcto, solo necesitamos asegurarnos que los campos existan
            const processedData: ClientData[] = data.map(client => ({
                id: client.id || 0,
                name: client.name || 'N/A',
            }));

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

    const fetchCompanyDetails = async (companyId: number): Promise<void> => {
        const url = `http://127.0.0.1:8000/company_data?id=${companyId}`;
        const token = '4321';
        
        setLoadingDetails(true);
        setErrorDetails(null);
        setCompanyDetails(null);

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json() as CompanyDetails[];
            if (data && data.length > 0) {
                setCompanyDetails(data[0]);
            } else {
                setErrorDetails('No se encontraron detalles para esta compañía');
            }

        } catch (err) {
            if (err instanceof Error) {
                setErrorDetails(err.message);
            } else {
                setErrorDetails('Ocurrió un error desconocido al obtener los detalles');
            }
            console.error("Error al obtener los detalles de la compañía:", err);
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleClientChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = parseInt(event.target.value);
        const client = clientData.find(c => c.id === selectedId) || null;
        setSelectedClient(client);
        
        if (client) {
            await fetchCompanyDetails(client.id);
        }
    };

    const formatFieldName = (field: string): string => {
        return field
            .replace('x_studio_', '')
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', border: '1px solid #eee', borderRadius: '8px', maxWidth: '500px', margin: '20px auto' }}>
            <h2>Selección de Cliente</h2>
            <button onClick={fetchClientData} disabled={loading} style={{ padding: '10px 15px', marginBottom: '20px', cursor: 'pointer' }}>
                {loading ? 'Cargando...' : 'Cargar Clientes'}
            </button>

            {error && (
                <div style={{ color: 'red', marginBottom: '15px', border: '1px solid red', padding: '10px' }}>
                    <p><strong>Error:</strong> {error}</p>
                    <p>Asegúrate de que la API esté funcionando y la URL sea correcta.</p>
                </div>
            )}

            {clientData.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                    <select 
                        onChange={handleClientChange}
                        value={selectedClient?.id || ''}
                        style={{
                            width: '100%',
                            padding: '10px',
                            fontSize: '16px',
                            borderRadius: '4px',
                            border: '1px solid #ddd'
                        }}
                    >
                        <option value="">Selecciona un cliente</option>
                        {clientData.map(client => (
                            <option key={client.id} value={client.id}>
                                {client.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {loadingDetails && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    Cargando detalles del cliente...
                </div>
            )}

            {errorDetails && (
                <div style={{ color: 'red', marginBottom: '15px', border: '1px solid red', padding: '10px' }}>
                    <p><strong>Error al cargar detalles:</strong> {errorDetails}</p>
                </div>
            )}

            {companyDetails && (
                <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
                    <h3>Detalles de la Compañía</h3>
                    <p><strong>ID:</strong> {companyDetails.id}</p>
                    <p><strong>Nombre:</strong> {companyDetails.name}</p>
                    <p><strong>Categoría:</strong> {companyDetails.x_studio_categoria || 'N/A'}</p>
                    <p><strong>Industria:</strong> {companyDetails.x_studio_industria || 'N/A'}</p>
                    <p><strong>Servicios:</strong> {companyDetails.x_studio_servicios || 'N/A'}</p>
                    <p><strong>Necesidades:</strong> {companyDetails.x_studio_necesidades || 'N/A'}</p>
                </div>
            )}

            {!loading && clientData.length === 0 && !error && (
                <p>Presiona el botón para cargar la lista de clientes.</p>
            )}
        </div>
    );
}

export default ClientDisplay;