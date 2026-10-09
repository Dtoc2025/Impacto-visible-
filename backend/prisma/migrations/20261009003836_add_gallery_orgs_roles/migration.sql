-- AlterTable
ALTER TABLE `categories` ADD COLUMN `color` VARCHAR(191) NULL,
    ADD COLUMN `icon` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `projects` ADD COLUMN `beneficiaries` INTEGER NULL,
    ADD COLUMN `gallery` JSON NULL,
    ADD COLUMN `impact` TEXT NULL,
    ADD COLUMN `latitude` DOUBLE NULL,
    ADD COLUMN `longitude` DOUBLE NULL,
    ADD COLUMN `organizerId` INTEGER NULL,
    ADD COLUMN `subtitle` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `avatarUrl` VARCHAR(191) NULL,
    ADD COLUMN `bio` TEXT NULL,
    ADD COLUMN `country` VARCHAR(191) NULL,
    ADD COLUMN `organizationName` VARCHAR(191) NULL,
    ADD COLUMN `website` VARCHAR(191) NULL,
    MODIFY `role` ENUM('ADMIN', 'ORG', 'DONOR') NOT NULL DEFAULT 'DONOR';

-- CreateIndex
CREATE INDEX `projects_organizerId_idx` ON `projects`(`organizerId`);

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_organizerId_fkey` FOREIGN KEY (`organizerId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
