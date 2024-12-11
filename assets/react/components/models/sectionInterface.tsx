import { Article } from "./articleInterface";

export interface Section {
  id: number;
  name: string;
  articles?: Article[];
  
}