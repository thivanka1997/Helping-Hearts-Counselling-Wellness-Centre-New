'use client';
import React, { useState } from 'react';
import { ClientAppointment } from '@/src/types';
import { Calendar, Lock, Phone, Mail, Clock, CheckCircle2, XCircle, Search, FileText } from 'lucide-react';

interface AdminAppointmentsProps {
  appointments: ClientAppointment[];
  onUpdateStatus: (id: string, status: ClientAppointment['status'], notes?: string) => void;
  onSuccessToast?: (msg: string) => void;
}

export const AdminAppointments: React.FC<AdminAppointmentsProps> = ({
  appointments,
  onUpdateStatus,
  onSuccessToast
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedApp, setSelectedApp] = useState<ClientAppointment | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  const filtered = appointments.filter((a) => {
    const matchesSearch =
      a.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.phone.includes(searchTerm) ||
      a.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id: string, status: ClientAppointment['status']) => {
    onUpdateStatus(id, status, adminNotes);
    onSuccessToast?.(`Appointment status updated to ${status}. Client records updated.`);
    setSelectedApp(null);
    setAdminNotes('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">Confidential Client Appointments</h1>
            <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1">
              <Lock className="w-3 h-3" /> Isolated Records
            </span>
          </div>
          <p className="text-xs text-slate-500">Manage therapy intake requests, schedule sessions, and enter private clinical notes.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search client name, phone, service..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Pending', 'Confirmed', 'Rescheduled', 'Completed', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === status
                  ? 'bg-teal-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-900 uppercase font-bold text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-4">Client Name & Phone</th>
                <th className="p-4">Requested Service</th>
                <th className="p-4">Preferred Slot</th>
                <th className="p-4">Format</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50">
                  <td className="p-4">
                    <p className="font-bold text-slate-900">{app.fullName}</p>
                    <p className="text-slate-500 font-mono">{app.phone} • {app.email}</p>
                  </td>
                  <td className="p-4 font-semibold text-slate-800">{app.serviceTitle}</td>
                  <td className="p-4">
                    <span className="font-bold text-slate-900">{app.preferredDate}</span>
                    <p className="text-slate-500">{app.preferredTime}</p>
                  </td>
                  <td className="p-4 font-bold text-teal-800">{app.sessionType}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        app.status === 'Confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'Pending'
                          ? 'bg-amber-100 text-amber-800'
                          : app.status === 'Rescheduled'
                          ? 'bg-blue-100 text-blue-800'
                          : app.status === 'Completed'
                          ? 'bg-slate-200 text-slate-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedApp(app);
                        setAdminNotes(app.adminNotes || '');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-teal-800 hover:bg-teal-900 text-white font-bold text-[11px]"
                    >
                      Manage Session
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Appointment Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-lg font-bold text-slate-900">Manage Client Appointment</h2>
              <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-mono font-bold">
                CONFIDENTIAL
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <p><strong>Client:</strong> {selectedApp.fullName} ({selectedApp.phone})</p>
              <p><strong>Service:</strong> {selectedApp.serviceTitle}</p>
              <p><strong>Preferred Slot:</strong> {selectedApp.preferredDate} at {selectedApp.preferredTime}</p>
              <p><strong>Format:</strong> {selectedApp.sessionType}</p>
              {selectedApp.notes && <p><strong>Client Intake Notes:</strong> {selectedApp.notes}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Private Admin & Clinical Notes
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
                placeholder="Internal desk notes regarding scheduling or intake status..."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-600"
              ></textarea>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 justify-end">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-3 py-2 rounded-xl text-slate-600 font-medium text-xs hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                onClick={() => handleStatusChange(selectedApp.id, 'Rescheduled')}
                className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                Mark Rescheduled
              </button>

              <button
                onClick={() => handleStatusChange(selectedApp.id, 'Confirmed')}
                className="px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
              >
                Confirm Session
              </button>

              <button
                onClick={() => handleStatusChange(selectedApp.id, 'Completed')}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs"
              >
                Mark Completed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
