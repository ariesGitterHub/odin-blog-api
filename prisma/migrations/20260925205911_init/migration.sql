/*
  Warnings:

  - Added the required column `post_title` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "post_title" VARCHAR(255) NOT NULL,
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false;
