import { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";

export default function SearchBar({ artworksData, setFilteredData, usersData }) {
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        setFilteredData(artworksData);
    }, [artworksData, setFilteredData])

    const handleChange = (e) => {
        setSearchInput(e.target.value);
        search(e.target.value);
    };

    const search = (searchKeyword) => {
        if (searchKeyword === "") {
            setFilteredData([...artworksData]);
        } else {
            const keywords = searchKeyword.toString().toLowerCase();

            // If search keyword is provided
            const searchedUsers = usersData
                .filter((user) => user.user_name.toLowerCase().includes(keywords))
                .map((user) => user.user_email);

            // If search matches with artwork
            const searchedArtworks = artworksData.filter((artwork) => {
                return (
                    Object.values(artwork).some(
                        (artworkItem) =>
                            artworkItem !== undefined &&
                            artworkItem !== null &&
                            artworkItem.toString().toLowerCase().includes(keywords)
                    ) ||
                    searchedUsers.includes(artwork.project_creator) ||
                    artwork.project_skills
                        ?.map((skill) => skill.value.toLowerCase())
                        ?.some((skill) => skill.includes(keywords)) ||
                    artwork.project_tags
                        ?.map((tag) => tag.value.toLowerCase())
                        ?.some((tag) => tag.includes(keywords))
                );
            });
            setFilteredData(searchedArtworks);
        }
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
