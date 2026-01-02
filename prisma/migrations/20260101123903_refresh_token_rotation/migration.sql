-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_userId_fkey";

-- AlterTable
ALTER TABLE "RefreshToken" ADD COLUMN     "replacedByToken" TEXT,
ADD COLUMN     "revokedAt" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
