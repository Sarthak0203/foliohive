"use client";

import { useState } from "react";

export default function RatingStars({ maxStars = 5, onRate }) {
    const [rating, setRating] = useState(0);

    return (
        <div className="flex">
            {[...Array(maxStars)].map((_, index) => (
                <span
                    key={index}
                    className={`cursor-pointer ${
                        index < rating ? "text-yellow-500" : "text-gray-400"
                    }`}
                    onClick={() => {
                        setRating(index + 1);
                        onRate(index + 1);
                    }}
                >
                    ★
                </span>
            ))}
        </div>
    );
}
