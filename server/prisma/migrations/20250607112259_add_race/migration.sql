-- CreateTable
CREATE TABLE "race" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "race_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "race_participant" (
    "id" UUID NOT NULL,
    "race_id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "lane" INTEGER NOT NULL,
    "position" INTEGER,

    CONSTRAINT "race_participant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "race_participant_race_id_student_id_key" ON "race_participant"("race_id", "student_id");

-- CreateIndex
CREATE UNIQUE INDEX "race_participant_race_id_lane_key" ON "race_participant"("race_id", "lane");

-- AddForeignKey
ALTER TABLE "race_participant" ADD CONSTRAINT "race_participant_race_id_fkey" FOREIGN KEY ("race_id") REFERENCES "race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "race_participant" ADD CONSTRAINT "race_participant_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
