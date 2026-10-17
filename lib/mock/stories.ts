import { IG } from "../site";

export type StoryCategory = "Islands & beaches" | "Mountains & hills" | "Cities & culture";

export type Story = {
  category: StoryCategory;
  slug: string;
  packageSlug: string;
  title: string;
  kicker: string;
  image: string;
  read: string;
  /** Optional captions for the photo carousel, in order (cover first, then the trip gallery). */
  captions?: string[];
  /** Paragraphs; a line starting with "## " is a sub-heading. */
  body: string[];
  sourceUrl: string;
};

import { storiesA } from "./stories-a";
import { storiesB } from "./stories-b";

/** Itinerary stories. Written from the routes we publish and general destination knowledge, not customer testimonials. */
export const stories: Story[] = [...storiesA, ...storiesB];

export const getStory = (slug: string) => stories.find((s) => s.slug === slug);
