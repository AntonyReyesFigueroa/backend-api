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

        // Validar los datos enviados
        const validationResult = materialsSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: validationResult.error.errors.map(err => err.message) },
                { status: 400 }
            );
        }

        const newMaterials = validationResult.data.map(material => ({
            ...material,
            id: material.id || randomUUID(), // Generar UUID si no se proporciona
        }));

        // Obtener el objeto actual desde MockAPI
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch material data");
        }

        const currentData = await response.json();

        // Actualizar el campo "material"
        const updatedMaterials = [...(currentData.material || []), ...newMaterials];

        // Enviar los datos actualizados a MockAPI
        const patchResponse = await fetch(url, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ material: updatedMaterials }),
        });

        if (!patchResponse.ok) {
            throw new Error("Failed to update materials");
        }



        return NextResponse.json(newMaterials || [], { status: 200 });
    } catch (error) {
        console.error("Error updating materials:", error);
        return NextResponse.json(
            { error: "Failed to update materials" },
            { status: 500 }
        );
    }
}
