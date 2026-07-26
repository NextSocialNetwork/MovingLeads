import React from 'react';
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  MapPin,
  TrendingUp,
  Truck,
  Users,
} from 'lucide-react';
import { MovingLead } from '../types';

interface LeadStatsProps {
  leads: MovingLead[];
}

export const LeadStats: React.FC<LeadStatsProps> = ({ leads }) => {
  const totalLeads = leads.length;
  const totalSqFt = leads.reduce((acc, l) => acc + l.sqFt, 0);
  const avgSqFt = Math.round(totalSqFt / (totalLeads || 1));
  const totalValue = leads.reduce((acc, l) => acc + l.estimatedValue, 0);

  // Status breakdown
  const statusCounts = leads.reduce((acc: Record<string, number>, l: MovingLead) => {
    acc[l.status] = (acc[l.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Sq Ft tiers
  const smallSqFt = leads.filter((l) => l.sqFt < 1000).length;
  const mediumSqFt = leads.filter((l) => l.sqFt >= 1000 && l.sqFt < 2200).length;
  const largeSqFt = leads.filter((l) => l.sqFt >= 2200).length;

  // Residence types
  const resTypeCounts = leads.reduce((acc: Record<string, number>, l: MovingLead) => {
    acc[l.residenceType] = (acc[l.residenceType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Move dates
  const dateCounts = leads.reduce((acc: Record<string, number>, l: MovingLead) => {
    acc[l.moveDate] = (acc[l.moveDate] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div id="analytics-container" className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Total Leads</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{totalLeads}</div>
          <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> 100% Verified Next Week Moves
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Total Sq. Footage</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{totalSqFt.toLocaleString()} sq ft</div>
          <div className="text-xs text-slate-500 mt-1">
            Avg: <strong className="text-slate-700">{avgSqFt.toLocaleString()} sq ft</strong> per home
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Est. Move Value</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">${totalValue.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-1">
            Avg: <strong className="text-slate-700">${Math.round(totalValue / (totalLeads || 1))}</strong> / job quote
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Booked Revenue</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            ${leads.filter((l) => l.status === 'Booked').reduce((a, b) => a + b.estimatedValue, 0).toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {statusCounts['Booked'] || 0} Jobs Confirmed for Next Week
          </div>
        </div>
      </div>

      {/* Grid Row 2: Sq Ft Tiers & Residence Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Residence Square Footage Tiers */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-600" />
            Residence Square Footage Distribution
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Small (&lt; 1,000 sq ft) - Apartments / Studios</span>
                <span>{smallSqFt} leads ({Math.round((smallSqFt / totalLeads) * 100)}%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${(smallSqFt / totalLeads) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Medium (1,000 - 2,200 sq ft) - Condos / Townhouses</span>
                <span>{mediumSqFt} leads ({Math.round((mediumSqFt / totalLeads) * 100)}%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${(mediumSqFt / totalLeads) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Large (2,200+ sq ft) - Single Family Homes</span>
                <span>{largeSqFt} leads ({Math.round((largeSqFt / totalLeads) * 100)}%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${(largeSqFt / totalLeads) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Outreach Pipeline Status */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            Outreach Pipeline Breakdown
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100">
              <div className="text-xs text-blue-700 font-medium">New Leads</div>
              <div className="text-xl font-bold text-blue-900 mt-1">{statusCounts['New'] || 0}</div>
            </div>

            <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-100">
              <div className="text-xs text-amber-700 font-medium">Contacted</div>
              <div className="text-xl font-bold text-amber-900 mt-1">{statusCounts['Contacted'] || 0}</div>
            </div>

            <div className="p-3 bg-purple-50/60 rounded-lg border border-purple-100">
              <div className="text-xs text-purple-700 font-medium">Quote Sent</div>
              <div className="text-xl font-bold text-purple-900 mt-1">{statusCounts['Quote Sent'] || 0}</div>
            </div>

            <div className="p-3 bg-orange-50/60 rounded-lg border border-orange-100">
              <div className="text-xs text-orange-700 font-medium">Follow Up</div>
              <div className="text-xl font-bold text-orange-900 mt-1">{statusCounts['Follow Up'] || 0}</div>
            </div>

            <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-100">
              <div className="text-xs text-emerald-700 font-medium">Booked</div>
              <div className="text-xl font-bold text-emerald-900 mt-1">{statusCounts['Booked'] || 0}</div>
            </div>

            <div className="p-3 bg-slate-100 rounded-lg border border-slate-200">
              <div className="text-xs text-slate-600 font-medium">Not Interested</div>
              <div className="text-xl font-bold text-slate-800 mt-1">{statusCounts['Not Interested'] || 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Next Week Move Schedule Breakdown */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-600" />
          Next Week Daily Move Volume Schedule
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {Object.entries(dateCounts)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([dateStr, count]) => {
              const d = new Date(dateStr + 'T00:00:00');
              const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
              const dayNum = d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });

              return (
                <div key={dateStr} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <div className="text-xs font-bold text-indigo-700">{dayName}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{dayNum}</div>
                  <div className="text-lg font-extrabold text-slate-900 mt-1">{count}</div>
                  <div className="text-[10px] text-slate-500">moves</div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
