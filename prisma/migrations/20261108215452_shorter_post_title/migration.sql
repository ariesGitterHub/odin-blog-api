/*
  Warnings:

  - You are about to alter the column `post_message` on the `posts` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "post_message" SET DATA TYPE VARCHAR(100);
