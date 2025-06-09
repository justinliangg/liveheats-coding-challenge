import { RaceList } from "@/components/race/RaceList";
import { Button } from "@/components/ui/button";

import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="flex flex-col gap-6 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">🏃‍♂️ Liveheats Race Manager</h1>

        <div className="flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Race List</h2>
            <Button
              onClick={() => {
                // TODO: Open create new race modal
                console.log("Create new race button clicked!");
              }}
            >
              Create New Race
            </Button>
          </div>

          <RaceList
            onRaceSelect={(raceId: string) => {
              // TODO: Navigate to race detail page
              console.log(raceId);
            }}
          />
        </div>
      </div>
    </div>
  );
}
