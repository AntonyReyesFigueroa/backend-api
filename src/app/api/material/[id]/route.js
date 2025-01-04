import { NextResponse } from "next/server";

const url = "https://66ca95fa59f4350f064f7413.mockapi.io/material/1";

// Función auxiliar para obtener los datos
const fetchData = async () => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Error al obtener los datos del servidor");
    }
    return response.json();
};

// Manejo del endpoint dinámico [id]
export async function GET(request, { params }) {
    try {
        const { id } = params;

        // Validar que `id` esté presente
        if (!id) {
            return NextResponse.json(
                { error: "El parámetro 'id' es obligatorio" },
                { status: 400 }
            );
        }

        // Obtener los materiales de MockAPI
        const data = await fetchData();

        // Buscar el material por `id`
        const material = (data.material || []).find(item => item.id === id);

        if (!material) {
            return NextResponse.json(
                { error: `No se encontró material con id: ${id}` },
                { status: 404 }
            );
        }

        return NextResponse.json(material, { status: 200 });
    } catch (error) {
        console.error("Error al buscar el material:", error.message);
        return NextResponse.json(
            { error: "No se pudo obtener el material" },
            { status: 500 }
        );
    }
}


export async function PATCH(request, { params }) {
    try {
        const { id } = params;

        // Validar que `id` esté presente
        if (!id) {
            return NextResponse.json(
                { error: "El parámetro 'id' es obligatorio" },
                { status: 400 }
            );
        }

        const updates = await request.json(); // Datos a actualizar

        // Obtener los datos actuales
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Error al obtener los datos del servidor");
        }

        const data = await response.json();
        const materials = data.material || [];

        // Encontrar el material por `id`
        const materialIndex = materials.findIndex(item => item.id === id);
        if (materialIndex === -1) {
            return NextResponse.json(
                { error: `No se encontró material con id: ${id}` },
                { status: 404 }
            );
        }

        // Actualizar los datos del material
        materials[materialIndex] = {
            ...materials[materialIndex],
            ...updates,
        };

        // Guardar los datos actualizados
        const patchResponse = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ material: materials }),
        });

        if (!patchResponse.ok) {
            throw new Error("Error al guardar los cambios en el servidor");
        }

        return NextResponse.json(materials[materialIndex], { status: 200 });
    } catch (error) {
        console.error("Error al actualizar el material:", error.message);
        return NextResponse.json(
            { error: "No se pudo actualizar el material" },
            { status: 500 }
        );
    }
}


export async function DELETE(request, { params }) {
    try {
        const { id } = params;

        // Validar que `id` esté presente
        if (!id) {
            return NextResponse.json(
                { error: "El parámetro 'id' es obligatorio" },
                { status: 400 }
            );
        }

        // Obtener los datos actuales
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Error al obtener los datos del servidor");
        }

        const data = await response.json();
        const materials = data.material || [];

        // Filtrar para excluir el material con `id` correspondiente
        const updatedMaterials = materials.filter(item => item.id !== id);

        if (materials.length === updatedMaterials.length) {
            return NextResponse.json(
                { error: `No se encontró material con id: ${id}` },
                { status: 404 }
            );
        }

        // Guardar los datos actualizados
        const deleteResponse = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ material: updatedMaterials }),
        });

        if (!deleteResponse.ok) {
            throw new Error("Error al guardar los cambios en el servidor");
        }

        return NextResponse.json(
            { message: `Material con id ${id} eliminado con éxito` },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error al eliminar el material:", error.message);
        return NextResponse.json(
            { error: "No se pudo eliminar el material" },
            { status: 500 }
        );
    }
}
