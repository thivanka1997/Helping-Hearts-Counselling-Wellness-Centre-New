'use client';
import React, { useState } from 'react';
import { Course, Lecturer } from '@/src/types';
import { BookOpen, Plus, Edit, Trash2, Video, FileText, CheckCircle2, AlertTriangle, X } from 'lucide-react';

interface AdminCoursesProps {
  courses: Course[];
  lecturers: Lecturer[];
  onSaveCourse: (course: Course) => void;
  onDeleteCourse?: (courseId: string) => void;
  onSuccessToast?: (msg: string) => void;
}

export const AdminCourses: React.FC<AdminCoursesProps> = ({
  courses,
  lecturers,
  onSaveCourse,
  onDeleteCourse,
  onSuccessToast
}) => {
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [newOutcomeInput, setNewOutcomeInput] = useState('');
  const [newRequirementInput, setNewRequirementInput] = useState('');

  const handleCreateNew = () => {
    setEditingCourse({
      id: `crs-${Date.now()}`,
      title: 'Diploma in Applied Clinical Psychology',
      shortDesc: 'Comprehensive diploma covering clinical assessment and therapy.',
      description: 'Comprehensive diploma covering clinical assessment and therapy for advanced students.',
      category: 'Diploma',
      duration: '12 Months',
      schedule: 'Saturdays 9:00 AM - 4:00 PM',
      fee: 145000,
      currency: 'LKR',
      lecturerId: lecturers[0]?.id || 'lec-1',
      lecturerName: lecturers[0]?.name || 'Ms. Ramsina Farvin Jelaldeen',
      level: 'All Levels',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop',
      requirements: ['G.C.E. A/L qualification (or equivalent work experience)'],
      outcomes: ['Conduct clinical intake assessments', 'Deliver CBT frameworks'],
      slug: 'diploma-in-applied-clinical-psychology-' + Date.now(),
      status: 'Published',
      createdAt: new Date().toISOString()
    });
    setNewOutcomeInput('');
    setNewRequirementInput('');
  };

  const handleAddOutcome = () => {
    if (!newOutcomeInput.trim() || !editingCourse) return;
    const current = editingCourse.outcomes || [];
    setEditingCourse({
      ...editingCourse,
      outcomes: [...current, newOutcomeInput.trim()]
    });
    setNewOutcomeInput('');
  };

  const handleRemoveOutcome = (index: number) => {
    if (!editingCourse) return;
    const current = [...(editingCourse.outcomes || [])];
    current.splice(index, 1);
    setEditingCourse({
      ...editingCourse,
      outcomes: current
    });
  };

  const handleAddRequirement = () => {
    if (!newRequirementInput.trim() || !editingCourse) return;
    const current = editingCourse.requirements || [];
    setEditingCourse({
      ...editingCourse,
      requirements: [...current, newRequirementInput.trim()]
    });
    setNewRequirementInput('');
  };

  const handleRemoveRequirement = (index: number) => {
    if (!editingCourse) return;
    const current = [...(editingCourse.requirements || [])];
    current.splice(index, 1);
    setEditingCourse({
      ...editingCourse,
      requirements: current
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourse) {
      onSaveCourse({
        ...editingCourse,
        outcomes: editingCourse.outcomes || [],
        requirements: editingCourse.requirements || []
      });
      onSuccessToast?.('Course program saved successfully!');
      setEditingCourse(null);
    }
  };

  const confirmDelete = () => {
    if (courseToDelete && onDeleteCourse) {
      onDeleteCourse(courseToDelete.id);
      onSuccessToast?.(`Course "${courseToDelete.title}" deleted successfully.`);
      setCourseToDelete(null);
      if (editingCourse?.id === courseToDelete.id) {
        setEditingCourse(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Academic LMS Courses</h1>
          <p className="text-xs text-slate-500">Create, edit, & delete diploma programs, assigned lecturers, tuition fees, and module content.</p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 text-amber-300" /> Create New Course Program
        </button>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((crs) => (
          <div key={crs.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3 flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-teal-800 uppercase bg-teal-50 px-2.5 py-0.5 rounded">
                  {crs.category}
                </span>
                <span className="font-bold text-teal-900 text-sm">LKR {(crs.fee ?? (crs as any).price ?? 0).toLocaleString()}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{crs.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{crs.shortDesc}</p>
              <div className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-100">
                <p>Lecturer: <strong>{crs.lecturerName}</strong></p>
                <p>Duration &amp; Schedule: <strong>{crs.duration} ({crs.schedule})</strong></p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setCourseToDelete(crs)}
                className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Delete Course"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Delete</span>
              </button>

              <button
                onClick={() => setEditingCourse(crs)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5 text-teal-700" />
                <span>Edit Course</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {courseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900">Delete Course Program?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to permanently delete <strong>{courseToDelete.title}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCourseToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editor */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 space-y-4 border border-slate-100 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">
                {courses.some(c => c.id === editingCourse.id) ? 'Edit Course Program' : 'Create New Course Program'}
              </h2>
              <button
                onClick={() => setEditingCourse(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Course Title *</label>
                <input
                  type="text"
                  value={editingCourse.title}
                  onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-bold focus:ring-2 focus:ring-teal-600"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Short Tagline / Summary *</label>
                <input
                  type="text"
                  value={editingCourse.shortDesc}
                  onChange={(e) => setEditingCourse({ ...editingCourse, shortDesc: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-600"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Category</label>
                  <select
                    value={editingCourse.category}
                    onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    <option value="Diploma">Diploma</option>
                    <option value="Certificate">Certificate</option>
                    <option value="Advanced Diploma">Advanced Diploma</option>
                    <option value="Short Course">Short Course</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Tuition Fee (LKR) *</label>
                  <input
                    type="number"
                    value={editingCourse.fee}
                    onChange={(e) => setEditingCourse({ ...editingCourse, fee: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-bold focus:ring-2 focus:ring-teal-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Assigned Lecturer</label>
                  <select
                    value={editingCourse.lecturerId}
                    onChange={(e) => {
                      const lec = lecturers.find((l) => l.id === e.target.value);
                      setEditingCourse({
                        ...editingCourse,
                        lecturerId: e.target.value,
                        lecturerName: lec ? lec.name : editingCourse.lecturerName
                      });
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    {lecturers.map((l) => (
                      <option key={l.id} value={l.id}>{l.name} ({l.title})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Duration &amp; Schedule</label>
                  <input
                    type="text"
                    value={editingCourse.schedule}
                    onChange={(e) => setEditingCourse({ ...editingCourse, schedule: e.target.value })}
                    placeholder="e.g. Saturdays 9:00 AM - 4:00 PM"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={editingCourse.image}
                  onChange={(e) => setEditingCourse({ ...editingCourse, image: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Full Course Description</label>
                <textarea
                  value={editingCourse.description}
                  onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-600"
                ></textarea>
              </div>

              {/* WHAT YOU WILL LEARN (OUTCOMES) */}
              <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-teal-950 text-xs flex items-center gap-1.5 uppercase">
                    <CheckCircle2 className="w-4 h-4 text-teal-700" /> What You Will Learn ({(editingCourse.outcomes || []).length} Outcomes)
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newOutcomeInput}
                    onChange={(e) => setNewOutcomeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddOutcome();
                      }
                    }}
                    placeholder="e.g. Conduct clinical intake assessments, Deliver CBT frameworks..."
                    className="w-full p-2 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-teal-600"
                  />
                  <button
                    type="button"
                    onClick={handleAddOutcome}
                    className="px-3.5 py-2 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-xl text-xs shrink-0 cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>

                {(editingCourse.outcomes || []).length > 0 && (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {editingCourse.outcomes?.map((outcome, idx) => (
                      <div key={idx} className="p-2 rounded-xl bg-white border border-teal-100 flex items-center justify-between gap-2 text-xs">
                        <span className="text-slate-800 flex items-start gap-1.5">
                          <span className="text-teal-700 font-bold">•</span>
                          <span>{outcome}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveOutcome(idx)}
                          className="text-rose-600 hover:bg-rose-50 p-1 rounded-lg shrink-0 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ADMISSION REQUIREMENTS */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-amber-950 text-xs flex items-center gap-1.5 uppercase">
                    <BookOpen className="w-4 h-4 text-amber-700" /> Admission Requirements ({(editingCourse.requirements || []).length} Items)
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newRequirementInput}
                    onChange={(e) => setNewRequirementInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddRequirement();
                      }
                    }}
                    placeholder="e.g. G.C.E. Advanced Level qualification, Prior psychology diploma..."
                    className="w-full p-2 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-teal-600"
                  />
                  <button
                    type="button"
                    onClick={handleAddRequirement}
                    className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-slate-950 font-bold rounded-xl text-xs shrink-0 cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>

                {(editingCourse.requirements || []).length > 0 && (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {editingCourse.requirements?.map((req, idx) => (
                      <div key={idx} className="p-2 rounded-xl bg-white border border-amber-100 flex items-center justify-between gap-2 text-xs">
                        <span className="text-slate-800 flex items-start gap-1.5">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{req}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveRequirement(idx)}
                          className="text-rose-600 hover:bg-rose-50 p-1 rounded-lg shrink-0 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                {courses.some(c => c.id === editingCourse.id) && (
                  <button
                    type="button"
                    onClick={() => {
                      setCourseToDelete(editingCourse);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-700 font-bold text-xs hover:bg-rose-100 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" /> Delete Course
                  </button>
                )}
                <div className="flex gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setEditingCourse(null)}
                    className="px-4 py-2 rounded-xl text-slate-600 font-medium text-xs hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    Save Course
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

