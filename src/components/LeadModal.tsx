import React, { useState } from 'react';
import {
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building2,
  Sparkles,
  Truck,
  Copy,
  Check,
  Edit2,
  Save,
  DollarSign,
  Send,
  Loader2,
} from 'lucide-react';
import { MovingLead, OutreachStatus } from '../types';
import { maskEmail } from '../utils/csv';

interface LeadModalProps {
  lead: MovingLead | null;
  onClose: () => void;
  onUpdateLead: (updated: MovingLead) => void;
  initialTab?: 'details' | 'ai-pitch';
}

export const LeadModal: React.FC<LeadModalProps> = ({
  lead,
  onClose,
  onUpdateLead,
  initialTab = 'details',
}) => {
  if (!lead) return null;

  const [activeTab, setActiveTab] = useState<'details' | 'ai-pitch'>(initialTab);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLead, setEditedLead] = useState<MovingLead>({ ...lead });

  // AI Script state
  const [aiPitch, setAiPitch] = useState<string>('');
  const [isLoadingPitch, setIsLoadingPitch] = useState(false);
  const [pitchCopied, setPitchCopied] = useState(false);

  const handleSave = () => {
    onUpdateLead(editedLead);
    setIsEditing(false);
  };

  const handleGeneratePitch = async () => {
    setIsLoadingPitch(true);
    setAiPitch('');
    try {
      const res = await fetch('/api/generate-pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedLead),
      });

      if (!res.ok) {
        throw new Error('Server returned an error generating pitch');
      }

      const data = await res.json();
      setAiPitch(data.script || 'Call script generated successfully.');
    } catch (err: any) {
      console.error('Failed to generate pitch:', err);
      // Fallback client script if server key not ready or error
      const fallbackScript = `### 📞 Phone Call Script
"Hi ${editedLead.fullName}, this is Metro Moving Specialists following up on your upcoming move scheduled for next week (${editedLead.moveDate}). 

We saw you're moving your ${editedLead.sqFt} sq. ft. home from ${editedLead.city}, ${editedLead.state} to ${editedLead.destinationCity}, ${editedLead.destinationState}. We have trucks scheduled in your ZIP code area (${editedLead.zipCode}) next week and can guarantee you our top crew and flat-rate binding quote! 

Are you free for 2 minutes to confirm your item inventory?"

### 📱 SMS Follow-Up
"Hi ${editedLead.fullName}! Need movers for your ${editedLead.moveDate} move from ${editedLead.city}? Get a free 2-min quote from Metro Movers: Reply YES or call us back!"

### 💡 Agent Quick Tips
- Mention the truck size: ${editedLead.estimatedTruckSize}
- Highlight special note: ${editedLead.notes}`;
      setAiPitch(fallbackScript);
    } finally {
      setIsLoadingPitch(false);
    }
  };

  const handleCopyPitch = () => {
    navigator.clipboard.writeText(aiPitch);
    setPitchCopied(true);
    setTimeout(() => setPitchCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-lg text-white">
              {lead.zipCode.slice(0, 3)}
            </div>
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span>{lead.fullName}</span>
                <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                  {lead.id}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                ZIP {lead.zipCode} • {lead.city}, {lead.state} • Move Date: {lead.moveDate}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 px-5 pt-2 flex gap-4 text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-2.5 px-1 border-b-2 transition cursor-pointer ${
              activeTab === 'details'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Lead Details & Edit
          </button>
          <button
            onClick={() => {
              setActiveTab('ai-pitch');
              if (!aiPitch) handleGeneratePitch();
            }}
            className={`pb-2.5 px-1 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ai-pitch'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Sales Pitch & Call Script</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {activeTab === 'details' ? (
            <div className="space-y-4">
              {/* Top Quick Actions */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href="https://Cash.App/$Movers312"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#00D632] hover:bg-[#00B82B] text-white rounded-lg font-bold transition shadow-xs cursor-pointer border border-[#00C22B]"
                    title="Buy this lead for $75 via Cash App $Movers312"
                  >
                    <span className="font-mono text-sm font-black">$</span>
                    <span>Purchase Lead ($75 via Cash App $Movers312)</span>
                  </a>
                  <a
                    href={`mailto:${lead.email}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-medium transition cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Lead</span>
                  </a>
                </div>

                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Lead Fields</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-semibold cursor-pointer shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                )}
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedLead.fullName}
                      onChange={(e) => setEditedLead({ ...editedLead, fullName: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                    />
                  ) : (
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-800 font-bold">{lead.fullName}</div>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedLead.email}
                      onChange={(e) => setEditedLead({ ...editedLead, email: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                    />
                  ) : (
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-800 font-mono font-semibold flex items-center justify-between">
                      <span>{maskEmail(lead.email)}</span>
                      <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-sans font-bold border border-amber-200">
                        Protected - $75 to Unlock
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Current Address & ZIP
                  </label>
                  {isEditing ? (
                    <div className="space-y-1">
                      <input
                        type="text"
                        value={editedLead.currentAddress}
                        onChange={(e) => setEditedLead({ ...editedLead, currentAddress: e.target.value })}
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                      />
                      <div className="grid grid-cols-3 gap-1">
                        <input
                          type="text"
                          placeholder="City"
                          value={editedLead.city}
                          onChange={(e) => setEditedLead({ ...editedLead, city: e.target.value })}
                          className="p-1.5 border border-slate-300 rounded"
                        />
                        <input
                          type="text"
                          placeholder="State"
                          value={editedLead.state}
                          onChange={(e) => setEditedLead({ ...editedLead, state: e.target.value })}
                          className="p-1.5 border border-slate-300 rounded"
                        />
                        <input
                          type="text"
                          placeholder="ZIP"
                          value={editedLead.zipCode}
                          onChange={(e) => setEditedLead({ ...editedLead, zipCode: e.target.value })}
                          className="p-1.5 border border-slate-300 rounded"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-800">
                      <div>{lead.currentAddress}</div>
                      <div className="font-semibold text-indigo-700">
                        {lead.city}, {lead.state} <span className="font-mono bg-indigo-100 px-1 py-0.2 rounded ml-1">ZIP {lead.zipCode}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Destination Location
                  </label>
                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Dest City"
                        value={editedLead.destinationCity}
                        onChange={(e) => setEditedLead({ ...editedLead, destinationCity: e.target.value })}
                        className="p-2 border border-slate-300 rounded-lg bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Dest State"
                        value={editedLead.destinationState}
                        onChange={(e) => setEditedLead({ ...editedLead, destinationState: e.target.value })}
                        className="p-2 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                  ) : (
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-800 font-semibold">
                      {lead.destinationCity}, {lead.destinationState}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Approx. Residence Square Footage
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedLead.sqFt}
                      onChange={(e) => setEditedLead({ ...editedLead, sqFt: Number(e.target.value) })}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                    />
                  ) : (
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-900 font-extrabold text-sm flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-indigo-600" />
                      <span>{lead.sqFt.toLocaleString()} sq. ft.</span>
                      <span className="text-xs text-slate-500 font-normal">({lead.residenceType})</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Potential Move Date (Next Week)
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editedLead.moveDate}
                      onChange={(e) => setEditedLead({ ...editedLead, moveDate: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                    />
                  ) : (
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-800 font-semibold flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                      <span>{lead.moveDate}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Outreach Status
                  </label>
                  <select
                    value={editedLead.status}
                    onChange={(e) => {
                      const newStatus = e.target.value as OutreachStatus;
                      setEditedLead({ ...editedLead, status: newStatus });
                      onUpdateLead({ ...editedLead, status: newStatus });
                    }}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white font-semibold text-slate-800 cursor-pointer"
                  >
                    <option value="New">New Lead</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Quote Sent">Quote Sent</option>
                    <option value="Follow Up">Follow Up</option>
                    <option value="Booked">Booked</option>
                    <option value="Not Interested">Not Interested</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Estimated Move Value ($)
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedLead.estimatedValue}
                      onChange={(e) => setEditedLead({ ...editedLead, estimatedValue: Number(e.target.value) })}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                    />
                  ) : (
                    <div className="p-2 bg-slate-50 rounded-lg text-emerald-700 font-bold">
                      ${lead.estimatedValue.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              {/* Special Notes */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Special Handling & Move Notes
                </label>
                {isEditing ? (
                  <textarea
                    rows={3}
                    value={editedLead.notes}
                    onChange={(e) => setEditedLead({ ...editedLead, notes: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  />
                ) : (
                  <div className="p-3 bg-slate-50 rounded-lg text-slate-700 border border-slate-200">
                    {lead.notes || 'No special instructions recorded.'}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Custom AI Call Script for {lead.fullName} ({lead.sqFt} sq ft)</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleGeneratePitch}
                    disabled={isLoadingPitch}
                    className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg font-medium border border-indigo-200 cursor-pointer transition disabled:opacity-50"
                  >
                    {isLoadingPitch ? (
                      <span className="flex items-center gap-1">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...
                      </span>
                    ) : (
                      'Regenerate Pitch'
                    )}
                  </button>

                  {aiPitch && (
                    <button
                      onClick={handleCopyPitch}
                      className="px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-lg font-medium cursor-pointer transition flex items-center gap-1"
                    >
                      {pitchCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{pitchCopied ? 'Copied' : 'Copy Script'}</span>
                    </button>
                  )}
                </div>
              </div>

              {isLoadingPitch ? (
                <div className="p-12 text-center text-slate-400 space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
                  <p className="font-semibold text-slate-700">Crafting personalized pitch using Gemini AI...</p>
                  <p className="text-xs text-slate-400">Tailoring script to move date {lead.moveDate} and {lead.sqFt} sq ft home.</p>
                </div>
              ) : (
                <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 font-sans leading-relaxed whitespace-pre-wrap space-y-2">
                  {aiPitch}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
