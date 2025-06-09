import { useRaces } from "@/hooks/api/useRaces";
import { ChevronRight, Loader2Icon, Plus } from "lucide-react";
import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface RaceListProps {
  onRaceSelect: (raceId: string) => void;
}

export const RaceList: React.FC<RaceListProps> = ({ onRaceSelect }) => {
  const { data: races, isLoading, isError } = useRaces();

  const isEmpty = races?.length === 0;

  if (isLoading) {
    return (
      <div className="flex w-full justify-center">
        <Loader2Icon aria-label="Loading" className="animate-spin h-10 w-10 text-gray-500 " />
      </div>
    );
  }

  if (isError) {
    return <h1 className="text-gray-900">Something went wrong</h1>;
  }

  if (isEmpty) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-blue-100 p-3 mb-4">
            <Plus className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No races yet</h3>
          <p className="text-gray-500 mb-4 text-center max-w-md">
            Create your first race to get started with tracking student race results.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {races?.map((race) => (
        <Card key={race.id} className="hover:shadow-md transition-shadow p-3">
          <CardContent className="px-2">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{race.name}</h3>
                <p className="text-sm text-gray-500">{race.participants.length} participants</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={race.isCompleted ? "default" : "secondary"}>
                  {race.isCompleted ? "Completed" : "Awaiting Results"}
                </Badge>
                <Button variant="ghost" size="sm" onClick={() => onRaceSelect(race.id)} className="rounded-full p-2">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
