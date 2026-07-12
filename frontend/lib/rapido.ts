export interface PlacePrediction {
  main_text: string;
  description: string;
}

interface RapidoResponse {
  success: boolean;
  predictions: PlacePrediction[];
}

export async function searchPlaces(query: string): Promise<PlacePrediction[]> {
  if (!query.trim()) return [];

  try {
    const res = await fetch(
      `https://www.rapido.bike/places/autocomplete?query=${encodeURIComponent(
        query,
      )}`,
      {
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      },
    );

    if (!res.ok) {
      return [];
    }

    const data: RapidoResponse = await res.json();

    if (!data.success) {
      return [];
    }

    return data.predictions;
  } catch (err) {
    console.error("Autocomplete failed:", err);
    return [];
  }
}
