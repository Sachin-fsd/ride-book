"use client";

import { useEffect, useRef, useState } from "react";
import { PlacePrediction, searchPlaces } from "@/lib/rapido";

interface SearchBoxProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBox({
  label,
  placeholder,
  value,
  onChange,
}: SearchBoxProps) {
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!value.trim()) {
        setSuggestions([]);
        return;
      }

      setLoading(true);

      const data = await searchPlaces(value);

      setSuggestions(data);
      setSelectedIndex(-1);

      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setSuggestions([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function selectPlace(place: PlacePrediction) {
    onChange(place.description);
    setSuggestions([]);
    setSelectedIndex(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!suggestions.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();

      setSelectedIndex((prev) =>
        prev + 1 >= suggestions.length ? 0 : prev + 1
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();

      setSelectedIndex((prev) =>
        prev <= 0 ? suggestions.length - 1 : prev - 1
      );
    }

    if (e.key === "Enter") {
      e.preventDefault();

      if (selectedIndex >= 0) {
        selectPlace(suggestions[selectedIndex]);
      }
    }

    if (e.key === "Escape") {
      setSuggestions([]);
    }
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black"
      />

      {loading && (
        <div className="absolute right-4 top-[46px] h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
      )}

      {suggestions.length > 0 && (
        <div className="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl">
          {suggestions.map((place, index) => (
            <button
              key={place.description}
              type="button"
              onClick={() => selectPlace(place)}
              className={`w-full border-b border-gray-100 px-4 py-3 text-left last:border-none ${
                selectedIndex === index
                  ? "bg-gray-100"
                  : "hover:bg-gray-50"
              }`}
            >
              <p className="font-medium text-gray-900">
                {place.main_text}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {place.description}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}