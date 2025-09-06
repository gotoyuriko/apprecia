import { useArtworkFilters } from '@/firebase/contexts/useArtworkFilters';
import { BiFilter, BiSort, BiX } from 'react-icons/bi';

export default function FilterBar() {
    const {
        sortBy,
        setSortBy,
        categoryFilter,
        setCategoryFilter,
        skillFilter,
        setSkillFilter,
        filterOptions,
        resetFilters,
        hasActiveFilters,
        totalResults
    } = useArtworkFilters();

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Results count and active filters */}
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">
                        {totalResults} result{totalResults !== 1 ? 's' : ''}
                    </span>
                    {hasActiveFilters && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Active filters:</span>
                            {categoryFilter !== 'all' && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                    {categoryFilter}
                                    <button
                                        onClick={() => setCategoryFilter('all')}
                                        className="ml-1 hover:text-blue-600"
                                    >
                                        <BiX className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                            {skillFilter !== 'all' && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                    {skillFilter}
                                    <button
                                        onClick={() => setSkillFilter('all')}
                                        className="ml-1 hover:text-green-600"
                                    >
                                        <BiX className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Filter controls */}
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Category filter */}
                    <div className="flex items-center gap-2">
                        <BiFilter className="text-gray-400" />
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="all">All Categories</option>
                            {filterOptions.categories.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Skill filter */}
                    <div className="flex items-center gap-2">
                        <BiFilter className="text-gray-400" />
                        <select
                            value={skillFilter}
                            onChange={(e) => setSkillFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="all">All Skills</option>
                            {filterOptions.skills.map(skill => (
                                <option key={skill} value={skill}>
                                    {skill}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sort by */}
                    <div className="flex items-center gap-2">
                        <BiSort className="text-gray-400" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="mostLiked">Most Liked</option>
                            <option value="mostViewed">Most Viewed</option>
                            <option value="alphabetical">Alphabetical</option>
                        </select>
                    </div>

                    {/* Reset filters */}
                    {hasActiveFilters && (
                        <button
                            onClick={resetFilters}
                            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                        >
                            Clear All
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
} 