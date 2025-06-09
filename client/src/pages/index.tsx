import { CreateRaceDialog } from "@/components/race/CreateRaceDialog";
import { RaceList } from "@/components/race/RaceList";
import { Page } from "@/components/shared/Page";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

import React from "react";

export default function Home() {
  const [isCreateRaceDialogOpen, setIsCreateRaceDialogOpen] = React.useState(false);

  const router = useRouter();

  return (
    <Page>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Race List</h2>
          <Button
            onClick={() => {
              setIsCreateRaceDialogOpen(true);
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
      </div>
      {isCreateRaceDialogOpen && (
        <CreateRaceDialog isOpen={isCreateRaceDialogOpen} onClose={() => setIsCreateRaceDialogOpen(false)} />
      )}
    </Page>
  );
}
