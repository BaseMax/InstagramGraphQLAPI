/*
  Warnings:

  - A unique constraint covering the columns `[notification_token]` on the table `NotificationToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "NotificationToken_notification_token_key" ON "NotificationToken"("notification_token");
