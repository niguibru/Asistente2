// src/ClientDisplay.tsx
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
    documents: Array<{ name: string; url: string }>;
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

    // Cargar los datos automáticamente cuando el componente se monta
    useEffect(() => {
        fetchClientData();
    }, []); // El array vacío significa que solo se ejecutará al montar el componente

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

    // Datos mock de ventas
    const salesData = {
        labels: [
            'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
            'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
        ],
        datasets: [
            {
                label: 'Ventas ($)',
                data: [
                    1200, 1500, 1100, 1800, 2000, 1700,
                    2100, 1900, 2200, 2500, 2300, 2400
                ],
                backgroundColor: '#a084e8',
                borderRadius: 6,
                maxBarThickness: 32
            }
        ]
    };

    const salesOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Ventas del último año',
                color: '#6c47b6',
                font: { size: 18, weight: 'bold' }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#888' }
            },
            y: {
                grid: { color: '#eee' },
                ticks: { color: '#888' }
            }
        }
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh' }}>
            <div style={{ margin: '0 auto', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px #0001', padding: '32px 32px 24px 32px' }}>
                {error && (
                    <div style={{ color: 'red', marginBottom: '15px', border: '1px solid red', padding: '10px' }}>
                        <p><strong>Error:</strong> {error}</p>
                        <p>Asegúrate de que la API esté funcionando y la URL sea correcta.</p>
                    </div>
                )}

                {clientData.length > 0 && (
                    <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                        <select 
                            onChange={handleClientChange}
                            value={selectedClient?.id || ''}
                            style={{
                                width: '60%',
                                padding: '12px',
                                fontSize: '17px',
                                borderRadius: '6px',
                                border: '1px solid #bbb',
                                background: '#fafbfc',
                                margin: '0 auto',
                                display: 'block',
                                boxShadow: '0 1px 2px #0001'
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
                    <>
                        <div style={{ marginTop: '8px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '28px', background: '#fff' }}>
                                <tbody>
                                    <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                                        <td style={{ color: '#888', fontWeight: 500, padding: '12px 8px', width: '40%' }}>ID</td>
                                        <td style={{ padding: '12px 8px' }}>{companyDetails.id}</td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                                        <td style={{ color: '#888', fontWeight: 500, padding: '12px 8px' }}>Nombre</td>
                                        <td style={{ padding: '12px 8px' }}>{companyDetails.name}</td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                                        <td style={{ color: '#888', fontWeight: 500, padding: '12px 8px' }}>Categoría</td>
                                        <td style={{ padding: '12px 8px' }}>{companyDetails.x_studio_categoria || 'N/A'}</td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                                        <td style={{ color: '#888', fontWeight: 500, padding: '12px 8px' }}>Industria</td>
                                        <td style={{ padding: '12px 8px' }}>{companyDetails.x_studio_industria || 'N/A'}</td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                                        <td style={{ color: '#888', fontWeight: 500, padding: '12px 8px' }}>Servicios</td>
                                        <td style={{ padding: '12px 8px' }}>{companyDetails.x_studio_servicios || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ color: '#888', fontWeight: 500, padding: '12px 8px' }}>Necesidades</td>
                                        <td style={{ padding: '12px 8px' }}>{companyDetails.x_studio_necesidades || 'N/A'}</td>
                                    </tr>
                                </tbody>
                            </table>
                            {companyDetails.documents && companyDetails.documents.length > 0 && (
                                <div style={{ border: '2px dashed #a084e8', borderRadius: '8px', padding: '18px 18px 8px 18px', marginTop: '8px', background: '#fafaff' }}>
                                    <div style={{ fontWeight: 600, color: '#6c47b6', marginBottom: '10px' }}>Documentos</div>
                                    {companyDetails.documents.map((document, index) => (
                                        <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: index !== companyDetails.documents.length - 1 ? '1px dotted #d1c4e9' : 'none', padding: '8px 0' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ color: '#6c47b6', fontWeight: 500 }}>{document.name}</span>
                                            </div>
                                            <a href={document.url} target="_blank" rel="noopener noreferrer" style={{ color: '#6c47b6', fontWeight: 600, textDecoration: 'none', border: '1px solid #a084e8', borderRadius: '4px', padding: '4px 14px', transition: 'background 0.2s', background: '#f3eefe' }}>
                                                Descargar
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* Card de ventas y ingresos en dos columnas */}
                        <div style={{ display: 'flex', gap: 32, marginTop: 32 }}>
                            {/* Columna 1: Ventas */}
                            <div style={{ flex: 1, height: '300px', background: '#fafaff', borderRadius: 10, boxShadow: '0 1px 4px #0001', padding: 24, border: '1.5px solid #e0e0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Bar
                                    data={{
                                        labels: [
                                            'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
                                            'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
                                        ],
                                        datasets: [
                                            {
                                                label: 'Ventas ($)',
                                                data: [
                                                    1200, 1500, 1100, 1800, 2000, 1700,
                                                    2100, 1900, 2200, 2500, 2300, 2400
                                                ],
                                                backgroundColor: '#847AD5',
                                                borderRadius: 6,
                                                maxBarThickness: 32
                                            }
                                        ]
                                    }}
                                    options={{
                                        ...salesOptions,
                                        plugins: {
                                            ...salesOptions.plugins,
                                            title: {
                                                ...salesOptions.plugins.title,
                                                text: 'Ventas'
                                            }
                                        }
                                    }}
                                />
                            </div>
                            {/* Columna 2: Ingresos */}
                            <div style={{ flex: 1, height: '300px', background: '#fafaff', borderRadius: 10, boxShadow: '0 1px 4px #0001', padding: 24, border: '1.5px solid #e0e0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Bar
                                    data={{
                                        labels: [
                                            'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
                                            'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
                                        ],
                                        datasets: [
                                            {
                                                label: 'Ingresos ($)',
                                                data: [
                                                    800, 1200, 900, 1500, 1700, 1400,
                                                    1800, 1600, 2000, 2100, 1950, 2050
                                                ],
                                                backgroundColor: '#847AD5',
                                                borderRadius: 6,
                                                maxBarThickness: 32
                                            }
                                        ]
                                    }}
                                    options={{
                                        ...salesOptions,
                                        plugins: {
                                            ...salesOptions.plugins,
                                            title: {
                                                ...salesOptions.plugins.title,
                                                text: 'Ingresos'
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </>
                )}

                {!loading && clientData.length === 0 && !error && (
                    <p>Cargando lista de clientes...</p>
                )}
            </div>
        </div>
    );
}

export default ClientDisplay;