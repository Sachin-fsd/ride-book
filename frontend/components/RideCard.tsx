import Image from "next/image";

export interface Ride {
  platform: string;
  vehicle: string | null;
  capacity: number | null;
  eta: string | null;
  description: string | null;
  price: number | null;
  originalPrice: number | null;
  discount: number | null;
  currency: string | null;
  image: string | null;
  priceText?: string | null;
}

interface RideCardProps {
  ride: Ride;
}

const platformColors: Record<string, string> = {
  uber: "bg-black text-white",
  ola: "bg-green-600 text-white",
  rapido: "bg-yellow-400 text-black",
};

export default function RideCard({ ride }: RideCardProps) {
  const badge =
    platformColors[ride.platform.toLowerCase()] ??
    "bg-gray-700 text-white";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-gray-100">
            {ride.image ? (
              <Image
                src={ride.image}
                alt={ride.vehicle ?? ""}
                fill
                className="object-contain p-2"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xl">
                🚕
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              {ride.vehicle ?? "Unknown"}
            </h3>

            {ride.description && (
              <p className="mt-1 text-sm text-gray-500">
                {ride.description}
              </p>
            )}

            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${badge}`}
              >
                {ride.platform.toUpperCase()}
              </span>

              {ride.capacity && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                  👥 {ride.capacity}
                </span>
              )}

              {ride.eta && (
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700">
                  ⏱ {ride.eta}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="text-right">
          {ride.priceText ? (
            <div className="text-xl font-bold">
              {ride.priceText}
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold">
                ₹{ride.price}
              </div>

              {ride.originalPrice &&
                ride.originalPrice > (ride.price ?? 0) && (
                  <div className="text-sm text-gray-400 line-through">
                    ₹{ride.originalPrice}
                  </div>
                )}
            </>
          )}

          {ride.discount ? (
            <div className="mt-1 text-sm font-medium text-green-600">
              Save ₹{ride.discount}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}