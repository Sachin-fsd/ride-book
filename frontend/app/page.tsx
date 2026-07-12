"use client";

import { useMemo, useState } from "react";
import SearchBox from "@/components/SearchBox";
import RideCard, { Ride } from "@/components/RideCard";

export default function HomePage() {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");

  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function searchRides() {
    if (!pickup.trim() || !drop.trim()) {
      setError("Please select pickup and destination.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/rides/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: pickup,
          to: drop,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Something went wrong.");
      }

      setRides(data.rides);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch rides.");
    } finally {
      setLoading(false);
    }
  }

  const sortedRides = useMemo(() => {
    return [...rides].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
  }, [rides]);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-5xl font-bold">
            Compare Ride Prices
          </h1>

          <p className="mt-4 text-gray-600">
            Compare Uber, Ola and Rapido fares instantly.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-3xl bg-white p-8 shadow-xl">
          <div className="space-y-6">
            <SearchBox
              label="Pickup"
              placeholder="Enter pickup location"
              value={pickup}
              onChange={setPickup}
            />

            <SearchBox
              label="Destination"
              placeholder="Enter destination"
              value={drop}
              onChange={setDrop}
            />

            <button
              onClick={searchRides}
              disabled={loading}
              className="w-full rounded-xl bg-black py-4 text-lg font-semibold text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Comparing fares..." : "Compare Fares"}
            </button>

            {error && (
              <p className="text-center text-red-600">
                {error}
              </p>
            )}
          </div>
        </div>

        {sortedRides.length > 0 && (
          <>
            <div className="mt-16 flex items-center justify-between">
              <h2 className="text-3xl font-bold">
                Available Rides
              </h2>

              <span className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white">
                {sortedRides.length} rides
              </span>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {sortedRides.map((ride, index) => (
                <RideCard
                  key={`${ride.platform}-${ride.vehicle}-${index}`}
                  ride={ride}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}