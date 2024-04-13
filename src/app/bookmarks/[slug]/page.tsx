import { cache, Suspense } from 'react';



import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';



import MaxWidthWrapper from '@/components/max-width-wrapper';
import { CustomMDX } from '@/components/mdx';
import { getBookmarks } from '@/lib/posts';
import { calculateReadingTime, reformatDate } from '@/lib/utils';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: any;
}): Promise<Metadata | undefined> {
  const bookmarks = getBookmarks().find(
    (bookmarks) => bookmarks.slug === params.slug,
  );
  if (!bookmarks) {
    return;
  }
  let { metadata, slug, content, tag } = bookmarks;
  let ogImage = metadata.image
    ? `https://www.alicelebi.com${metadata.image}`
    : `https://www.alicelebi.com/og?title=${metadata.title}`;

  return {
    title: metadata.title,
    description: metadata.summary,
    openGraph: {
      title: metadata.title,
      description: metadata.summary,
      type: 'article',
      url: `https://www.alicelebi.com/bookmarks/${bookmarks.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.summary,
      images: [ogImage],
    },
  };
}

export default async function Blog({ params }: { params: any }) {
  const bookmarks = getBookmarks().find(
    (bookmarks) => bookmarks.slug === params.slug,
  );

  if (!bookmarks) {
    notFound();
  }

  return (
    <div className="w-full">
      <div className="flex flex-row space-x-4 mb-6 text-sm text-secondaryDarker">
        <Link
          href="/"
          className="hover:text-secondaryDark duration-200 hover:underline"
        >
          Home
        </Link>
      </div>
      <h1 className="title font-medium text-2xl tracking-tighter max-w-[650px]">
        {bookmarks.metadata.title}
      </h1>
      <div className="py-6">
        <Link
          key={bookmarks.slug}
          href={`/bookmarks?tag=${bookmarks.metadata.tag}`}
          className="border  hover:border-secondaryDarker duration-200 rounded px-1.5 py-1 border-neutral-800 items-center flex text-secondaryDarker hover:text-secondaryDark"
          style={{ width: 'fit-content' }}
        >
          #{bookmarks.metadata.tag}
        </Link>
      </div>
      <article className="prose prose-invert pb-10">
        <CustomMDX source={bookmarks.content} />
      </article>
    </div>
  );
}