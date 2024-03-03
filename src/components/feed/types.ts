export type ArticlePreview = {
  name: string;
  description: string;
  id: string;
};

export type Article = ArticlePreview & {
  text: string;
};
