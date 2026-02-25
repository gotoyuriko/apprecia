import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { filterArtworksByKeyword } from "../utils/searchUtils";
import type { ArtProject, AppUser } from "@/types";

interface SearchBarProps {
    artworksData: ArtProject[];
    setFilteredData: Dispatch<SetStateAction<ArtProject[]>>;
    usersData: AppUser[];
}

export default function SearchBar({ artworksData, setFilteredData, usersData }: SearchBarProps) {
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        setFilteredData(artworksData);
    }, [artworksData, setFilteredData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchInput(value);
        setFilteredData(filterArtworksByKeyword(artworksData, usersData, value));
    };

    return (
        <form className="relative px-10 pt-10 mx-auto text-center">
            <label htmlFor="search" className="hidden">Search</label>
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
