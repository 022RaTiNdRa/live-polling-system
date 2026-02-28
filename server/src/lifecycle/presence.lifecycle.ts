
type StudentInfo = { socketId: string; name?: string };
type StudentSocketMap = Map<string, StudentInfo>;
const studentSocketMap: StudentSocketMap = new Map();

export function addStudent(studentId: string, socketId: string, name?: string): void {
  studentSocketMap.set(studentId, { socketId, name });
}

export function removeStudentByStudent(studentId: string): void {
  studentSocketMap.delete(studentId);
}

export function removeStudentBySocket(socketId: string): void {
  for (const [studentId, info] of studentSocketMap.entries()) {
    if (info.socketId === socketId) {
      studentSocketMap.delete(studentId);
      break;
    }
  }
}

export function getSocket(studentId: string): string | undefined {
  return studentSocketMap.get(studentId)?.socketId;
}

export function getAllStudents(): { sessionId: string; name?: string }[] {
  return Array.from(studentSocketMap.entries()).map(([id, info]) => ({ sessionId: id, name: info.name ?? "" }));
}

export function getStudentCount(): number {
  return studentSocketMap.size;
}