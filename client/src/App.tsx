import { useState } from "react";
import { useSocket } from "./hooks/useSocket";
import RoleSelection from "./pages/RoleSelection";
import TeacherPage from "./pages/TeacherPage";
import StudentPage from "./pages/StudentPage";
import ConnectionBanner from "./components/ConnectionBanner";

function App() {
  const { connected } = useSocket();
  const [role, setRole] = useState<"teacher" | "student" | null>(null);

  if (!role) {
    return (
      <>
        <ConnectionBanner connected={connected} />
        <RoleSelection onSelect={setRole} />
      </>
    );
  }

  if (role === "teacher") {
    return (
      <>
        <ConnectionBanner connected={connected} />
        <TeacherPage />
      </>
    );
  }

  return (
    <>
      <ConnectionBanner connected={connected} />
      <StudentPage />
    </>
  );
}

export default App;