import { Comment } from "./commentInterface";
import { Image } from "./imageInterface";

export interface Article {
    id: number;
    title: string;
    author: string;
    text: string;
    comment?: Comment;
    image?: Image;
    sectionId: number;
  }
  
