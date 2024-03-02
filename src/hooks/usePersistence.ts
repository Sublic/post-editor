"use client";
import { useEffect, useState } from "react";

type PersistedState = {
  title: string;
  brief: string;
  markdown: string;
  images: Array<{ url: string }>;
  bucket: string;
};

const defaultPersistedState: PersistedState = {
  title: "",
  brief: "",
  markdown: "",
  images: [],
  bucket: "",
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
  const { title, brief, markdown, images, bucket } = state;

  // Update functions for each piece of state
  const setTitle = (title: string) => setState(prev => ({ ...prev, title }));
  const setBrief = (brief: string) => setState(prev => ({ ...prev, brief }));
  const setBucket = (bucket: string) => setState(prev => ({ ...prev, bucket }));
  const setMarkdown = (markdownInput: string | ((currentMarkdown: string) => string)) => {
    setState((prevState) => {
      // Determine the new markdown based on whether markdownInput is a function or a string
      const newMarkdown = typeof markdownInput === 'function' ? markdownInput(prevState.markdown) : markdownInput;
      // Return the updated state
      return { ...prevState, markdown: newMarkdown };
    });
  };
  
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
    bucket,
    setBucket,
  };
}
