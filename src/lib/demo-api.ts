import { 
  mockTutor, 
  mockBatches, 
  mockStudents, 
  mockAttendance, 
  mockSubjects, 
  mockScores 
} from "./mock-data";

// Immediate response for snappiest feel
export const demoApi = {
  getStats: async () => {
    return {
      totalStudents: mockStudents.length,
      presentToday: mockAttendance.filter(a => a.present).length,
      absentToday: mockAttendance.filter(a => !a.present).length,
      feesDue: 1, // Simulated
    };
  },
  getStudents: async (batchId?: string) => {
    if (batchId) return mockStudents.filter(s => s.batchId === batchId);
    return mockStudents;
  },
  getStudentById: async (id: string) => {
    const student = mockStudents.find(s => s.id === id);
    if (!student) return null;
    const batch = mockBatches.find(b => b.id === student.batchId);
    return { ...student, batch };
  },
  getBatches: async () => {
    return mockBatches;
  },
  getAttendance: async (date: string, batchId: string) => {
    return mockAttendance;
  },
  getScores: async (studentId?: string) => {
    if (studentId) return mockScores.filter(s => s.studentId === studentId);
    return mockScores;
  },
  getPerformance: async (batchId?: string) => {
    return [
      { name: 'Jan', average: 82 },
      { name: 'Feb', average: 85 },
      { name: 'Mar', average: 78 },
      { name: 'Apr', average: 90 },
    ];
  },
  getIndividualPerformance: async (studentId: string) => {
    const scores = mockScores.filter(s => s.studentId === studentId);
    return scores.map(s => ({
      name: s.testName,
      score: (s.score / s.maxScore) * 100,
      raw: `${s.score}/${s.maxScore}`
    }));
  },
  saveAttendance: async (data: any) => {
    return { success: true };
  }
};
