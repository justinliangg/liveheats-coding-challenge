import { Race } from "@/types";
import React, { useState } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Trophy, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import { useUpdateRaceResult } from "@/hooks/api/races/useUpdateRaceResult";

interface RaceResultFormProps {
  race: Race;
}

export const RaceResultForm: React.FC<RaceResultFormProps> = ({ race }) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [positions, setPositions] = useState<{ [key: string]: number }>({});

  const { mutate: updateRaceResult, isPending: isUpdateRaceResultPending } = useUpdateRaceResult(race.id);

  const handlePositionChange = (studentId: string, newPosition: string) => {
    const newPos = Number.parseInt(newPosition);
    if (isNaN(newPos) || newPos < 1) {
      const newPositions = { ...positions };
      delete newPositions[studentId];
      setPositions(newPositions);
    } else {
      setPositions({
        ...positions,
        [studentId]: newPos,
      });
    }
  };

  const validateResults = (): string[] => {
    const errors: string[] = [];

    const positionValues = Object.values(positions);
    const studentIds = Object.keys(positions);

    // Check if all students have positions
    if (studentIds.length !== race.participants.length) {
      errors.push("All students must have a position assigned");
      return errors;
    }

    // Check for valid position range
    const maxPosition = race.participants.length;
    const invalidPositions = positionValues.filter((pos) => pos < 1 || pos > maxPosition);
    if (invalidPositions.length > 0) {
      errors.push(`Positions must be between 1 and ${maxPosition}`);
    }

    // Validating no gaps and tie rules
    const positionCountMap = new Map<number, number>();
    positionValues.forEach((pos) => {
      positionCountMap.set(pos, (positionCountMap.get(pos) || 0) + 1);
    });

    let expectedNext = 1;
    const sortedPositionCount = Array.from(positionCountMap.entries()).sort(([a], [b]) => a - b);
    for (const [position, count] of sortedPositionCount) {
      if (position !== expectedNext) {
        errors.push(`Invalid position sequence. Expected position ${expectedNext} but found ${position}`);
        break;
      }
      expectedNext = position + count;
    }

    return errors;
  };

  const handleSubmitResults = () => {
    const errors = validateResults();
    if (errors.length > 0) {
      setErrors(errors);
      return;
    }

    const raceResults = race.participants.map((participant) => ({
      studentId: participant.student.id,
      position: positions[participant.student.id],
    }));

    updateRaceResult(
      {
        results: raceResults,
      },
      {
        onSuccess: () => {
          setErrors([]);
        },
        onError: (error) => {
          setErrors([error.message || "An error occurred while updating results"]);
        },
      }
    );
  };

  const getMedalColor = (position: number) => {
    switch (position) {
      case 1:
        return "bg-yellow-500 text-white";
      case 2:
        return "bg-gray-400 text-white";
      case 3:
        return "bg-amber-600 text-white";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Enter Final Positions</h3>
        <p className="text-sm text-gray-600">
          Enter the final position for each student. In case of ties, use the same position number (e.g., two students
          tied for 1st place both get position 1, next student gets position 3).
        </p>

        <div className="grid gap-4">
          {race?.participants?.map((participant) => {
            const studentId = participant.student.id;
            return (
              <Card key={studentId} className="p-4">
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="min-w-[60px]">
                    Lane {participant.lane}
                  </Badge>
                  <div className="flex-1">
                    <p className="font-semibold">{participant.student.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`position-${studentId}`} className="text-sm">
                      Position:
                    </Label>
                    <Input
                      data-testid={`position-input-${studentId}`}
                      type="number"
                      min="1"
                      max={race.participants.length}
                      value={positions[participant.student.id] || ""}
                      onChange={(e) => handlePositionChange(studentId, e.target.value)}
                      className="w-20"
                      placeholder="1"
                    />

                    {positions[participant.student.id] && positions[studentId] <= 3 && (
                      <Badge className={getMedalColor(positions[studentId])}>
                        <Trophy className="w-3 h-3 mr-1" />
                        {positions[studentId] === 1 ? "Gold" : positions[studentId] === 2 ? "Silver" : "Bronze"}
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
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

        <Button onClick={handleSubmitResults} className="w-full" loading={isUpdateRaceResultPending}>
          Submit Results
        </Button>
      </div>
    </div>
  );
};
