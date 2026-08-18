'use client';
import React, { useState } from 'react';
import { StudentRegistration, Course } from '@/src/types';
import { CreditCard, Eye, CheckCircle2, XCircle, Search, Filter, ShieldCheck, FileText, Key, Copy, Sparkles, RefreshCw, LogIn, UserCheck, Lock, ExternalLink, Check, UserPlus, Plus } from 'lucide-react';

interface AdminStudentsProps {
  registrations: StudentRegistration[];
  courses?: Course[];
  onUpdateStatus: (
    id: string,
    status: 'Approved' | 'Rejected',
    reason?: string,
    credentials?: { username?: string; password?: string }
  ) => void;
  onUpdateCredentials?: (id: string, username: string, password: string) => void;
  onAddStudent?: (newStudent: StudentRegistration) => void;
  onDirectLoginAsStudent?: (studentReg: StudentRegistration) => void;
  onSuccessToast?: (msg: string) => void;
}

export const AdminStudents: React.FC<AdminStudentsProps> = ({
  registrations,
  courses = [],
  onUpdateStatus,
  onUpdateCredentials,
  onAddStudent,
  onDirectLoginAsStudent,
  onSuccessToast
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [inspectingReg, setInspectingReg] = useState<StudentRegistration | null>(null);

  // Credential Edit State inside Inspection Modal
  const [editingUsername, setEditingUsername] = useState<string>('');
  const [editingPassword, setEditingPassword] = useState<string>('');
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Add New Student Form State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newFullName, setNewFullName] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newPhone, setNewPhone] = useState<string>('');
  const [newDob, setNewDob] = useState<string>('2000-01-01');
  const [newAddress, setNewAddress] = useState<string>('Colombo, Sri Lanka');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [newAmountPaid, setNewAmountPaid] = useState<string>('85000');
  const [newPaymentMethod, setNewPaymentMethod] = useState<'Bank Transfer' | 'Online Gateway' | 'Cash'>('Bank Transfer');
  const [newPaymentRef, setNewPaymentRef] = useState<string>('ADMIN-DIRECT-REGISTER');
  const [newStatus, setNewStatus] = useState<'Approved' | 'Pending'>('Approved');
  const [newUsername, setNewUsername] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [showAddPassword, setShowAddPassword] = useState<boolean>(false);

  const filtered = registrations.filter((r) => {
    const matchesSearch =
      r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.assignedUsername && r.assignedUsername.toLowerCase().includes(searchTerm.toLowerCase())) ||
      r.courseTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
    setNewFullName('');
    setNewEmail('');
    setNewPhone('+94 77 ');
    const defaultCourse = courses.length > 0 ? courses[0] : null;
    setSelectedCourseId(defaultCourse ? defaultCourse.id : 'c1');
    const defaultFee = defaultCourse ? (defaultCourse.fee ?? (defaultCourse as any).price ?? 85000) : 85000;
    setNewAmountPaid(defaultFee.toString());
    setNewUsername('');
    setNewPassword('Student2026#HH');
  };

  const handleGenerateAddUsername = () => {
    const namePart = newFullName ? newFullName.toLowerCase().replace(/[^a-z0-9]/g, '') : 'student';
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setNewUsername(`${namePart}_${randomSuffix}`);
  };

  const handleGenerateAddPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789#$!';
    let result = 'HH';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(result);
  };

  const handleCourseChange = (cId: string) => {
    setSelectedCourseId(cId);
    const found = courses.find((c) => c.id === cId);
    if (found) {
      const courseFee = found.fee ?? (found as any).price ?? 0;
      setNewAmountPaid(courseFee.toString());
    }
  };

  const handleSaveNewStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newEmail.trim() || !newPhone.trim()) {
      alert('Please fill in Student Name, Email, and Phone number.');
      return;
    }

    const matchedCourse = courses.find((c) => c.id === selectedCourseId);
    const courseTitle = matchedCourse ? matchedCourse.title : 'Higher Diploma in Counselling Psychology';
    const finalUsername = newUsername.trim() || newEmail.split('@')[0] + '_hh2026';
    const finalPassword = newPassword.trim() || 'Student2026#HH';

    const newStudentReg: StudentRegistration = {
      id: `reg-admin-${Date.now()}`,
      studentId: `std-${Date.now()}`,
      fullName: newFullName.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim(),
      dob: newDob,
      address: newAddress,
      courseId: selectedCourseId || 'c1',
      courseTitle,
      paymentMethod: newPaymentMethod,
      amountPaid: parseFloat(newAmountPaid) || 0,
      paymentRef: newPaymentRef.trim() || `ADM-${Math.floor(100000 + Math.random() * 900000)}`,
      paymentSlipUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop',
      status: newStatus,
      assignedUsername: finalUsername,
      assignedPassword: finalPassword,
      adminNotes: 'Directly enrolled via Admin Panel',
      submittedAt: new Date().toISOString(),
      reviewedAt: new Date().toISOString()
    };

    if (onAddStudent) {
      onAddStudent(newStudentReg);
    } else {
      registrations.unshift(newStudentReg);
    }

    onSuccessToast?.(`New student ${newFullName} enrolled successfully with Username: ${finalUsername}!`);
    setIsAddModalOpen(false);
  };

  const handleOpenInspect = (reg: StudentRegistration) => {
    setInspectingReg(reg);
    const defaultUsername = reg.assignedUsername || reg.email.split('@')[0] + '_hh2026';
    const defaultPassword = reg.assignedPassword || 'HHStudent2026#';
    setEditingUsername(defaultUsername);
    setEditingPassword(defaultPassword);
  };

  const generateAutoUsername = () => {
    if (!inspectingReg) return;
    const cleanName = inspectingReg.fullName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setEditingUsername(`${cleanName}_${randomSuffix}`);
  };

  const generateAutoPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789#$!';
    let result = 'HH';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setEditingPassword(result);
  };

  const handleSaveCredentials = () => {
    if (!inspectingReg) return;
    if (!editingUsername.trim() || !editingPassword.trim()) {
      alert('Please provide both username and password.');
      return;
    }
    onUpdateCredentials?.(inspectingReg.id, editingUsername.trim(), editingPassword.trim());
    onSuccessToast?.(`Portal credentials updated for ${inspectingReg.fullName}!`);
    setInspectingReg({
      ...inspectingReg,
      assignedUsername: editingUsername.trim(),
      assignedPassword: editingPassword.trim()
    });
  };

  const handleApprove = (id: string) => {
    const credentials = {
      username: editingUsername.trim() || inspectingReg?.assignedUsername || inspectingReg?.email || 'student2026',
      password: editingPassword.trim() || inspectingReg?.assignedPassword || 'Student2026#HH'
    };

    onUpdateStatus(id, 'Approved', undefined, credentials);
    onSuccessToast?.(
      `Student registration approved & credentials created! Username: ${credentials.username}`
    );
    setInspectingReg(null);
  };

  const handleReject = (id: string) => {
    const reason = prompt('Please specify rejection reason for student notification:');
    if (reason !== null) {
      onUpdateStatus(id, 'Rejected', reason);
      onSuccessToast?.('Registration marked as Rejected.');
      setInspectingReg(null);
    }
  };

  const handleCopyCredentials = (reg: StudentRegistration) => {
    const username = reg.assignedUsername || reg.email;
    const password = reg.assignedPassword || 'Student2026#HH';
    const text = `Helping Hearts LMS Access Credentials:\nCourse: ${reg.courseTitle}\nStudent: ${reg.fullName}\nUsername/Email: ${username}\nPassword: ${password}\nPortal URL: https://ais-dev-j76cfuaba2zobq5yapc74s-62083193100.asia-east1.run.app`;

    navigator.clipboard.writeText(text);
    setCopiedId(reg.id);
    onSuccessToast?.('Copied login credentials to clipboard!');
    setTimeout(() => setCopiedId(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <UserCheck className="w-7 h-7 text-teal-800" /> Student Enrollment & Credential Access Admin
          </h1>
          <p className="text-xs text-slate-500">
            Directly add students, inspect bank deposit slips, assign custom usernames & passwords, grant LMS access, and test student portal logins.
          </p>
        </div>

        {/* Quick Actions & Stats */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4 text-amber-300" />
            <span>+ Add Student</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs">
            <span className="px-3 py-1 bg-white rounded-xl font-bold text-slate-800 shadow-2xs">
              Total: {registrations.length}
            </span>
            <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-xl font-bold">
              Pending: {registrations.filter((r) => r.status === 'Pending').length}
            </span>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-900 rounded-xl font-bold">
              Approved: {registrations.filter((r) => r.status === 'Approved').length}
            </span>
          </div>
        </div>
      </div>

      {/* Filters & Add Student Trigger Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student, username, email, course..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-600 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
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

      {/* Registrations Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-900 uppercase font-bold text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-4">Student Details</th>
                <th className="p-4">Enrolled Course</th>
                <th className="p-4">🔑 Created Username & Password</th>
                <th className="p-4">Slip / Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((reg) => {
                const username = reg.assignedUsername || reg.email;
                const password = reg.assignedPassword || 'Student2026#HH';

                return (
                  <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-900 text-xs">{reg.fullName}</p>
                      <p className="text-slate-500 text-[11px]">{reg.email}</p>
                      <p className="text-slate-400 text-[10px] font-mono">{reg.phone}</p>
                    </td>

                    <td className="p-4 font-semibold text-slate-800 max-w-xs">
                      {reg.courseTitle}
                    </td>

                    {/* Username & Password Column */}
                    <td className="p-4">
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 space-y-1 text-[11px] font-mono">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-500">User:</span>
                          <span className="font-bold text-teal-900 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                            {username}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-500">Pass:</span>
                          <span className="font-bold text-slate-800 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                            {password}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-teal-900">LKR {(reg.amountPaid ?? 0).toLocaleString()}</p>
                      <p className="text-[10px] text-slate-500 font-mono">Ref: {reg.paymentRef}</p>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          reg.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : reg.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {reg.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex flex-wrap items-center justify-end gap-1.5">
                        {/* Direct Portal Login Button */}
                        <button
                          onClick={() => onDirectLoginAsStudent?.(reg)}
                          className="px-2.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] inline-flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                          title="Portal Login as this Student to test LMS"
                        >
                          <LogIn className="w-3.5 h-3.5 text-slate-950" />
                          <span>Portal Login</span>
                        </button>

                        {/* Copy Credentials */}
                        <button
                          onClick={() => handleCopyCredentials(reg)}
                          className="px-2 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer transition-all"
                          title="Copy Username & Password"
                        >
                          {copiedId === reg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                          )}
                          <span>{copiedId === reg.id ? 'Copied' : 'Copy'}</span>
                        </button>

                        {/* Inspect & Create Credentials */}
                        <button
                          onClick={() => handleOpenInspect(reg)}
                          className="px-3 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-[11px] inline-flex items-center gap-1 shadow-xs cursor-pointer transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" /> Inspect & Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 space-y-5 border border-slate-100 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-teal-800" /> Add New Student to LMS & Admin Records
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm px-2 py-1 rounded-lg hover:bg-slate-100"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSaveNewStudent} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    placeholder="e.g. Ruwan Wickramasinghe"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-teal-600 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="ruwan@example.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-teal-600 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+94 77 123 4567"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-teal-600 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={newDob}
                    onChange={(e) => setNewDob(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-teal-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1 text-xs">Select Diploma / Certificate Course *</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => handleCourseChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-teal-600 outline-none bg-white"
                >
                  {courses.length > 0 ? (
                    courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} (LKR {(c.fee ?? (c as any).price ?? 0).toLocaleString()})
                      </option>
                    ))
                  ) : (
                    <option value="c1">Higher Diploma in Counselling Psychology (LKR 85,000)</option>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Payment Method</label>
                  <select
                    value={newPaymentMethod}
                    onChange={(e) => setNewPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-teal-600 outline-none bg-white"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash at Campus</option>
                    <option value="Online Gateway">Online Gateway</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Amount Paid (LKR)</label>
                  <input
                    type="number"
                    value={newAmountPaid}
                    onChange={(e) => setNewAmountPaid(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-teal-600 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Enrollment Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-teal-600 outline-none bg-white font-bold"
                  >
                    <option value="Approved">Approved (Active LMS)</option>
                    <option value="Pending">Pending Review</option>
                  </select>
                </div>
              </div>

              {/* Login Credentials block */}
              <div className="bg-gradient-to-br from-teal-950 via-teal-900 to-slate-900 text-white p-4 rounded-2xl space-y-3 border border-teal-800 shadow-md">
                <div className="flex items-center justify-between border-b border-teal-800/80 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-amber-400" /> Assign Portal Login Credentials
                  </span>
                  <span className="text-[10px] bg-teal-800 text-teal-200 px-2 py-0.5 rounded font-mono">
                    LMS Access
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-teal-100 text-[11px]">Assigned Username</label>
                      <button
                        type="button"
                        onClick={handleGenerateAddUsername}
                        className="text-[10px] text-amber-300 hover:underline flex items-center gap-0.5 font-bold cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" /> Auto
                      </button>
                    </div>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="e.g. ruwan_hh2026"
                      className="w-full px-3 py-2 rounded-xl bg-teal-900/90 border border-teal-700 text-white text-xs font-mono focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-teal-100 text-[11px]">Assigned Password</label>
                      <button
                        type="button"
                        onClick={handleGenerateAddPassword}
                        className="text-[10px] text-amber-300 hover:underline flex items-center gap-0.5 font-bold cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" /> Auto
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showAddPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="e.g. Student2026#HH"
                        className="w-full pl-3 pr-10 py-2 rounded-xl bg-teal-900/90 border border-teal-700 text-white text-xs font-mono focus:border-amber-400 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAddPassword(!showAddPassword)}
                        className="absolute right-2.5 top-2.5 text-teal-300 text-[10px] font-bold"
                      >
                        {showAddPassword ? 'HIDE' : 'SHOW'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-amber-300" />
                  <span>Create Student & Grant Access</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Slip Inspection & Credential Creation Modal */}
      {inspectingReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 space-y-5 border border-slate-100 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Key className="w-5 h-5 text-teal-800" /> Student Profile & Access Credentials Setup
              </h2>
              <button
                onClick={() => setInspectingReg(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm px-2 py-1 rounded-lg hover:bg-slate-100"
              >
                ✕ Close
              </button>
            </div>

            {/* Student Quick Summary */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div>
                <p className="text-slate-500">Student Name:</p>
                <p className="font-bold text-slate-900">{inspectingReg.fullName}</p>
              </div>
              <div>
                <p className="text-slate-500">Enrolled Course:</p>
                <p className="font-bold text-teal-900">{inspectingReg.courseTitle}</p>
              </div>
              <div>
                <p className="text-slate-500">Email & Phone:</p>
                <p className="font-medium text-slate-800">{inspectingReg.email} • {inspectingReg.phone}</p>
              </div>
              <div>
                <p className="text-slate-500">Amount & Ref:</p>
                <p className="font-bold text-slate-900">LKR {(inspectingReg.amountPaid ?? 0).toLocaleString()} ({inspectingReg.paymentRef})</p>
              </div>
            </div>

            {/* Admin Username and Password Access Setup Block */}
            <div className="bg-gradient-to-br from-teal-950 via-teal-900 to-slate-900 text-white p-5 rounded-2xl space-y-4 border border-teal-800 shadow-md">
              <div className="flex items-center justify-between border-b border-teal-800/80 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-amber-400" /> Admin Username & Password Access Creator
                </span>
                <span className="text-[10px] bg-teal-800 text-teal-200 px-2 py-0.5 rounded font-mono">
                  LMS Access Generator
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Username Creation Input */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-teal-100 text-[11px]">Assigned Username / User ID</label>
                    <button
                      type="button"
                      onClick={generateAutoUsername}
                      className="text-[10px] text-amber-300 hover:underline flex items-center gap-0.5 font-bold cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" /> Auto
                    </button>
                  </div>
                  <input
                    type="text"
                    value={editingUsername}
                    onChange={(e) => setEditingUsername(e.target.value)}
                    placeholder="Enter student username..."
                    className="w-full px-3 py-2 rounded-xl bg-teal-900/90 border border-teal-700 text-white text-xs font-mono focus:border-amber-400 outline-none"
                  />
                </div>

                {/* Password Creation Input */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-teal-100 text-[11px]">Assigned Portal Password</label>
                    <button
                      type="button"
                      onClick={generateAutoPassword}
                      className="text-[10px] text-amber-300 hover:underline flex items-center gap-0.5 font-bold cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" /> Auto Pass
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPasswordModal ? 'text' : 'password'}
                      value={editingPassword}
                      onChange={(e) => setEditingPassword(e.target.value)}
                      placeholder="Enter student password..."
                      className="w-full pl-3 pr-10 py-2 rounded-xl bg-teal-900/90 border border-teal-700 text-white text-xs font-mono focus:border-amber-400 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordModal(!showPasswordModal)}
                      className="absolute right-2.5 top-2.5 text-teal-300 text-[10px] font-bold"
                    >
                      {showPasswordModal ? 'HIDE' : 'SHOW'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action row to Save Credentials or Test Login */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-teal-800/80">
                <button
                  type="button"
                  onClick={handleSaveCredentials}
                  className="px-3.5 py-2 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-teal-700"
                >
                  <Key className="w-3.5 h-3.5 text-amber-300" />
                  <span>Save Created Credentials</span>
                </button>

                {onDirectLoginAsStudent && (
                  <button
                    type="button"
                    onClick={() => {
                      onDirectLoginAsStudent(inspectingReg);
                      setInspectingReg(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                  >
                    <LogIn className="w-4 h-4 text-slate-950" />
                    <span>Portal Login as Student</span>
                  </button>
                )}
              </div>
            </div>

            {/* Bank Slip Image */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden p-2 bg-slate-50 text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Attached Bank Transfer Deposit Receipt</p>
              <img
                src={inspectingReg.paymentSlipUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop'}
                alt="Bank Transfer Slip"
                className="max-h-48 object-contain mx-auto rounded-xl border border-slate-200"
              />
            </div>

            {/* Modal Bottom Action Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
              <button
                onClick={() => setInspectingReg(null)}
                className="px-4 py-2 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100 cursor-pointer"
              >
                Cancel / Close
              </button>

              <div className="flex flex-wrap gap-2">
                <a
                  href={`https://wa.me/${inspectingReg.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hi ${inspectingReg.fullName}, your LMS Student Portal Account at Helping Hearts is ready!\n\n` +
                    `Course: ${inspectingReg.courseTitle}\n` +
                    `Username: ${editingUsername || inspectingReg.assignedUsername || inspectingReg.email}\n` +
                    `Password: ${editingPassword || inspectingReg.assignedPassword || 'Student2026#HH'}\n\n` +
                    `Log in at: https://ais-dev-j76cfuaba2zobq5yapc74s-62083193100.asia-east1.run.app`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>Send Credentials on WhatsApp</span>
                </a>

                <button
                  onClick={() => handleReject(inspectingReg.id)}
                  className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer"
                >
                  Reject Slip
                </button>

                <button
                  onClick={() => handleApprove(inspectingReg.id)}
                  className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Approve & Grant LMS Access</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
