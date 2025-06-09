import { Page } from "@/components/shared/Page";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRace } from "@/hooks/api/races/useRace";
import { useRouter } from "next/router";
import { RaceResultForm } from "@/components/race/RaceResultForm";
import { PageLoading } from "@/components/shared/PageLoading";
import { PageError } from "@/components/shared/PageError";

export default function RaceDetailPage() {
  const router = useRouter();
  const { raceId: _raceId } = router.query;
  const raceId = _raceId && typeof _raceId === "string" ? _raceId : "";

  const { data: race, isPending, error } = useRace(raceId);

  if (isPending) {
    return <PageLoading />;
  }

  if (!isPending && error) {
    return <PageError message={error.message} />;
  }

  return (
    <Page>
      <div className="mb-3">
        <Button variant="outline" onClick={() => router.push("/")}>
          ← Back to Races
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{race?.name}</CardTitle>
            <p className="text-sm text-gray-500">{race?.participants?.length} participants</p>
          </div>
          <Badge variant={race?.isCompleted ? "default" : "secondary"} className="text-sm">
            {race?.isCompleted ? "Completed" : "Pending"}
          </Badge>
        </CardHeader>
        <CardContent>
          {/** TODO: Render completed race view */}
          <RaceResultForm race={race} />
        </CardContent>
      </Card>
    </Page>
  );
}
