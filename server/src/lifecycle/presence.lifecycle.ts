
type StudentSocketMap = Map<string, string>;
const studentSocketMap: StudentSocketMap = new Map();

export function addStudent(studentId: string, socketId: string): void {
  studentSocketMap.set(studentId, socketId);
}

export function removeStudentByStudent(studentId: string): void {
  studentSocketMap.delete(studentId);
}

export function removeStudentBySocket(socketId: string): void {
  for (const [studentId, sid] of studentSocketMap.entries()) {
    if (sid === socketId) {
      studentSocketMap.delete(studentId);
      break;
    }
  }
}

export function getSocket(studentId: string): string | undefined {
  return studentSocketMap.get(studentId);
}

export function getAllStudents(): string[] {
  return Array.from(studentSocketMap.keys());
}

export function getStudentCount(): number {
  return studentSocketMap.size;
}