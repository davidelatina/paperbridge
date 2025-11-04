export interface Document {
  id: number;
  title?: string;
  filePath: string;
  content?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}
