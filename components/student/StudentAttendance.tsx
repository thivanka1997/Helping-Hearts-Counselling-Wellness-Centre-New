'use client';
import React from 'react';
import { User, AttendanceRecord } from '@/src/types';
import { UserCheck, Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface StudentAttendanceProps {
  user: User;
  attendance: AttendanceRecord[];
}

export const StudentAttendance: React.FC<StudentAttendanceProps> = ({ user, attendance }) => {
  const studentAtt = attendance.filter((a) => a.studentName === user.name || a.studentId === 'std-1');
  const presentCount = studentAtt.filter((a) => a.status === 'Present').length;
  const percentage = studentAtt.length > 0 ? Math.round((presentCount / studentAtt.length) * 100) : 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800 shadow-lg">
        <div>
          <span className="text-xs font-bold text-teal-400 uppercase bg-teal-900/80 px-3 py-1 rounded-full border border-teal-700">
            Attendance Log
          </span>
          <h1 className="text-2xl font-black mt-2">Attendance & Participation History</h1>
          <p className="text-xs text-slate-300">Official record logged by course lecturers.</p>
        </div>

        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 text-center min-w-[160px]">
          <span className="text-xs text-slate-400 block font-medium">Overall Attendance</span>
          <span className="text-2xl font-black text-amber-300">{percentage}%</span>
        </div>
      </div>

      {/* Table / Cards */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Session Logs</h2>
          <span className="text-xs text-slate-500 font-mono">{studentAtt.length} Total Sessions Recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-900 uppercase font-bold text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Session Title</th>
                <th className="p-4">Course</th>
                <th className="p-4">Status</th>
                <th className="p-4">Marked By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {studentAtt.map((att) => (
                <tr key={att.id} className="hover:bg-slate-50">
                  <td className="p-4 font-mono text-slate-600">{att.sessionDate}</td>
                  <td className="p-4 font-bold text-slate-900">{att.sessionTitle}</td>
                  <td className="p-4 text-slate-600">{att.courseTitle}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 font-bold px-2.5 py-1 rounded-full text-[10px] uppercase ${
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
