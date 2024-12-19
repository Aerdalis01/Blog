import { Article } from "./articleInterface";

export interface Section {
  id: number;
  name: string;
  featured: boolean;
  articles?: Article[];
  
}