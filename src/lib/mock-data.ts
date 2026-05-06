// Mock data for demo mode
export const mockTutor = {
  id: "demo-tutor-id",
  name: "Demo Tutor",
  email: "demo@example.com",
  centerName: "Namma Tuition Center",
  language: "en",
};

export const mockBatches = [
  { id: "batch-1", name: "10th Standard - Morning", tutorId: "demo-tutor-id" },
  { id: "batch-2", name: "12th Standard - Evening", tutorId: "demo-tutor-id" },
];

export const mockStudents = [
  {
    id: "student-1",
    name: "Rahul",
    parentName: "Rajesh",
    parentPhone: "+919876543210",
    batchId: "batch-1",
    tutorId: "demo-tutor-id",
    feeAmount: 1500,
    reportToken: "rahul-report",
  },
  {
    id: "student-2",
    name: "Priya",
    parentName: "Meena",
    parentPhone: "+919876543211",
    batchId: "batch-1",
    tutorId: "demo-tutor-id",
    feeAmount: 1500,
    reportToken: "priya-report",
  },
  {
    id: "student-3",
    name: "Arun",
    parentName: "Senthil",
    parentPhone: "+919876543212",
    batchId: "batch-2",
    tutorId: "demo-tutor-id",
    feeAmount: 2000,
    reportToken: "arun-report",
  },
];

export const mockAttendance = [
  { id: "att-1", studentId: "student-1", date: new Date(), present: true },
  { id: "att-2", studentId: "student-2", date: new Date(), present: true },
  { id: "att-3", studentId: "student-3", date: new Date(), present: false },
];

export const mockSubjects = [
  { id: "sub-1", name: "Mathematics", batchId: "batch-1" },
  { id: "sub-2", name: "Science", batchId: "batch-1" },
  { id: "sub-3", name: "Physics", batchId: "batch-2" },
];

export const mockScores = [
  // Rahul's scores
  { id: "score-1", studentId: "student-1", subjectId: "sub-1", testName: "Jan Test", score: 85, maxScore: 100, date: new Date(2026, 0, 15) },
  { id: "score-2", studentId: "student-1", subjectId: "sub-1", testName: "Feb Test", score: 78, maxScore: 100, date: new Date(2026, 1, 15) },
  { id: "score-3", studentId: "student-1", subjectId: "sub-1", testName: "Mar Test", score: 92, maxScore: 100, date: new Date(2026, 2, 15) },
  { id: "score-4", studentId: "student-1", subjectId: "sub-1", testName: "Apr Test", score: 88, maxScore: 100, date: new Date(2026, 3, 15) },
  { id: "score-5", studentId: "student-1", subjectId: "sub-2", testName: "Feb Science", score: 70, maxScore: 100, date: new Date(2026, 1, 20) },
  { id: "score-6", studentId: "student-1", subjectId: "sub-2", testName: "Apr Science", score: 82, maxScore: 100, date: new Date(2026, 3, 20) },

  // Priya's scores
  { id: "score-7", studentId: "student-2", subjectId: "sub-1", testName: "Jan Test", score: 90, maxScore: 100, date: new Date(2026, 0, 15) },
  { id: "score-8", studentId: "student-2", subjectId: "sub-1", testName: "Feb Test", score: 95, maxScore: 100, date: new Date(2026, 1, 15) },
  { id: "score-9", studentId: "student-2", subjectId: "sub-1", testName: "Mar Test", score: 88, maxScore: 100, date: new Date(2026, 2, 15) },
  { id: "score-10", studentId: "student-2", subjectId: "sub-1", testName: "Apr Test", score: 94, maxScore: 100, date: new Date(2026, 3, 15) },
];
