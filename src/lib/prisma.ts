import { mockTutor, mockBatches, mockStudents, mockAttendance, mockSubjects, mockScores } from "./mock-data";

// A very simplified mock of Prisma Client for demo purposes
const prismaMock = {
  tutor: {
    findUnique: async () => mockTutor,
    update: async ({ data }: any) => ({ ...mockTutor, ...data }),
  },
  batch: {
    findMany: async () => mockBatches,
    create: async ({ data }: any) => ({ id: Math.random().toString(), ...data }),
    count: async () => mockBatches.length,
  },
  student: {
    findMany: async (args: any) => {
      let result = [...mockStudents];
      if (args?.where?.batchId) result = result.filter(s => s.batchId === args.where.batchId);
      if (args?.where?.tutorId) result = result.filter(s => s.tutorId === args.where.tutorId);
      
      // Handle complex where for cron job (simplified)
      if (args?.where?.attendance?.some) {
        result = result.filter(s => mockAttendance.some(a => a.studentId === s.id));
      }

      // Handle include
      result = result.map(s => {
        const student: any = { ...s };
        if (args?.include?.batch) {
          student.batch = {
            ...mockBatches.find(b => b.id === s.batchId),
            subjects: mockSubjects.filter(sub => sub.batchId === s.batchId)
          };
        }
        if (args?.include?.tutor) {
          student.tutor = mockTutor;
        }
        if (args?.include?.attendance) {
          student.attendance = mockAttendance.filter(a => a.studentId === s.id);
        }
        if (args?.include?.testScores) {
          student.testScores = mockScores.filter(sc => sc.studentId === s.id).map(sc => ({
            ...sc,
            subject: mockSubjects.find(sub => sub.id === sc.subjectId)
          }));
        }
        return student;
      });
      return result;
    },
    findUnique: async ({ where }: any) => {
      const student = mockStudents.find(s => s.id === where.id || s.reportToken === where.reportToken);
      if (!student) return null;
      return {
        ...student,
        batch: mockBatches.find(b => b.id === student.batchId) || null
      };
    },
    count: async (args: any) => {
      if (args?.where?.OR) return 1; // Simplified for "fees due"
      return mockStudents.length;
    },
    create: async ({ data }: any) => ({ id: Math.random().toString(), ...data }),
    update: async ({ where, data }: any) => ({ ...mockStudents.find(s => s.id === where.id), ...data }),
    delete: async () => ({}),
  },
  attendance: {
    findMany: async (args: any) => {
      if (args?.where?.studentId) return mockAttendance.filter(a => a.studentId === args.where.studentId);
      return mockAttendance;
    },
    upsert: async ({ data }: any) => ({ id: Math.random().toString(), ...data }),
    count: async (args: any) => {
      // Simplified: return a plausible number if filtering by date and present/absent
      if (args?.where?.present === true) return 2;
      if (args?.where?.present === false) return 1;
      return mockAttendance.length;
    },
  },
  subject: {
    findMany: async () => mockSubjects,
  },
  testScore: {
    findMany: async () => mockScores,
  },
  user: {
    findUnique: async () => mockTutor,
    create: async ({ data }: any) => ({ ...mockTutor, ...data }),
    update: async ({ data }: any) => ({ ...mockTutor, ...data }),
  },
  account: {
    findUnique: async () => null,
    create: async ({ data }: any) => data,
  },
  session: {
    findUnique: async () => null,
    create: async ({ data }: any) => data,
  },
  verificationToken: {
    findUnique: async () => null,
    create: async ({ data }: any) => data,
    delete: async () => ({}),
  },
  digestLog: {
    create: async ({ data }: any) => ({ id: Math.random().toString(), ...data }),
  },
  // Add other models as needed by the app
  $connect: async () => {},
  $disconnect: async () => {},
};

// Export the mock as the default prisma instance
const prisma = prismaMock as any;

export default prisma;
