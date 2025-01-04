import { NextResponse } from "next/server";

const url = "https://66ca95fa59f4350f064f7413.mockapi.io/usuario";

export async function GET(request, { params }) {
    const { pertenencia } = params;

    try {
        // Decodificar el valor de pertenencia (por si tiene %20 u otros caracteres codificados)
        const decodedPertenencia = decodeURIComponent(pertenencia);

        // Validar que el campo pertenencia esté presente
        if (!decodedPertenencia) {
            return NextResponse.json(
                { error: "El campo pertenencia es obligatorio" },
                { status: 400 }
            );
        }

        // Hacer la solicitud a MockAPI para obtener todos los usuarios
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error al obtener usuarios: ${response.statusText}`);
        }

        const users = await response.json();

        // Filtrar usuarios por pertenencia
        const filteredUsers = users.filter((u) => u.pertenencia === decodedPertenencia);

        if (filteredUsers.length === 0) {
            return NextResponse.json(
                { error: `No se encontraron usuarios con la pertenencia: ${decodedPertenencia}` },
                { status: 404 }
            );
        }

        // Retornar los datos de los usuarios filtrados
        return NextResponse.json(filteredUsers, { status: 200 });
    } catch (error) {
        console.error("Error al filtrar usuarios por pertenencia:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
