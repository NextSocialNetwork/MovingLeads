import React, { useState } from 'react';
import {
  ArrowUpDown,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckSquare,
  Square,
  FileSpreadsheet
} from 'lucide-react';
import { MovingLead, OutreachStatus, LeadFilter } from '../types';
import { maskEmail } from '../utils/csv';

interface LeadTableProps {
  leads: MovingLead[];
  onSelectLead: (lead: MovingLead) => void;
  onUpdateStatus: (id: string, newStatus: OutreachStatus) => void;
  filter: LeadFilter;
  setFilter: React.Dispatch<React.SetStateAction<LeadFilter>>;
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  onOpenPitch: (lead: MovingLead) => void;
}

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  onSelectLead,
  onUpdateStatus,
  filter,
  setFilter,
  selectedIds,
  setSelectedIds,
  onOpenPitch,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  const totalPages = Math.ceil(leads.length / pageSize) || 1;
  const paginatedLeads = leads.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field: keyof MovingLead) => {
    if (filter.sortBy === field) {
      setFilter((prev) => ({ ...prev, sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' }));
    } else {
      setFilter((prev) => ({ ...prev, sortBy: field, sortOrder: 'asc' }));
    }
  };

  const handleSelectAllOnPage = () => {
    const pageIds = paginatedLeads.map((l) => l.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const getStatusBadgeClass = (status: OutreachStatus) => {
    switch (status) {
      case 'New':
        return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
      case 'Contacted':
        return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100';
      case 'Quote Sent':
        return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100';
      case 'Follow Up':
        return 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100';
      case 'Booked':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100';
      case 'Not Interested':
        return 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    if (urgency === 'High') {
      return <span className="inline-block w-2 h-2 rounded-full bg-rose-500 mr-1.5" title="High Urgency" />;
    }
    if (urgency === 'Medium') {
      return <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-1.5" title="Medium Urgency" />;
    }
    return <span className="inline-block w-2 h-2 rounded-full bg-slate-300 mr-1.5" title="Standard Urgency" />;
  };

  return (
    <div id="lead-table-wrapper" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Cash App Purchase Header Banner */}
      <div className="bg-[#00D632]/10 border-b border-[#00D632]/25 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg bg-[#00D632] text-white font-mono font-black flex items-center justify-center text-sm shadow-xs">$</span>
          <div>
            <p className="font-bold text-xs text-slate-900">Instant Lead Dataset Purchase ($75): <span className="font-mono text-emerald-800 font-extrabold">$Movers312</span></p>
            <p className="text-[11px] text-slate-600">Directly buy and unlock full uncensored leads data via Cash App for $75</p>
          </div>
        </div>
        <a
          href="https://Cash.App/$Movers312"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-1.5 bg-[#00D632] hover:bg-[#00B82B] text-white font-bold text-xs rounded-md shadow-xs transition-all inline-flex items-center gap-1 cursor-pointer border border-[#00C22B]"
        >
          <span className="font-mono font-black text-sm">$</span>
          <span>Buy via Cash App ($75 - $Movers312)</span>
        </a>
      </div>

      {/* Selection Banner */}
      {selectedIds.length > 0 && (
        <div className="bg-indigo-50 border-b border-indigo-100 px-4 py-2.5 flex items-center justify-between text-xs text-indigo-900">
          <div className="flex items-center gap-2 font-medium">
            <CheckSquare className="w-4 h-4 text-indigo-600" />
            <span>
              <strong>{selectedIds.length}</strong> lead{selectedIds.length > 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                selectedIds.forEach((id) => onUpdateStatus(id, 'Contacted'));
              }}
              className="px-2.5 py-1 bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded font-medium cursor-pointer"
            >
              Mark Selected as Contacted
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="text-slate-500 hover:text-slate-700 font-medium cursor-pointer underline"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Main Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/80 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              <th className="p-3 w-10 text-center">
                <button
                  onClick={handleSelectAllOnPage}
                  className="text-slate-400 hover:text-indigo-600 cursor-pointer"
                  title="Select all on this page"
                >
                  {paginatedLeads.every((l) => selectedIds.includes(l.id)) ? (
                    <CheckSquare className="w-4 h-4 text-indigo-600" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>

              <th className="p-3 cursor-pointer hover:bg-slate-200/60 transition" onClick={() => handleSort('zipCode')}>
                <div className="flex items-center gap-1">
                  <span>ZIP Code & City</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th className="p-3 cursor-pointer hover:bg-slate-200/60 transition" onClick={() => handleSort('fullName')}>
                <div className="flex items-center gap-1">
                  <span>Customer Lead Name</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th className="p-3 cursor-pointer hover:bg-slate-200/60 transition" onClick={() => handleSort('sqFt')}>
                <div className="flex items-center gap-1">
                  <span>Approx Sq. Ft.</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th className="p-3 cursor-pointer hover:bg-slate-200/60 transition" onClick={() => handleSort('moveDate')}>
                <div className="flex items-center gap-1">
                  <span>Move Date</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th className="p-3 cursor-pointer hover:bg-slate-200/60 transition" onClick={() => handleSort('destinationCity')}>
                <div className="flex items-center gap-1">
                  <span>Destination</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th className="p-3 cursor-pointer hover:bg-slate-200/60 transition" onClick={() => handleSort('status')}>
                <div className="flex items-center gap-1">
                  <span>Outreach Status</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th className="p-3 text-right pr-4">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
            {paginatedLeads.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-400">
                  <FileSpreadsheet className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="font-medium text-slate-600">No leads match your active filters.</p>
                  <p className="text-xs text-slate-400 mt-1">Try resetting search keywords or ZIP code prefix filters.</p>
                </td>
              </tr>
            ) : (
              paginatedLeads.map((lead) => {
                const isSelected = selectedIds.includes(lead.id);
                const moveDateObj = new Date(lead.moveDate + 'T00:00:00');
                const formattedDate = moveDateObj.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                });

                return (
                  <tr
                    key={lead.id}
                    onClick={() => onSelectLead(lead)}
                    className={`hover:bg-slate-50 transition cursor-pointer group ${
                      isSelected ? 'bg-indigo-50/40' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="p-3 text-center" onClick={(e) => toggleSelect(lead.id, e)}>
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-indigo-600 mx-auto" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-300 group-hover:text-slate-400 mx-auto" />
                      )}
                    </td>

                    {/* ZIP Code & City */}
                    <td className="p-3 font-medium text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="font-mono bg-slate-100 border border-slate-200 text-indigo-700 font-bold px-2 py-0.5 rounded text-xs">
                          {lead.zipCode}
                        </span>
                        <div>
                          <div className="text-slate-800 font-semibold">{lead.city}, {lead.state}</div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{lead.currentAddress}</div>
                        </div>
                      </div>
                    </td>

                    {/* Name & Contact */}
                    <td className="p-3">
                      <div className="flex items-center">
                        {getUrgencyBadge(lead.urgency)}
                        <span className="font-semibold text-slate-900 group-hover:text-indigo-600 transition">
                          {lead.fullName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mt-0.5">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span className="font-mono text-slate-500 font-medium">{maskEmail(lead.email)}</span>
                      </div>
                    </td>

                    {/* Sq. Ft. */}
                    <td className="p-3">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{lead.sqFt.toLocaleString()} sq ft</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {lead.residenceType} ({lead.bedrooms} bed)
                      </div>
                    </td>

                    {/* Move Date */}
                    <td className="p-3">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{formattedDate}</span>
                      </div>
                      <div className="text-[10px] text-indigo-600 font-medium">
                        Next Week • {lead.estimatedTruckSize}
                      </div>
                    </td>

                    {/* Destination */}
                    <td className="p-3">
                      <div className="text-slate-800 font-medium">
                        {lead.destinationCity}, {lead.destinationState}
                      </div>
                      <div className="text-[10px] text-slate-400">Est. Value: ${lead.estimatedValue.toLocaleString()}</div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={lead.status}
                        onChange={(e) => onUpdateStatus(lead.id, e.target.value as OutreachStatus)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-md border cursor-pointer appearance-none transition focus:outline-hidden ${getStatusBadgeClass(
                          lead.status
                        )}`}
                      >
                        <option value="New">New Lead</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Quote Sent">Quote Sent</option>
                        <option value="Follow Up">Follow Up</option>
                        <option value="Booked">Booked</option>
                        <option value="Not Interested">Not Interested</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-right pr-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenPitch(lead)}
                          className="p-1.5 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition cursor-pointer"
                          title="Generate AI Pitch & Move Script"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href="https://Cash.App/$Movers312"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-md bg-[#00D632] hover:bg-[#00B82B] text-white font-extrabold text-[11px] transition cursor-pointer inline-flex items-center gap-1 shadow-xs border border-[#00C22B]"
                          title="Buy Lead Direct for $75 via Cash App $Movers312"
                        >
                          <span className="font-mono text-xs">$</span>
                          <span>Cash App Buy ($75)</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {leads.length > 0 && (
        <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex items-center justify-between text-xs text-slate-600">
          <div>
            Showing <strong className="text-slate-900">{(currentPage - 1) * pageSize + 1}</strong> to{' '}
            <strong className="text-slate-900">{Math.min(currentPage * pageSize, leads.length)}</strong> of{' '}
            <strong className="text-slate-900">{leads.length}</strong> leads
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-700 px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
