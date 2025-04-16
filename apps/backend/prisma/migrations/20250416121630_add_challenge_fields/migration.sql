-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('easy', 'medium', 'hard');

-- AlterTable
ALTER TABLE "Challenge" ADD COLUMN     "category" TEXT,
ADD COLUMN     "difficulty" "Difficulty" NOT NULL DEFAULT 'easy',
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
