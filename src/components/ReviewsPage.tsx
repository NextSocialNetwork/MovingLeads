import React, { useState, useMemo } from 'react';
import {
  Star,
  CheckCircle2,
  Building2,
  MapPin,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Award,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { REVIEWS_DATA, MovingCompanyReview } from '../data/reviews';
import { MovingLead } from '../types';

interface ReviewsPageProps {
  onOpenPurchaseModal: (lead?: MovingLead | MovingLead[] | null) => void;
}

const REVIEWS_PER_PAGE = 12;

export const ReviewsPage: React.FC<ReviewsPageProps> = ({ onOpenPurchaseModal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'revenue' | 'leads'>('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // Derive available states from review dataset
  const availableStates = useMemo(() => {
    const statesSet = new Set(REVIEWS_DATA.map((r) => r.state));
    return Array.from(statesSet).sort();
  }, []);

  // Filter & Sort
  const filteredReviews = useMemo(() => {
    return REVIEWS_DATA.filter((rev) => {
      // Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const matches =
          rev.companyName.toLowerCase().includes(q) ||
          rev.reviewerName.toLowerCase().includes(q) ||
          rev.city.toLowerCase().includes(q) ||
          rev.state.toLowerCase().includes(q) ||
          rev.reviewText.toLowerCase().includes(q) ||
          rev.reviewerRole.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // State Filter
      if (selectedState && rev.state !== selectedState) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'revenue') {
        const numA = parseInt(a.revenueGenerated.replace(/[^0-9]/g, ''), 10) || 0;
        const numB = parseInt(b.revenueGenerated.replace(/[^0-9]/g, ''), 10) || 0;
        return numB - numA;
      }
      if (sortBy === 'leads') {
        return b.leadsPurchased - a.leadsPurchased;
      }
      // default: newest first (id reverse or array index)
      return b.id.localeCompare(a.id);
    });
  }, [searchTerm, selectedState, sortBy]);

  // Pagination math
  const totalPages = Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE) || 1;
  const pageToDisplay = Math.min(currentPage, totalPages);

  const paginatedReviews = useMemo(() => {
    const startIdx = (pageToDisplay - 1) * REVIEWS_PER_PAGE;
    return filteredReviews.slice(startIdx, startIdx + REVIEWS_PER_PAGE);
  }, [filteredReviews, pageToDisplay]);

  // Reset page on filter change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedState(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as any);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      {/* Page Title & Hero Metrics Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-400/40 rounded-full text-amber-300 text-xs font-extrabold uppercase tracking-wider">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Verified Moving Company Reviews</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              100 5-Star Reviews from USA Moving Companies
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Read real feedback from certified moving companies, van line brokers, and dispatch managers across all 50 US states who grow their revenue with lead datasets from <strong className="text-white">MovingLeadsForSale.Org</strong>.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => onOpenPurchaseModal(null)}
              className="px-6 py-3.5 bg-[#00D632] hover:bg-[#00B82B] active:bg-[#009E25] text-white font-extrabold text-sm rounded-xl shadow-xl transition-all cursor-pointer border border-[#00C22B] flex items-center justify-center gap-2 group"
            >
              <span className="font-mono text-lg font-black">$</span>
              <span>Order Lead Package ($75)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Aggregate KPI Grid */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-200">
          <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-amber-400 mb-1">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs font-black text-white">5.0 / 5.0</span>
            </div>
            <p className="text-lg font-extrabold text-white font-mono">100 Reviews</p>
            <p className="text-[11px] text-slate-400">100% 5-Star Company Ratings</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl">
            <div className="flex items-center gap-1.5 text-indigo-400 mb-1">
              <MapPin className="w-4 h-4" />
              <span className="text-xs font-bold text-slate-300">USA Coverage</span>
            </div>
            <p className="text-lg font-extrabold text-white font-mono">50 States</p>
            <p className="text-[11px] text-slate-400">Coast-to-Coast Fleet Partners</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl">
            <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-bold text-slate-300">Verified Buyers</span>
            </div>
            <p className="text-lg font-extrabold text-white font-mono">100% Checked</p>
            <p className="text-[11px] text-slate-400">Authenticated Purchases</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl">
            <div className="flex items-center gap-1.5 text-indigo-400 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-bold text-slate-300">Lead Dataset Size</span>
            </div>
            <p className="text-lg font-extrabold text-white font-mono">150 Leads</p>
            <p className="text-[11px] text-slate-400">Full Access Per $75 Order</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by company name, city, state, or review text..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Controls Dropdowns */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* State Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <select
                value={selectedState}
                onChange={handleStateChange}
                className="py-2.5 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-700 font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="">All 50 US States</option>
                {availableStates.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="py-2.5 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-700 font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="leads">Sort: Most Leads Purchased</option>
            </select>
          </div>
        </div>

        {/* Results Counter Bar */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>
            Showing <strong className="text-slate-900 font-mono">{filteredReviews.length}</strong> verified reviews
            {selectedState ? ` in ${selectedState}` : ''}
            {searchTerm ? ` for "${searchTerm}"` : ''}
          </span>
          {filteredReviews.length > 0 && (
            <span>
              Page <strong className="text-slate-900 font-mono">{pageToDisplay}</strong> of{' '}
              <strong className="text-slate-900 font-mono">{totalPages}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Reviews Cards Grid */}
      {paginatedReviews.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No company reviews match your filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your search term or selecting "All 50 US States" from the state dropdown.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedState('');
              setSortBy('newest');
            }}
            className="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-xl hover:bg-indigo-100 transition cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Top Header Row: Stars & Verified Badge */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-1 font-mono">5.0</span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Verified Company</span>
                  </div>
                </div>

                {/* Company Name & Location */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors leading-snug">
                      {review.companyName}
                    </h3>
                    <span className="shrink-0 px-2 py-0.5 bg-slate-100 text-slate-700 font-mono text-[10px] font-bold rounded border border-slate-200">
                      {review.city}, {review.state}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>
                      {review.reviewerName} • <span className="italic text-slate-400">{review.reviewerRole}</span>
                    </span>
                  </p>
                </div>

                {/* Review Text */}
                <p className="text-xs text-slate-700 leading-relaxed italic bg-slate-50/80 p-3 rounded-xl border border-slate-150">
                  "{review.reviewText}"
                </p>
              </div>

              {/* Bottom Footer: ROI Metrics & Date */}
              <div className="mt-5 pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 font-semibold bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                    Batch: {review.leadsPurchased} Verified Leads
                  </span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Verified Purchase</span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{review.reviewDate}</span>
                  </span>
                  <span className="text-indigo-600 font-semibold hover:underline cursor-pointer" onClick={() => onOpenPurchaseModal(null)}>
                    Get Similar Leads →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={pageToDisplay === 1}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-1.5 overflow-x-auto max-w-[50vw] scrollbar-none">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
              // Show condensed page numbers if total pages is large
              if (
                totalPages > 8 &&
                Math.abs(pageNum - pageToDisplay) > 2 &&
                pageNum !== 1 &&
                pageNum !== totalPages
              ) {
                if (Math.abs(pageNum - pageToDisplay) === 3) {
                  return <span key={pageNum} className="text-slate-400 text-xs font-mono">...</span>;
                }
                return null;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold font-mono transition cursor-pointer flex items-center justify-center ${
                    pageNum === pageToDisplay
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={pageToDisplay === totalPages}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bottom Conversion CTA Banner */}
      <div className="bg-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400" />
            ))}
            <span className="text-xs font-extrabold text-emerald-200 ml-2">Rated #1 Lead Vendor in USA</span>
          </div>
          <h3 className="text-xl font-bold text-white">Ready to grow your moving company's monthly revenue?</h3>
          <p className="text-xs text-emerald-200 max-w-xl">
            Get 150 verified residential moving leads across all 50 states delivered straight to your email within 24–48 hours for just $75 via Cash App ($Movers312).
          </p>
        </div>

        <button
          onClick={() => onOpenPurchaseModal(null)}
          className="shrink-0 px-6 py-3.5 bg-[#00D632] hover:bg-[#00B82B] active:bg-[#009E25] text-white font-extrabold text-sm rounded-xl shadow-lg transition-all cursor-pointer border border-[#00C22B] flex items-center gap-2"
        >
          <span className="font-mono text-lg font-black">$</span>
          <span>Order Dataset Now ($75)</span>
        </button>
      </div>
    </div>
  );
};
