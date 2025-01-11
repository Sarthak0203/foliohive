"use client";

export default function SearchBar({ onSearch }) {
    const handleSearch = (e) => {
        if (e.key === "Enter") {
            onSearch(e.target.value);
        }
    };

    return (
        <input
            type="text"
            className="border p-2 w-full rounded"
            placeholder="Search..."
            onKeyPress={handleSearch}
        />
    );
}
