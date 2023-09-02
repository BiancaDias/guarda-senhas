import { PrismaService } from  "../../src/prisma/prisma.service";

export class NotesFactory {
  private noteTitle: string;
  private note: string;
  private userId: number;

  constructor(private readonly prisma: PrismaService) { }

  setUserId(userId: number){
    return this.userId = userId;
  }

  setnoteTitle(noteTitle: string){
    return this.noteTitle = noteTitle
  }

  setNote(note: string){
    
    return this.note = note
  }

  build() {
    return {
      noteTitle: this.noteTitle,
      note: this.note,
      userId: this.userId
    }
  }
  async persist() {
    const data = this. build();
    return await this.prisma.notes.create({data})
  }
}