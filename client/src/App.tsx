import { useState } from "react";
import { useSocket } from "./hooks/useSocket";
import RoleSelection from "./pages/RoleSelection";
import TeacherPage from "./pages/TeacherPage";
import StudentPage from "./pages/StudentPage";

function App() {
  useSocket();
  const [role, setRole] = useState<"teacher" | "student" | null>(null);

  if (!role) {
    return <RoleSelection onSelect={setRole} />;
  }

  if (role === "teacher") {
    return <TeacherPage />;
  }

  return <StudentPage />;
}

export default App;