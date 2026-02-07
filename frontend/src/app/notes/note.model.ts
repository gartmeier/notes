export interface Note {
  id: number;
  content: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface NoteRequest {
  content: string;
}
