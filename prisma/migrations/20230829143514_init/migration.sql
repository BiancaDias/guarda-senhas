-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credential" (
    "id" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "credentialTitle" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "credential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note" (
    "id" SERIAL NOT NULL,
    "noteTitle" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credcard" (
    "id" SERIAL NOT NULL,
    "cardTitle" TEXT NOT NULL,
    "cardNumber" TEXT NOT NULL,
    "cardName" TEXT NOT NULL,
    "secutityCode" INTEGER NOT NULL,
    "expirationDate" TEXT NOT NULL,
    "password" INTEGER NOT NULL,
    "virtual" BOOLEAN NOT NULL,
    "isCredit" BOOLEAN NOT NULL,
    "isDebit" BOOLEAN NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "credcard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "credential_userId_credentialTitle_key" ON "credential"("userId", "credentialTitle");

-- CreateIndex
CREATE UNIQUE INDEX "note_userId_noteTitle_key" ON "note"("userId", "noteTitle");

-- CreateIndex
CREATE UNIQUE INDEX "credcard_userId_cardTitle_key" ON "credcard"("userId", "cardTitle");

-- AddForeignKey
ALTER TABLE "credential" ADD CONSTRAINT "credential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note" ADD CONSTRAINT "note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credcard" ADD CONSTRAINT "credcard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
