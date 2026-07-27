import React from 'react';
import { Download, Copy, Plus, MapPin, Table, BarChart3, Check, Sparkles, Truck, Clock, Star } from 'lucide-react';
import { MovingLead } from '../types';
import { convertLeadsToCSV, downloadCSV } from '../utils/csv';

interface HeaderProps {
  leads: MovingLead[];
  filteredCount: number;
  viewMode: 'table' | 'zip-clusters' | 'analytics' | 'reviews';
  setViewMode: (mode: 'table' | 'zip-clusters' | 'analytics' | 'reviews') => void;
  onOpenAddModal: () => void;
  onCopySuccess: () => void;
  copied: boolean;
  onOpenPurchaseModal: (lead?: MovingLead | null) => void;
}

export const Header: React.FC<HeaderProps> = ({
  leads,
  filteredCount,
  viewMode,
  setViewMode,
  onOpenAddModal,
  onCopySuccess,
  copied,
  onOpenPurchaseModal,
}) => {
  const handleDownloadCSV = () => {
    const csvData = convertLeadsToCSV(leads);
    downloadCSV(csvData, `Moving_Leads_Next_Week_150_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const handleCopyCSV = () => {
    const csvData = convertLeadsToCSV(leads);
    navigator.clipboard.writeText(csvData);
    onCopySuccess();
  };

  const totalSqFt = leads.reduce((acc, lead) => acc + lead.sqFt, 0);
  const avgSqFt = Math.round(totalSqFt / (leads.length || 1));

  return (
    <header id="app-header" className="bg-white border-b border-slate-200 text-slate-900 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Top row: Brand & Primary Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-xl shadow-sm">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold tracking-tight text-slate-800">Moving Leads For Sale - <span className="text-indigo-600 font-extrabold">MovingLeadsForSale.Org</span></h1>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Next Month Moves (August 2026)
                </span>
              </div>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-0.5">
                {leads.length} Verified USA Leads (50 States) • ZIP Code & Sq Ft Clusters
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => onOpenPurchaseModal(null)}
              id="btn-cashapp-purchase-header"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-bold bg-[#00D632] hover:bg-[#00B82B] text-white shadow-sm transition-all cursor-pointer border border-[#00C22B]"
              title="Direct Lead Purchase ($75) via Cash App $Movers312"
            >
              <span className="font-mono text-sm font-extrabold">$</span>
              <span>Cash App Purchase ($75 - $Movers312)</span>
            </button>

            <button
              id="btn-copy-csv"
              onClick={handleCopyCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors cursor-pointer shadow-sm"
              title="Copy formatted CSV data to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copy CSV</span>
                </>
              )}
            </button>

            <button
              id="btn-export-csv"
              onClick={handleDownloadCSV}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV ({filteredCount})</span>
            </button>

            <button
              id="btn-add-lead"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Lead</span>
            </button>
          </div>
        </div>

        {/* Lead Delivery Notice Banner */}
        <div className="mt-3 bg-amber-50 border border-amber-200/80 rounded-lg px-3.5 py-2 flex items-center gap-2 text-xs text-amber-900 font-medium">
          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
          <span><strong>Notice:</strong> All purchased leads will be emailed to you within 24 to 48 hours after payment completion.</span>
        </div>

        {/* Bottom row: Quick stats & View mode switcher */}
        <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Leads:</span>
              <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {leads.length}
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Sq. Ft:</span>
              <span className="font-mono font-semibold text-indigo-600">{totalSqFt.toLocaleString()} sq ft</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase">Avg Residence:</span>
              <span className="font-mono font-semibold text-slate-700">{avgSqFt.toLocaleString()} sq ft</span>
            </div>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-md border border-slate-200">
            <button
              id="view-mode-table"
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Spreadsheet Grid</span>
            </button>

            <button
              id="view-mode-zip"
              onClick={() => setViewMode('zip-clusters')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'zip-clusters'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>ZIP Code Groups</span>
            </button>

            <button
              id="view-mode-analytics"
              onClick={() => setViewMode('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'analytics'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics & Summary</span>
            </button>

            <button
              id="view-mode-reviews"
              onClick={() => setViewMode('reviews')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'reviews'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Reviews (100)</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
