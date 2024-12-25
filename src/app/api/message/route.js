import { NextResponse } from "next/server";


export async function GET(request) {
    try {
        // Hacemos la solicitud a la API externa
        const res = await fetch('https://648fbea575a96b6644454f7a.mockapi.io/mensaje');

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

export async function POST(request) {
    try {
        // Parseamos los datos enviados en el cuerpo de la solicitud
        const body = await request.json();

        // Validamos que se envíen los campos requeridos
        if (!body.nombre || !body.mensaje) {
            return NextResponse.json({ error: "El campo 'nombre' y 'mensaje' son requeridos" }, { status: 400 });
        }

        // Realizamos la solicitud `POST` a la API externa
        const res = await fetch('https://648fbea575a96b6644454f7a.mockapi.io/mensaje', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        // Verificamos si la solicitud fue exitosa
        if (!res.ok) {
            return NextResponse.json({ error: "Error al crear el mensaje" }, { status: res.status });
        }

        // Parseamos la respuesta de la API externa
        const createdData = await res.json();

        // Respondemos con los datos creados
        return NextResponse.json(createdData, { status: 201 });
    } catch (error) {
        // Manejo de errores
        console.error("Error al crear el mensaje:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}