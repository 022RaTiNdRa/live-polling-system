
const kickRegistry = new Map<string, Set<string>>();


export function addKick(pollId: string, studentId: string): void {
  if (!kickRegistry.has(pollId)) {
    kickRegistry.set(pollId, new Set());
  }
  kickRegistry.get(pollId)!.add(studentId);
}


export function isKicked(pollId: string, studentId: string): boolean {
  const kickedSet = kickRegistry.get(pollId);
  if (!kickedSet) return false;
  return kickedSet.has(studentId);
}


export function clearPollKicks(pollId: string): void {
  kickRegistry.delete(pollId);
}
