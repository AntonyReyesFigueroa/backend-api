import { NextResponse } from "next/server";

// URL interna de tu API
const apiUrl = "https://66ca95fa59f4350f064f7413.mockapi.io/material/1";

// ✅ GET (Obtener material por ID)
export async function GET(request, { params }) {
    const { id } = params;

    try {
        // Realiza una solicitud interna a tu propia API
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch materials");

        const materials = await response.json();

        // Filtrar el material por ID
        const foundMaterial = materials.find(item => item.id === id);
        if (!foundMaterial) {
            return NextResponse.json({ error: "Material not found" }, { status: 404 });
        }

        return NextResponse.json(foundMaterial);
    } catch (error) {
        console.error("Error fetching material by ID:", error);
        return NextResponse.json({ error: "Failed to fetch material" }, { status: 500 });
    }
}

// ✅ PATCH (Actualizar material por ID)
export async function PATCH(request, { params }) {
    const { id } = params;

    try {
        const body = await request.json();

        // Realiza una solicitud interna para obtener los materiales
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch materials");

        const materials = await response.json();

        // Buscar y actualizar el material por ID
        const updatedMaterials = materials.map(item =>
            item.id === id ? { ...item, ...body } : item
        );

        // Enviar los datos actualizados a la API
        const patchResponse = await fetch(apiUrl, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedMaterials),
        });

        if (!patchResponse.ok) throw new Error("Failed to update material");

        return NextResponse.json({ message: "Material updated successfully" });
    } catch (error) {
        console.error("Error updating material by ID:", error);
        return NextResponse.json({ error: "Failed to update material" }, { status: 500 });
    }
}

// ✅ DELETE (Eliminar material por ID)
export async function DELETE(request, { params }) {
    const { id } = params;

    try {
        // Realiza una solicitud interna para obtener los materiales
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch materials");

        const materials = await response.json();

        // Filtrar los materiales eliminando el material con el ID especificado
        const remainingMaterials = materials.filter(item => item.id !== id);

        // Enviar los datos actualizados a la API
        const patchResponse = await fetch(apiUrl, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(remainingMaterials),
        });

        if (!patchResponse.ok) throw new Error("Failed to delete material");

        return NextResponse.json({ message: "Material deleted successfully" });
    } catch (error) {
        console.error("Error deleting material by ID:", error);
        return NextResponse.json({ error: "Failed to delete material" }, { status: 500 });
    }
}
