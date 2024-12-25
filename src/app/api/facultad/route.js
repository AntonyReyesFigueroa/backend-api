import { NextResponse } from "next/server";


export async function GET(request) {
    try {
        // Hacemos la solicitud a la API externa
        const res = await fetch('https://66ca96db59f4350f064f7699.mockapi.io/facultad');

        // Verificamos si la solicitud fue exitosa
        if (!res.ok) {
            return NextResponse.json({ error: "Error al obtener datos de la API externa" }, { status: res.status });
        }

        // Parseamos los datos en formato JSON
        const data = await res.json();

        // Respondemos con los datos obtenidos
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        // Manejo de errores
        console.error("Error al consumir la API externa:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}

