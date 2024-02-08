"use client";
import { useEffect, useState } from "react";

type PersistedState = {
  title: string;
  brief: string;
  markdown: string;
  images: Array<{ url: string }>;
};

const defaultPersistedState: PersistedState = {
  title: "",
  brief: "",
  markdown: "",
  images: [],
};

const PERSISTENCE_KEY = "SUBLIC_PERSISTED_ARTICLE";

export function usePersistence(ignorePersisted?: boolean) {
  const fromLocalStorage: PersistedState =
    PERSISTENCE_KEY in localStorage && !ignorePersisted
      ? JSON.parse(localStorage.getItem(PERSISTENCE_KEY)!)
      : defaultPersistedState;
  const [title, setTitle] = useState(fromLocalStorage.title);
  const [brief, setBrief] = useState(fromLocalStorage.brief);
  const [images, setImages] = useState<Array<{ url: string }>>(
    fromLocalStorage.images
  );
  const [markdown, setMarkdown] = useState(fromLocalStorage.markdown);

  useEffect(() => {
    const state: PersistedState = {
      title,
      brief,
      markdown,
      images,
    };
    localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state));
  }, [title, brief, markdown, images]);

  return {
    title,
    setTitle,
    brief,
    setBrief,
    images,
    setImages,
    markdown,
    setMarkdown,
  };
}
