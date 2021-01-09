-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "parent_id" TEXT;

-- AddForeignKey
ALTER TABLE "Comment" ADD FOREIGN KEY("parent_id")REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
