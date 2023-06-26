-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "reciptientId" INTEGER,
ADD COLUMN     "senderId" INTEGER;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_reciptientId_fkey" FOREIGN KEY ("reciptientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
