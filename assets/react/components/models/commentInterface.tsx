interface Author {
  id: number;
  pseudo: string;
}


export interface Comment {
      id: number;
      text: string;
      articleId: number;
      createdAt?: string;
      updatedAt?: string;
      isFlag?: boolean;
      moderationStatus?: string;
      authorId?: number;
      author?: Author; 
}
  