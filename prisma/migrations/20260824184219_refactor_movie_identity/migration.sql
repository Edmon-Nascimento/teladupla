/*
  Warnings:

  - A unique constraint covering the columns `[tmdbId,mediaType]` on the table `movies` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mediaType` to the `movies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tmdbId` to the `movies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
CREATE SEQUENCE movies_id_seq;
ALTER TABLE "movies" ADD COLUMN     "mediaType" TEXT NOT NULL,
ADD COLUMN     "tmdbId" INTEGER NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('movies_id_seq');
ALTER SEQUENCE movies_id_seq OWNED BY "movies"."id";

-- CreateIndex
CREATE UNIQUE INDEX "movies_tmdbId_mediaType_key" ON "movies"("tmdbId", "mediaType");
