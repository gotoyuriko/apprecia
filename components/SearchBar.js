import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

export default function SearchBar() {
    const [searchInput, setSearchInput] = useState("");

    const countries = [

        { name: "Belgium", continent: "Europe" },
        { name: "India", continent: "Asia" },
        { name: "Bolivia", continent: "South America" },
        { name: "Ghana", continent: "Africa" },
        { name: "Japan", continent: "Asia" },
        { name: "Canada", continent: "North America" },
        { name: "New Zealand", continent: "Australasia" },
        { name: "Italy", continent: "Europe" },
        { name: "South Africa", continent: "Africa" },
        { name: "China", continent: "Asia" },
        { name: "Paraguay", continent: "South America" },
        { name: "Usa", continent: "North America" },
        { name: "France", continent: "Europe" },
        { name: "Botswana", continent: "Africa" },
        { name: "Spain", continent: "Europe" },
        { name: "Senegal", continent: "Africa" },
        { name: "Brazil", continent: "South America" },
        { name: "Denmark", continent: "Europe" },
        { name: "Mexico", continent: "South America" },
        { name: "Australia", continent: "Australasia" },
        { name: "Tanzania", continent: "Africa" },
        { name: "Bangladesh", continent: "Asia" },
        { name: "Portugal", continent: "Europe" },
        { name: "Pakistan", continent: "Asia" }
    ];

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
    };

    if (searchInput.length > 0) {
        countries.filter((country) => {
            return country.name.match(searchInput);
        });
    }

    return (
        <form className="p-10 relative">
            <label htmlFor="search" className="hidden">
                Search
            </label>
            <div className="relative">
                <AiOutlineSearch className="absolute left-5 top-1/2 transform -translate-y-1/2" />
                <div className="max-w-screen-md">
                    <div className="flex justify-center">
                        <input
                            id="search"
                            type="search"
                            placeholder="Search..."
                            className="w-full max-w-screen-md px-10 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-black-500 pl-12"
                        />
                    </div>
                </div>
            </div>
        </form>
    );
}