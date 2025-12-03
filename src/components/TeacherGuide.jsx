import React, { useState, useEffect } from 'react';
import { BookOpen, Download, FileText } from 'lucide-react';

const LessonViewer = ({ url }) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    if (url) {
      fetch(url)
        .then(res => res.text())
        .then(text => setContent(text))
        .catch(err => setContent('Error loading lesson plan.'));
    }
  }, [url]);

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border prose max-w-none">
      <pre className="whitespace-pre-wrap font-sans text-gray-700">{content}</pre>
    </div>
  );
};

const TeacherGuide = () => {
  const [activeLesson, setActiveLesson] = useState(null);

  const lessons = [
    { id: 'beginner', title: 'Beginner: First 20 Words', file: '/teacher-assets/lesson-beginner.md', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { id: 'intermediate', title: 'Intermediate: Daily Routines', file: '/teacher-assets/lesson-intermediate.md', color: 'bg-teal-50 text-teal-700 border-teal-200' },
    { id: 'advanced', title: 'Advanced: Discussion', file: '/teacher-assets/lesson-advanced.md', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-orange-100 rounded-full">
           <BookOpen className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teacher Resources</h1>
          <p className="text-gray-500">Lesson plans and printable materials for the classroom.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {lessons.map(lesson => (
          <button 
            key={lesson.id}
            onClick={() => setActiveLesson(lesson.file)}
            className={`p-6 rounded-xl border-2 text-left transition-all hover:shadow-md ${activeLesson === lesson.file ? 'ring-2 ring-offset-2 ring-blue-500' : ''} ${lesson.color}`}
          >
            <h3 className="font-bold text-lg mb-2">{lesson.title}</h3>
            <p className="text-sm opacity-80">Click to view plan</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Lesson Viewer
          </h2>
          {activeLesson ? (
            <LessonViewer url={activeLesson} />
          ) : (
            <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 p-12 text-center text-gray-400">
              Select a lesson plan above to view details.
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Download className="w-5 h-5" />
            Printables
          </h2>
          <div className="space-y-3">
            <a href="/teacher-assets/worksheets/worksheet-1.md" target="_blank" className="block p-4 bg-white border rounded-lg hover:bg-gray-50 transition group">
              <h4 className="font-bold text-gray-800 group-hover:text-blue-600">Worksheet 1: Matching</h4>
              <p className="text-xs text-gray-500 mt-1">PDF / Markdown for printing</p>
            </a>
            <a href="/teacher-assets/worksheets/worksheet-2.md" target="_blank" className="block p-4 bg-white border rounded-lg hover:bg-gray-50 transition group">
              <h4 className="font-bold text-gray-800 group-hover:text-blue-600">Worksheet 2: Fill-in-Blanks</h4>
              <p className="text-xs text-gray-500 mt-1">PDF / Markdown for printing</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherGuide;
