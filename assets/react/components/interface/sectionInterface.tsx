import { Article } from "./articleInterface";

export interface Section {
  id: number;
  name: string;
  article?: Article[];
  
}