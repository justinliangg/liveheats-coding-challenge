import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useStudents } from "@/hooks/api/students/useStudents";
import React from "react";
import { QuickCreateStudentForm } from "./QuickCreateStudentForm";

interface StudentDropdownProps {
  value: string;
  onValueChange?: (value: string) => void;
  excludeValues?: string[];
}

export const StudentDropdown: React.FC<StudentDropdownProps> = ({ value, onValueChange, excludeValues }) => {
  const { data: students = [] } = useStudents();

  const handleValueChange = (value: string) => {
    onValueChange?.(value);
  };

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a student" />
      </SelectTrigger>
      <SelectContent>
        {students
          .filter((student) => !excludeValues || !excludeValues.includes(student.id))
          .map((student) => (
            <SelectItem key={student.id} value={student.id}>
              {student.name}
            </SelectItem>
          ))}
        <QuickCreateStudentForm />
      </SelectContent>
    </Select>
  );
};
