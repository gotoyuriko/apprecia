import { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";

export default function SearchBar({ artworkData, setFilteredData }) {
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        setFilteredData(artworkData);
    }, [artworkData, setFilteredData])

    const handleChange = (e) => {
        setSearchInput(e.target.value);
        search(e.target.value);
    };

    const search = (searchKeyword) => {
        const searchedPosts = artworkData.filter((artwork) =>
            Object.values(artwork)
                .filter(
                    (item) =>
                        item !== undefined &&
                        item !== null &&
                        item.toString().toLowerCase().includes(searchKeyword.toLowerCase())
                )
                .length > 0
        );

        if (searchKeyword === '') {
            setFilteredData([...artworkData]);
            return;
        } else {
            setFilteredData(searchedPosts);
        }
    };

    return (
        <form className="relative px-10 pt-10 mx-auto text-center">
            <label htmlFor="search" className="hidden">
                Search
            </label>
            <div className="relative inline-block">
                <AiOutlineSearch className="absolute left-5 top-1/2 transform -translate-y-1/2" />
                <input
                    id="search"
                    type="text"
                    placeholder="Search..."
                    value={searchInput}
                    onChange={handleChange}
                    className="w-full w-80 md:w-[50vh] lg:w-[100vh] px-10 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-black-500 pl-12"
                />
            </div>
        </form>
    );
}
