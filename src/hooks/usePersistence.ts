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
  // Initialize state without directly accessing localStorage
  const [state, setState] = useState<PersistedState>(defaultPersistedState);

  useEffect(() => {
    // This effect runs once on mount, and hence, it's client-side only
    const fromLocalStorage = PERSISTENCE_KEY in localStorage && !ignorePersisted
      ? JSON.parse(localStorage.getItem(PERSISTENCE_KEY) || 'null') // Use 'null' to safely handle missing or malformed data
      : defaultPersistedState;

    setState(fromLocalStorage);
  }, [ignorePersisted]);

  useEffect(() => {
    // Persist state to localStorage whenever state changes
    // This effect also ensures it runs client-side only
    localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state));
  }, [state]);

  // Break down state to individual pieces for convenience
  const { title, brief, markdown, images } = state;

  // Update functions for each piece of state
  const setTitle = (title: string) => setState(prev => ({ ...prev, title }));
  const setBrief = (brief: string) => setState(prev => ({ ...prev, brief }));
  const setMarkdown = (markdown: string) => setState(prev => ({ ...prev, markdown }));
  const setImages = (images: Array<{ url: string }>) => setState(prev => ({ ...prev, images }));

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
