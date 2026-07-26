import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { FiltersBar } from './components/FiltersBar';
import { LeadTable } from './components/LeadTable';
import { ZipClusters } from './components/ZipClusters';
import { LeadStats } from './components/LeadStats';
import { LeadModal } from './components/LeadModal';
import { AddLeadModal } from './components/AddLeadModal';
import { INITIAL_LEADS } from './data/leads';
import { MovingLead, LeadFilter, OutreachStatus } from './types';

export default function App() {
  const [leads, setLeads] = useState<MovingLead[]>(INITIAL_LEADS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'zip-clusters' | 'analytics'>('table');
  const [copied, setCopied] = useState(false);

  // Filter state
  const [filter, setFilter] = useState<LeadFilter>({
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

  // Modal State
  const [selectedLead, setSelectedLead] = useState<MovingLead | null>(null);
  const [modalTab, setModalTab] = useState<'details' | 'ai-pitch'>('details');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Available dropdown options derived from dataset
  const availableStates = useMemo(() => {
    const statesSet = new Set(leads.map((l) => l.state));
    return Array.from(statesSet).sort();
  }, [leads]);

  const availableDates = useMemo(() => {
    const datesSet = new Set(leads.map((l) => l.moveDate));
    return Array.from(datesSet).sort();
  }, [leads]);

  // Filtering & Sorting
  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        // Search query
        if (filter.search.trim()) {
          const q = filter.search.toLowerCase().trim();
          const matches =
            lead.fullName.toLowerCase().includes(q) ||
            (lead.phone && lead.phone.includes(q)) ||
            lead.zipCode.includes(q) ||
            lead.city.toLowerCase().includes(q) ||
            lead.state.toLowerCase().includes(q) ||
            lead.destinationCity.toLowerCase().includes(q) ||
            lead.notes.toLowerCase().includes(q);
          if (!matches) return false;
        }

        // ZIP Code filter
        if (filter.zipCodePrefix.trim()) {
          const zipQ = filter.zipCodePrefix.trim();
          if (!lead.zipCode.startsWith(zipQ) && !lead.zipCode.includes(zipQ)) {
            return false;
          }
        }

        // State filter
        if (filter.state && lead.state !== filter.state) {
          return false;
        }

        // Status filter
        if (filter.status && lead.status !== filter.status) {
          return false;
        }

        // Move Date filter
        if (filter.moveDate && lead.moveDate !== filter.moveDate) {
          return false;
        }

        // Sq Ft Min/Max
        if (filter.minSqFt !== null && lead.sqFt < filter.minSqFt) {
          return false;
        }
        if (filter.maxSqFt !== null && lead.sqFt > filter.maxSqFt) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const field = filter.sortBy;
        let valA = a[field];
        let valB = b[field];

        if (typeof valA === 'string' && typeof valB === 'string') {
          const comparison = valA.localeCompare(valB);
          return filter.sortOrder === 'asc' ? comparison : -comparison;
        } else if (typeof valA === 'number' && typeof valB === 'number') {
          return filter.sortOrder === 'asc' ? valA - valB : valB - valA;
        }
        return 0;
      });
  }, [leads, filter]);

  // Handlers
  const handleUpdateStatus = (id: string, newStatus: OutreachStatus) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, status: newStatus } : lead))
    );
  };

  const handleUpdateLead = (updatedLead: MovingLead) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead))
    );
  };

  const handleAddLead = (newLead: MovingLead) => {
    setLeads((prev) => [newLead, ...prev]);
  };

  const handleOpenPitch = (lead: MovingLead) => {
    setSelectedLead(lead);
    setModalTab('ai-pitch');
  };

  const handleSelectLeadDetails = (lead: MovingLead) => {
    setSelectedLead(lead);
    setModalTab('details');
  };

  const handleCopySuccess = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans antialiased flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header
        leads={leads}
        filteredCount={filteredLeads.length}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onCopySuccess={handleCopySuccess}
        copied={copied}
      />

      {/* Filter Toolbar */}
      <FiltersBar
        filter={filter}
        setFilter={setFilter}
        totalCount={leads.length}
        filteredCount={filteredLeads.length}
        availableStates={availableStates}
        availableDates={availableDates}
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {viewMode === 'table' && (
          <LeadTable
            leads={filteredLeads}
            onSelectLead={handleSelectLeadDetails}
            onUpdateStatus={handleUpdateStatus}
            filter={filter}
            setFilter={setFilter}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            onOpenPitch={handleOpenPitch}
          />
        )}

        {viewMode === 'zip-clusters' && (
          <ZipClusters
            leads={filteredLeads}
            onSelectLead={handleSelectLeadDetails}
            onOpenPitch={handleOpenPitch}
          />
        )}

        {viewMode === 'analytics' && <LeadStats leads={filteredLeads} />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 pb-16 sm:pb-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Moving Leads Engine • <strong className="text-slate-700">{leads.length} Verified USA Leads (All 50 States)</strong>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <span>Direct Purchase ($75):</span>
            <a
              href="https://Cash.App/$Movers312"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00B82B] font-bold hover:underline font-mono"
            >
              https://Cash.App/$Movers312
            </a>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile/Desktop Cash App Purchase Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-slate-900 text-white py-2.5 px-4 z-40 shadow-xl border-t border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-[#00D632] text-white font-mono font-black text-xs flex items-center justify-center">$</span>
          <span className="text-xs font-semibold text-slate-200">
            Order Complete Dataset ({leads.length} Leads in 50 States): <span className="text-[#00D632] font-mono font-bold">$75 via $Movers312</span>
          </span>
        </div>
        <a
          href="https://Cash.App/$Movers312"
          target="_blank"
          rel="noopener noreferrer"
          id="btn-sticky-cashapp"
          className="px-3.5 py-1.5 bg-[#00D632] hover:bg-[#00B82B] text-white rounded-md text-xs font-bold transition shadow-sm whitespace-nowrap cursor-pointer border border-[#00C22B] flex items-center gap-1"
        >
          <span className="font-mono text-xs">$</span>
          <span>Cash App Direct Order ($75)</span>
        </a>
      </div>

      {/* Lead Detail & AI Call Pitch Drawer/Modal */}
      {selectedLead && (
        <LeadModal
          lead={selectedLead}
          initialTab={modalTab}
          onClose={() => setSelectedLead(null)}
          onUpdateLead={handleUpdateLead}
        />
      )}

      {/* Add New Lead Modal */}
      <AddLeadModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddLead={handleAddLead}
        existingCount={leads.length}
      />
    </div>
  );
}
