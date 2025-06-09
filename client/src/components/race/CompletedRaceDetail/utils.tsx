import { Trophy, Medal, Award } from "lucide-react";

export const getMedalColor = (position: number) => {
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

export const getPositionSuffix = (position: number) => {
  if (position >= 11 && position <= 13) return "th";
  switch (position % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export const getMedalIcon = (position: number) => {
  switch (position) {
    case 1:
      return <Trophy className="w-4 h-4" />;
    case 2:
      return <Medal className="w-4 h-4" />;
    case 3:
      return <Award className="w-4 h-4" />;
    default:
      return null;
  }
};
