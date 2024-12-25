import { NextResponse } from "next/server";


export async function GET(request, { params }) {
    const res = await fetch('https://66ca96db59f4350f064f7699.mockapi.io/facultad/' + params.id);
    const data = await res.json();
    return NextResponse.json(data);
}



export async function PUT(request, { params }) {
    try {
        // Obtenemos el ID del recurso desde `params`
        const { id } = params;

        // Validamos que el ID exista
        if (!id) {
            return NextResponse.json({ error: "ID es requerido" }, { status: 400 });
        }

        // Parseamos los datos enviados en el cuerpo de la solicitud
        const body = await request.json();

        // Validamos que se envíen datos
        if (!body || Object.keys(body).length === 0) {
            return NextResponse.json({ error: "Datos para actualizar son requeridos" }, { status: 400 });
        }

        // Realizamos la solicitud `PUT` a la API externa
        const res = await fetch(`https://66ca96db59f4350f064f7699.mockapi.io/facultad/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        // Verificamos si la actualización fue exitosa
        if (!res.ok) {
            return NextResponse.json({ error: "Error al actualizar la facultad" }, { status: res.status });
        }

        // Parseamos la respuesta de la API externa
        const updatedData = await res.json();

        // Devolvemos los datos actualizados
        return NextResponse.json(updatedData, { status: 200 });
    } catch (error) {
        // Manejo de errores
        console.error("Error al actualizar la facultad:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}


