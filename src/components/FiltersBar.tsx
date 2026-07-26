import React from 'react';
import { Search, Filter, RotateCcw, Building2, Calendar, MapPin, Hash } from 'lucide-react';
import { LeadFilter } from '../types';

interface FiltersBarProps {
  filter: LeadFilter;
  setFilter: React.Dispatch<React.SetStateAction<LeadFilter>>;
  totalCount: number;
  filteredCount: number;
  availableStates: string[];
  availableDates: string[];
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
  filter,
  setFilter,
  totalCount,
  filteredCount,
  availableStates,
  availableDates,
}) => {
  const handleReset = () => {
    setFilter({
      search: '',
      zipCodePrefix: '',
      state: '',
      status: '',
      minSqFt: null,
      maxSqFt: null,
      moveDate: '',
      sortBy: 'zipCode',
      sortOrder: 'asc',
    });
  };

  const isFiltered =
    Boolean(filter.search) ||
    Boolean(filter.zipCodePrefix) ||
    Boolean(filter.state) ||
    Boolean(filter.status) ||
    filter.minSqFt !== null ||
    filter.maxSqFt !== null ||
    Boolean(filter.moveDate);

  return (
    <div id="filters-container" className="bg-white border-b border-slate-200 p-4 shadow-xs">
      <div className="max-w-7xl mx-auto space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search Input */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="input-search"
              type="text"
              placeholder="Search name, phone, ZIP, city, notes..."
              value={filter.search}
              onChange={(e) => setFilter((prev) => ({ ...prev, search: e.target.value }))}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* ZIP Code / ZIP Prefix filter */}
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="input-zip-filter"
              type="text"
              placeholder="Filter by ZIP (e.g. 902, 10023)..."
              value={filter.zipCodePrefix}
              onChange={(e) => setFilter((prev) => ({ ...prev, zipCodePrefix: e.target.value }))}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* State Filter */}
          <div className="relative">
            <select
              id="select-state-filter"
              value={filter.state}
              onChange={(e) => setFilter((prev) => ({ ...prev, state: e.target.value }))}
              className="w-full pr-8 pl-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-700 appearance-none cursor-pointer"
            >
              <option value="">All States ({availableStates.length})</option>
              {availableStates.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
              ▼
            </div>
          </div>

          {/* Move Date Filter */}
          <div className="relative">
            <select
              id="select-date-filter"
              value={filter.moveDate}
              onChange={(e) => setFilter((prev) => ({ ...prev, moveDate: e.target.value }))}
              className="w-full pr-8 pl-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-700 appearance-none cursor-pointer"
            >
              <option value="">All Next Week Dates</option>
              {availableDates.map((dateStr) => {
                const dateObj = new Date(dateStr + 'T00:00:00');
                const formatted = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                return (
                  <option key={dateStr} value={dateStr}>
                    {formatted} ({dateStr})
                  </option>
                );
              })}
            </select>
            <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
              ▼
            </div>
          </div>

          {/* Outreach Status Filter */}
          <div className="relative">
            <select
              id="select-status-filter"
              value={filter.status}
              onChange={(e) => setFilter((prev) => ({ ...prev, status: e.target.value }))}
              className="w-full pr-8 pl-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-700 appearance-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="New">New Lead</option>
              <option value="Contacted">Contacted</option>
              <option value="Quote Sent">Quote Sent</option>
              <option value="Follow Up">Follow Up</option>
              <option value="Booked">Booked</option>
              <option value="Not Interested">Not Interested</option>
            </select>
            <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
              ▼
            </div>
          </div>
        </div>

        {/* Row 2: Sq Ft Quick Filter & Active Stats */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
          <div className="flex flex-wrap items-center gap-2 text-slate-600">
            <span className="font-semibold text-slate-700 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              Sq. Ft. Range:
            </span>

            <button
              id="filter-sqft-all"
              onClick={() => setFilter((prev) => ({ ...prev, minSqFt: null, maxSqFt: null }))}
              className={`px-2.5 py-1 rounded-md text-xs font-medium border transition cursor-pointer ${
                filter.minSqFt === null && filter.maxSqFt === null
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              All Sizes
            </button>

            <button
              id="filter-sqft-small"
              onClick={() => setFilter((prev) => ({ ...prev, minSqFt: 0, maxSqFt: 1000 }))}
              className={`px-2.5 py-1 rounded-md text-xs font-medium border transition cursor-pointer ${
                filter.minSqFt === 0 && filter.maxSqFt === 1000
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              &lt; 1,000 sq ft (Apartments)
            </button>

            <button
              id="filter-sqft-medium"
              onClick={() => setFilter((prev) => ({ ...prev, minSqFt: 1000, maxSqFt: 2200 }))}
              className={`px-2.5 py-1 rounded-md text-xs font-medium border transition cursor-pointer ${
                filter.minSqFt === 1000 && filter.maxSqFt === 2200
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              1,000 - 2,200 sq ft (Medium)
            </button>

            <button
              id="filter-sqft-large"
              onClick={() => setFilter((prev) => ({ ...prev, minSqFt: 2200, maxSqFt: 10000 }))}
              className={`px-2.5 py-1 rounded-md text-xs font-medium border transition cursor-pointer ${
                filter.minSqFt === 2200
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              2,200+ sq ft (Large Houses)
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500 font-medium">
              Showing <strong className="text-slate-800">{filteredCount}</strong> of {totalCount} leads
            </span>

            {isFiltered && (
              <button
                id="btn-reset-filters"
                onClick={handleReset}
                className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
