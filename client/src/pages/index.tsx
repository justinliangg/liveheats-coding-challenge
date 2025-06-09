import { RaceList } from "@/components/race/RaceList";
import { Page } from "@/components/shared/Page";
import { StudentDropdown } from "@/components/student/StudentDropdown";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

import React from "react";

export default function Home() {
  const router = useRouter();

  return (
    <Page>
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
            router.push(`/races/${raceId}`);
          }}
        />

        <StudentDropdown value={""} />
      </div>
    </Page>
  );
}
