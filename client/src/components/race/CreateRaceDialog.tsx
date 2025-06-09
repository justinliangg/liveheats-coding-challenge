import { Label } from "@radix-ui/react-label";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import React from "react";
import { StudentDropdown } from "../student/StudentDropdown";
import { useCreateRace } from "@/hooks/api/races/useCreateRace";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";

interface CreateRaceDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateRaceDialog: React.FC<CreateRaceDialogProps> = ({ isOpen, onClose }) => {
  const [raceName, setRaceName] = React.useState("");
  const [errors, setErrors] = React.useState<string[]>([]);
  const [participants, setParticipants] = React.useState<{ lane: number; studentId: string }[]>([
    { lane: 1, studentId: "" },
    { lane: 2, studentId: "" },
  ]);

  const { mutate: createRace } = useCreateRace();

  const removeParticipant = (index: number) => {
    if (participants.length <= 2) {
      return; // Prevent removing lanes if only 2 are left
    }

    const updatedParticipants = participants.filter((_, i) => i !== index);
    setParticipants(updatedParticipants);
  };

  const addParticipant = () => {
    const nextLane = participants.length + 1;
    setParticipants([...participants, { lane: nextLane, studentId: "" }]);
  };

  const validateRace = (): string[] => {
    const errors: string[] = [];

    if (!raceName.trim()) {
      errors.push("Race name is required");
    }

    if (participants.length < 2) {
      errors.push("A race must have at least 2 students");
    }

    // Check for duplicate students
    const studentIds = participants.map((p) => p.studentId).filter((id) => id);
    const uniqueStudentIds = new Set(studentIds);
    if (studentIds.length !== uniqueStudentIds.size) {
      errors.push("The same student cannot be assigned to multiple lanes");
    }

    // Check for empty student assignments
    const emptyAssignments = participants.filter((p) => !p.studentId);
    if (emptyAssignments.length > 0) {
      errors.push("All lanes must have a student assigned");
    }

    return errors;
  };

  const handleCreateRace = () => {
    const validationErrors = validateRace();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    createRace(
      {
        name: raceName,
        participants: participants.map((p) => ({
          studentId: p.studentId,
          lane: p.lane,
        })),
      },
      {
        onSuccess: () => {
          setRaceName("");
          setParticipants([
            { lane: 1, studentId: "" },
            { lane: 2, studentId: "" },
          ]);
          setErrors([]);

          onClose();
        },
        onError: (error) => {
          setErrors([error.message || "An error occurred while creating race"]);
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="overflow-y-scroll max-h-svh">
        <DialogHeader>
          <DialogTitle>Create New Race</DialogTitle>
          <DialogDescription>
            Set up a new race by assigning students to lanes. Each race needs at least 2 students.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="raceName">Race Name</Label>
              <Input
                id="raceName"
                value={raceName}
                onChange={(e) => setRaceName(e.target.value)}
                placeholder="Enter race name (e.g., 100m Sprint)"
                className="mt-1"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Lane Assignments</Label>
                <Button onClick={addParticipant} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Lane
                </Button>
              </div>

              <div className="space-y-3">
                {participants.map((participant, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary" className="min-w-[60px]">
                        Lane {participant.lane}
                      </Badge>
                      <div className="flex-1">
                        <StudentDropdown
                          value={participant.studentId}
                          excludeValues={participants
                            .map((p) => p.studentId)
                            .filter((id) => id && id !== participant.studentId)}
                          onValueChange={(studentId) => {
                            const updatedParticipants = [...participants];
                            updatedParticipants[index].studentId = studentId;
                            setParticipants(updatedParticipants);
                          }}
                        />
                      </div>

                      {index !== 0 && index !== 1 && (
                        <Button
                          onClick={() => removeParticipant(index)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <Button onClick={handleCreateRace} className="w-full" disabled={participants.length < 2}>
              Create Race
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
