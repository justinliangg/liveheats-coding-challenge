import { Badge } from "../../ui/badge";
import { Race } from "@/types";
import { getMedalColor, getMedalIcon, getPositionSuffix } from "./utils";

interface CompletedRaceDetailProps {
  race: Race;
}

export const CompletedRaceDetail: React.FC<CompletedRaceDetailProps> = ({ race }) => {
  const sortedParticipantsByPosition = race?.participants?.sort((a, b) => (a?.position ?? 0) - (b?.position ?? 0));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Race Results</h3>
      </div>

      <div className="space-y-3">
        {sortedParticipantsByPosition.map((participant) => {
          const position = participant.position!;
          const isTopThree = position <= 3;

          return (
            <div
              key={participant.student.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                isTopThree ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Badge className={`min-w-[50px] justify-center ${getMedalColor(position)}`}>
                  <span className="flex items-center gap-1">
                    {getMedalIcon(position)}
                    {position}
                    {getPositionSuffix(position)}
                  </span>
                </Badge>
                <div>
                  <p className="font-medium">{participant.student.name}</p>
                  <p className="text-sm text-gray-600">Lane {participant.lane}</p>
                </div>
              </div>

              {isTopThree && (
                <div className="text-right">
                  <Badge variant="outline" className={getMedalColor(position)}>
                    {position === 1 ? "🥇 Gold Medal" : position === 2 ? "🥈 Silver Medal" : "🥉 Bronze Medal"}
                  </Badge>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
