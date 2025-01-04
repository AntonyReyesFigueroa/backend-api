import { NextResponse } from "next/server";
import { randomUUID } from "crypto"; // Para generar UUID
import { z } from "zod"; // Para validación

const baseUrl = "https://66ca96db59f4350f064f7699.mockapi.io/incidencia/1";
const userApiBaseUrl = "https://unc-2025.netlify.app/api/user/email/";

// Validación del body con Zod
const incidenciaSchema = z.object({
    asunto: z.string().min(1, "El asunto es obligatorio"),
    mensaje: z.string().min(1, "El mensaje es obligatorio"),
});

export async function POST(request, { params }) {
    const { email } = params;

    try {
        const body = await request.json();

        // Validar el body recibido
        const validationResult = incidenciaSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: validationResult.error.errors.map((err) => err.message),
                },
                { status: 400 }
            );
        }

        const { asunto, mensaje } = body;

        // Obtener la información del usuario con el email
        const userResponse = await fetch(`${userApiBaseUrl}${email}`);
        if (!userResponse.ok) {
            throw new Error("No se pudo obtener la información del usuario.");
        }
        const usuario = await userResponse.json();

        // Obtener la información actual del arreglo "incidencia" desde la API
        const incidenciaResponse = await fetch(baseUrl);
        if (!incidenciaResponse.ok) {
            throw new Error("No se pudo obtener el arreglo incidencia.");
        }
        const incidenciaData = await incidenciaResponse.json();

        // Crear un nuevo objeto de incidencia
        const nuevaIncidencia = {
            id: randomUUID(), // Generar un nuevo ID único
            asunto,
            mensaje,
            estado_solicitud: "Documento pendiente",
            estado_reparacion: "Pendiente",
            fecha_inicio: new Date().toLocaleDateString("en-GB"), // Fecha en formato dd/MM/yyyy
            fecha_terminado: null,
            usuario: usuario,
            responsable: {}, // Responsable por defecto vacío
            id_incidencia_material: [], // Por defecto vacío
        };

        // Actualizar el arreglo de incidencias
        const updatedIncidencias = [
            ...(incidenciaData.incidencia || []),
            nuevaIncidencia,
        ];

        // Enviar los datos actualizados a la API
        const putResponse = await fetch(baseUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ incidencia: updatedIncidencias }),
        });

        if (!putResponse.ok) {
            throw new Error("No se pudo actualizar el arreglo incidencia.");
        }

        return NextResponse.json(nuevaIncidencia, { status: 201 });
    } catch (error) {
        console.error("Error procesando la solicitud:", error);
        return NextResponse.json(
            { error: error.message || "Error interno del servidor" },
            { status: 500 }
        );
    }
}



export async function GET(request, { params }) {
    const { email } = params; // Obtener el parámetro email desde la ruta

    try {
        // Obtener los datos de incidencias desde la API
        const response = await fetch(baseUrl);

        if (!response.ok) {
            throw new Error("Failed to fetch incidencias");
        }

        const data = await response.json();

        // Verificar si existe el campo "incidencia"
        const incidencias = data.incidencia || [];

        // Filtrar las incidencias por el correo electrónico del usuario
        const userIncidencias = incidencias.filter(
            (item) => item.usuario?.email === email
        );

        if (userIncidencias.length === 0) {
            return NextResponse.json(
                { message: `No se encontraron incidencias para el email: ${email}` },
                { status: 404 }
            );
        }

        return NextResponse.json(userIncidencias, { status: 200 });
    } catch (error) {
        console.error("Error fetching incidencias by email:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
