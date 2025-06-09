import { useCreateStudent } from "@/hooks/api/students/useCreateStudent";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import React from "react";

export const QuickCreateStudentForm = () => {
  const [studentName, setStudentName] = React.useState("");

  const { mutateAsync: createStudent, isPending: isCreateStudentPending } = useCreateStudent();

  const handleCreateStudent = async () => {
    if (!studentName.trim()) return;
    await createStudent({ name: studentName.trim() });
    setStudentName("");
  };

  return (
    <div className="border-t border-gray-200 p-2 flex gap-2">
      <Input
        value={studentName}
        name="studentName"
        placeholder="Add new student..."
        autoComplete="off"
        onChange={(e) => setStudentName(e.target.value)}
        onKeyDown={(e) => e.stopPropagation()}
        onKeyUp={(e) => e.stopPropagation()}
      />
      <Button onClick={handleCreateStudent} loading={isCreateStudentPending}>
        Add
      </Button>
    </div>
  );
};
