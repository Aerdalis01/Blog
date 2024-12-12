export interface Comment {
      id: number;
      author: string;
      text: string;
      articleId: number;
      createdAt?: string;
      updatedAt?: string;
      isFlag?: boolean;
      moderationStatus?: string;

    }
  