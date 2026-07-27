import React, { useState } from 'react';
import { MapPin, Building2, Phone, Calendar, Download, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { MovingLead } from '../types';
import { convertLeadsToCSV, downloadCSV, maskEmail } from '../utils/csv';

interface ZipClustersProps {
  leads: MovingLead[];
  onSelectLead: (lead: MovingLead) => void;
  onOpenPitch: (lead: MovingLead) => void;
  onOpenPurchaseModal?: (lead?: MovingLead | null) => void;
}

interface ZipGroup {
  zipCode: string;
  city: string;
  state: string;
  leads: MovingLead[];
  totalSqFt: number;
  avgSqFt: number;
}

export const ZipClusters: React.FC<ZipClustersProps> = ({ leads, onSelectLead, onOpenPitch, onOpenPurchaseModal }) => {
  const [expandedZip, setExpandedZip] = useState<string | null>(null);

  // Group leads by ZIP code
  const groupsMap = leads.reduce((acc: Record<string, ZipGroup>, lead: MovingLead) => {
    const zip = lead.zipCode;
    if (!acc[zip]) {
      acc[zip] = {
        zipCode: zip,
        city: lead.city,
        state: lead.state,
        leads: [],
        totalSqFt: 0,
        avgSqFt: 0,
      };
    }
    acc[zip].leads.push(lead);
    acc[zip].totalSqFt += lead.sqFt;
    return acc;
  }, {} as Record<string, ZipGroup>);

  const zipGroups = (Object.values(groupsMap) as ZipGroup[])
    .map((g: ZipGroup) => ({
      ...g,
      avgSqFt: Math.round(g.totalSqFt / g.leads.length),
    }))
    .sort((a, b) => a.zipCode.localeCompare(b.zipCode));

  const toggleExpand = (zip: string) => {
    setExpandedZip((prev) => (prev === zip ? null : zip));
  };

  const exportZipCluster = (group: ZipGroup) => {
    const csv = convertLeadsToCSV(group.leads);
    downloadCSV(csv, `Moving_Leads_ZIP_${group.zipCode}_${group.city}.csv`);
  };

  return (
    <div id="zip-clusters-container" className="space-y-4">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-600" />
            Regional & ZIP Code Lead Dispatch Clusters ({zipGroups.length} Active ZIP Codes)
          </h2>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-1">
            Grouped for hyper-targeted regional sales calls and efficient mover scheduling next month (August 2026).
          </p>
        </div>
        <div className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-md border border-slate-200 font-mono font-bold">
          Top Cluster Density: {Math.max(...zipGroups.map((g) => g.leads.length), 0)} leads/ZIP
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {zipGroups.map((group) => {
          const isExpanded = expandedZip === group.zipCode;

          return (
            <div
              key={group.zipCode}
              className={`bg-white rounded-xl border transition shadow-xs overflow-hidden ${
                isExpanded ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Card Header */}
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold bg-indigo-600 text-white px-2 py-0.5 rounded shadow-xs">
                      ZIP {group.zipCode}
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {group.city}, {group.state}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                    <span>
                      <strong className="text-slate-800">{group.leads.length}</strong> lead{group.leads.length > 1 ? 's' : ''}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                      Total: {group.totalSqFt.toLocaleString()} sq ft
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => exportZipCluster(group)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition cursor-pointer"
                  title={`Export CSV for ZIP ${group.zipCode}`}
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              {/* Lead preview list inside cluster */}
              <div className="p-3 space-y-2">
                {group.leads.slice(0, isExpanded ? group.leads.length : 3).map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => onSelectLead(lead)}
                    className="p-2.5 rounded-lg border border-slate-100 bg-white hover:bg-indigo-50/50 hover:border-indigo-200 transition cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Active Lead" />
                        <span>{lead.fullName}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                          {lead.sqFt} sq ft
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span className="font-mono text-slate-500">{maskEmail(lead.email)}</span>
                        <span>•</span>
                        <span>Move: {lead.moveDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenPitch(lead);
                        }}
                        className="p-1 rounded bg-indigo-50 text-indigo-600 hover:bg-indigo-100 cursor-pointer"
                        title="AI Sales Script"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenPurchaseModal?.(lead);
                        }}
                        className="p-1 px-2 rounded bg-[#00D632] hover:bg-[#00B82B] text-white font-extrabold text-[10px] cursor-pointer inline-flex items-center gap-0.5 shadow-2xs border border-[#00C22B]"
                        title="Buy Lead for $75 via Cash App $Movers312"
                      >
                        <span className="font-mono font-black text-xs">$</span>
                        <span>$75 Buy</span>
                      </button>
                    </div>
                  </div>
                ))}

                {group.leads.length > 3 && (
                  <button
                    onClick={() => toggleExpand(group.zipCode)}
                    className="w-full text-center py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50/60 rounded-lg transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    {isExpanded ? (
                      <>
                        <span>Collapse Leads</span>
                        <ChevronUp className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        <span>View All {group.leads.length} Leads in ZIP {group.zipCode}</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
