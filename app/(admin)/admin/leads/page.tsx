'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  FileText,
  Download,
  Search,
  Phone,
  MessageCircle,
  ExternalLink,
  Users,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Filter,
  GraduationCap
} from 'lucide-react';

interface MarketingLeadData {
  _id?: string;
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  district: string;
  medium: 'Sinhala' | 'Tamil' | 'English';
  counsellingInterest: string;
  learningMode: string;
  source: string;
  guideName: string;
  downloaded: boolean;
  submittedAt: string;
  createdAt?: string;
}

export default function AdminMarketingLeadsPage() {
  const [leads, setLeads] = useState<MarketingLeadData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMedium, setFilterMedium] = useState('ALL');
  const [filterInterest, setFilterInterest] = useState('ALL');
  const [filterDistrict, setFilterDistrict] = useState('ALL');

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      if (data.success && Array.isArray(data.leads)) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error('Failed to load leads:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const matchesSearch =
        !searchQuery.trim() ||
        l.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.phone.includes(searchQuery) ||
        l.district.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesMedium = filterMedium === 'ALL' || l.medium === filterMedium;
      const matchesInterest = filterInterest === 'ALL' || l.counsellingInterest === filterInterest;
      const matchesDistrict = filterDistrict === 'ALL' || l.district === filterDistrict;

      return matchesSearch && matchesMedium && matchesInterest && matchesDistrict;
    });
  }, [leads, searchQuery, filterMedium, filterInterest, filterDistrict]);

  // Metrics
  const totalLeads = leads.length;
  const highIntentLeads = leads.filter((l) => l.counsellingInterest === 'Yes, definitely').length;
  const sinhalaCount = leads.filter((l) => l.medium === 'Sinhala').length;
  const tamilCount = leads.filter((l) => l.medium === 'Tamil').length;
  const englishCount = leads.filter((l) => l.medium === 'English').length;

  const uniqueDistricts = useMemo(() => {
    return Array.from(new Set(leads.map((l) => l.district).filter(Boolean))).sort();
  }, [leads]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-800">
              Marketing Campaign Hub
            </span>
            <span className="text-xs text-slate-400">• Lead Generation Funnel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Marketing Leads & Guide Downloads</h1>
          <p className="text-xs text-slate-300">
            Leads captured from Facebook Groups, Instagram, and social marketing campaigns for the Counselling Guide.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={fetchLeads}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <a
            href="/api/leads/export"
            download="helping_hearts_leads.csv"
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export to CSV (Excel)</span>
          </a>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Guide Leads</span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{totalLeads}</p>
          <span className="text-slate-500 text-[11px]">Submissions Captured</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-600 block">High Intent Leads</span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-700">{highIntentLeads}</p>
          <span className="text-emerald-700 text-[11px]">Ready for Diploma Training</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Language Breakdown</span>
          <div className="flex items-center gap-2 pt-1 font-bold text-xs">
            <span className="text-teal-700">Sinhala: {sinhalaCount}</span>
            <span>•</span>
            <span className="text-blue-700">Tamil: {tamilCount}</span>
          </div>
          <span className="text-slate-500 text-[10px]">English: {englishCount}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Lead Campaign URL</span>
          <Link
            href="/guide"
            target="_blank"
            className="text-xs font-bold text-teal-800 hover:underline flex items-center gap-1 pt-1 truncate"
          >
            <span>/guide</span>
            <ExternalLink className="w-3 h-3 shrink-0" />
          </Link>
          <span className="text-[10px] text-slate-500">Live Funnel Link</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, or district..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {/* Medium filter */}
          <select
            value={filterMedium}
            onChange={(e) => setFilterMedium(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 text-xs bg-slate-50 text-slate-700 outline-none"
          >
            <option value="ALL">All Mediums</option>
            <option value="Sinhala">Sinhala</option>
            <option value="Tamil">Tamil</option>
            <option value="English">English</option>
          </select>

          {/* Interest filter */}
          <select
            value={filterInterest}
            onChange={(e) => setFilterInterest(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 text-xs bg-slate-50 text-slate-700 outline-none"
          >
            <option value="ALL">All Interests</option>
            <option value="Yes, definitely">Yes, definitely</option>
            <option value="Maybe / Need more information">Maybe / Need Info</option>
            <option value="Just interested in the guide">Guide only</option>
          </select>

          {/* District filter */}
          <select
            value={filterDistrict}
            onChange={(e) => setFilterDistrict(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 text-xs bg-slate-50 text-slate-700 outline-none"
          >
            <option value="ALL">All Districts ({uniqueDistricts.length})</option>
            {uniqueDistricts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Lead Name</th>
                <th className="py-3.5 px-4">WhatsApp Contact</th>
                <th className="py-3.5 px-4">District</th>
                <th className="py-3.5 px-4">Medium</th>
                <th className="py-3.5 px-4">Training Interest</th>
                <th className="py-3.5 px-4">Mode</th>
                <th className="py-3.5 px-4">Source</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Direct Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => {
                  const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
                  const formattedPhone = cleanPhone.startsWith('94')
                    ? cleanPhone
                    : cleanPhone.startsWith('0')
                    ? `94${cleanPhone.substring(1)}`
                    : `94${cleanPhone}`;

                  const waText = encodeURIComponent(
                    `Hello ${lead.fullName}, thank you for downloading the Helping Hearts Counselling Guide! ` +
                    `This is Helping Hearts Counselling & Wellness Centre. We noticed you selected ${lead.medium} medium. ` +
                    `Would you like information on our upcoming Diploma batch?`
                  );
                  const directWaUrl = `https://wa.me/${formattedPhone}?text=${waText}`;

                  return (
                    <tr key={lead.id || lead._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div>{lead.fullName}</div>
                        {lead.email && <div className="text-[10px] text-slate-400 font-normal">{lead.email}</div>}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
                        {lead.phone}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{lead.district}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          lead.medium === 'Sinhala'
                            ? 'bg-amber-100 text-amber-800'
                            : lead.medium === 'Tamil'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-teal-100 text-teal-800'
                        }`}>
                          {lead.medium}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          lead.counsellingInterest === 'Yes, definitely'
                            ? 'bg-emerald-100 text-emerald-800'
                            : lead.counsellingInterest.includes('Maybe')
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {lead.counsellingInterest}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        {lead.learningMode}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {lead.source}
                      </td>

                      <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                        {lead.submittedAt
                          ? new Date(lead.submittedAt).toLocaleDateString()
                          : 'Recent'}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <a
                          href={directWaUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-all cursor-pointer"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-400 italic">
                    {isLoading ? 'Loading marketing leads...' : 'No marketing leads found matching current filter.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
