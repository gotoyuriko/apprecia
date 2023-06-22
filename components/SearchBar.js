import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

export default function SearchBar() {
    const [searchInput, setSearchInput] = useState("");

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
        <form className="relative px-10 pt-10 mx-auto text-center">
            <label htmlFor="search" className="hidden">
                Search
            </label>
            <div className="relative inline-block">
                <AiOutlineSearch className="absolute left-5 top-1/2 transform -translate-y-1/2" />
                <input
                    id="search"
                    type="search"
                    placeholder="Search..."
                    onChange={handleChange}
                    className="w-full w-80 md:w-[50vh] lg:w-[100vh] px-10 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-black-500 pl-12"
                />
            </div>
        </form>
    );
}
