import React from 'react';

import { getBookmarks } from '@/lib/posts';
import { Redis } from '@upstash/redis';

import Bookmarks from './bookmarks';

const redis = Redis.fromEnv();
export const revalidate = 0;

export const metadata = {
  title: 'Bookmarks',
  description: 'Read my thoughts.',
};

export default async function BookmarksPage() {
  let allBookmarks = getBookmarks();
  let publishedBookmarks = allBookmarks.filter(
    (bookmarks) => !bookmarks.metadata.isDraft,
  );


  return <Bookmarks allBookmarks={publishedBookmarks} />;
}
