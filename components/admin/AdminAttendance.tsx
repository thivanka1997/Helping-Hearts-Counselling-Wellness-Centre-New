'use client';
import React, { useState } from 'react';
import { AttendanceRecord, Course } from '@/src/types';
import { UserCheck, Printer, Search, Download, Filter } from 'lucide-react';

interface AdminAttendanceProps {
  attendance: AttendanceRecord[];
  courses: Course[];
}

export const AdminAttendance: React.FC<AdminAttendanceProps> = ({ attendance, courses }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All');

  const filtered = attendance.filter((a) => {
    const matchesSearch =
      a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.sessionTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === 'All' || a.courseTitle === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Comprehensive Attendance Logs</h1>
          <p className="text-xs text-slate-500">Monitor and export student attendance logs across all active diploma programs.</p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-xl bg-teal-800 text-white font-bold text-xs shadow-xs flex items-center gap-2 print:hidden"
        >
          <Printer className="w-4 h-4 text-amber-300" /> Export / Print Report
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xs print:hidden">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name or session title..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-600"
          />
        </div>

        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="p-2 rounded-xl border border-slate-300 text-xs bg-white font-bold"
        >
          <option value="All">All Courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.title}>{c.title}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-900 uppercase font-bold text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-4">Student Name</th>
                <th className="p-4">Course</th>
                <th className="p-4">Session Title</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Marked By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((att) => (
                <tr key={att.id} className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">{att.studentName}</td>
                  <td className="p-4 text-slate-600">{att.courseTitle}</td>
                  <td className="p-4 font-semibold text-slate-800">{att.sessionTitle}</td>
                  <td className="p-4 font-mono text-slate-600">{att.sessionDate}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        att.status === 'Present'
                          ? 'bg-emerald-100 text-emerald-800'
                          : att.status === 'Late'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {att.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500">{att.markedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
