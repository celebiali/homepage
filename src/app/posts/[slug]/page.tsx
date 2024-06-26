import { cache, Suspense } from 'react';

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import MaxWidthWrapper from '@/components/max-width-wrapper';
import { CustomMDX } from '@/components/mdx';
import { getPosts } from '@/lib/posts';
import { calculateReadingTime, reformatDate } from '@/lib/utils';
import { Redis } from '@upstash/redis';

import { ReportView } from './view';

const redis = Redis.fromEnv();
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: any;
}): Promise<Metadata | undefined> {
  const post = getPosts().find((post) => post.slug === params.slug);
  if (!post) {
    return;
  }
  let { metadata, slug, content } = post;
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
      url: `https://www.alicelebi.com/posts/${post.slug}`,
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
  const post = getPosts().find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }
  const views =
    (await redis.get<number>(['pageviews', 'posts', params.slug].join(':'))) ??
    0;

  return (
    <div className="w-full">
      <ReportView slug={post.slug} />
      <div className="flex flex-row space-x-4 mb-6 text-sm text-secondaryDarker">
        <Link
          href="/"
          className="hover:text-secondaryDark duration-200 hover:underline"
        >
          Home
        </Link>
        <Link
          href="/posts"
          className="hover:text-secondaryDark duration-200 hover:underline"
        >
          More Posts
        </Link>
      </div>
      <h1 className="title font-medium text-2xl tracking-tighter max-w-[650px]">
        {post.metadata.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-2 text-sm max-w-[650px]">
        <div className="flex flex-row space-x-2 items-center text-secondaryDarker">
          <span>{reformatDate(post.metadata.publishedAt)}</span>
          <span className="h-1 w-1 bg-secondaryDarker rounded-full" />
          <span>
            <span>
              {Intl.NumberFormat('en-US', { notation: 'compact' }).format(
                views,
              )}{' '}
              {' views'}
            </span>
          </span>
          <span className="h-1 w-1 bg-secondaryDarker rounded-full" />
          <span>
            <span>
              {calculateReadingTime(post.content)}
              {' min read'}
            </span>
          </span>
        </div>
      </div>
      <div className="py-6">
        <Link
          key={post.slug}
          href={`/posts?tag=${post.metadata.tag}`}
          className="border  hover:border-secondaryDarker duration-200 rounded px-1.5 py-1 border-neutral-800 items-center flex text-secondaryDarker hover:text-secondaryDark"
          style={{ width: 'fit-content' }}
        >
          #{post.metadata.tag}
        </Link>
      </div>
      <article className="prose prose-invert pb-10">
        <CustomMDX source={post.content} />
      </article>
    </div>
  );
}
