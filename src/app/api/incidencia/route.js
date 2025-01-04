import { NextResponse } from "next/server";

const url = "https://66ca96db59f4350f064f7699.mockapi.io/incidencia/1";

export async function GET() {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch incidencias");
        }

        const data = await response.json();

        // Retornar el arreglo de incidencias desde el campo correspondiente
        return NextResponse.json(data.incidencia || [], { status: 200 });
    } catch (error) {
        console.error("Error fetching incidencias:", error);
        return NextResponse.json(
            { error: "Failed to fetch incidencias" },
            { status: 500 }
        );
    }
}
