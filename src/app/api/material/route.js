import { NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto"; // Importar para generar UUID

const url = "https://66ca95fa59f4350f064f7413.mockapi.io/material/1";

// Validación de datos con Zod
const materialSchema = z.object({
    id: z.string().optional(), // Será generado automáticamente
    nombre: z.string().min(1, "El nombre es obligatorio"),
    categoria: z.string().min(1, "La categoría es obligatoria"),
    cantidad: z.string().min(1, "La cantidad es obligatoria"),
    stock: z.number().min(0, "El stock no puede ser negativo"),
    precio_unidad: z.number().min(0, "El precio debe ser positivo"),
    fecha: z.string().optional(), // Campo adicional para la fecha
});

const materialsSchema = z.array(materialSchema);

export async function GET() {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch materials");
        }

        const data = await response.json();

        return NextResponse.json(data.material || []);
    } catch (error) {
        console.error("Error fetching materials:", error);
        return NextResponse.json(
            { error: "Failed to fetch materials" },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const body = await request.json();

        // Validar el dato enviado (un solo objeto)
        const validationResult = materialSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: validationResult.error.errors.map(err => err.message) },
                { status: 400 }
            );
        }

        // Obtener la fecha actual en formato DD/MM/YYYY
        const obtenerFechaActual = () => {
            const fecha = new Date();
            const dia = String(fecha.getDate()).padStart(2, "0");
            const mes = String(fecha.getMonth() + 1).padStart(2, "0"); // Enero es 0
            const anio = fecha.getFullYear();
            return `${dia}/${mes}/${anio}`;
        };

        const fechaActual = obtenerFechaActual();

        // Preparar el material con datos adicionales (ID y fecha)
        const newMaterial = {
            ...validationResult.data,
            id: validationResult.data.id || randomUUID(), // Generar UUID si no se proporciona
            fecha: validationResult.data.fecha || fechaActual, // Agregar fecha si no existe
        };

        // Obtener el objeto actual desde MockAPI
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch material data");
        }

        const currentData = await response.json();

        // Actualizar el campo "material"
        const updatedMaterials = [...(currentData.material || []), newMaterial];

        // Enviar los datos actualizados a MockAPI
        const patchResponse = await fetch(url, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ material: updatedMaterials }),
        });

        if (!patchResponse.ok) {
            throw new Error("Failed to update materials");
        }

        return NextResponse.json(newMaterial, { status: 200 });
    } catch (error) {
        console.error("Error updating materials:", error);
        return NextResponse.json(
            { error: "Failed to update materials" },
            { status: 500 }
        );
    }
}
