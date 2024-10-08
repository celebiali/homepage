import Image from 'next/image';
import Link from 'next/link';

import { CONFIG } from '@/config';
import { getBookmarks, getPosts } from '@/lib/posts';
import { calculateReadingTime, reformatDate } from '@/lib/utils';
import { Redis } from '@upstash/redis';

import Header from './header';

const redis = Redis.fromEnv();
export const revalidate = 0;

export default async function Home() {
  let allPosts = getPosts();
  let allBookmarks = getBookmarks();
  const views = (
     await redis.mget<number[]>(
       ...allPosts.map((p) => ['pageviews', 'posts', p.slug].join(':')),
     )
   ).reduce(
   (acc, v, i) => {
      acc[allPosts[i].slug] = v ?? 0;
      return acc;
   },
    {} as Record<string, number>,
   );

  return (
    <>
      <Header />
      <div className="flex flex-col space-y-6 md:space-y-10 pb-8">
        <div className="flex flex-col  md:px-6">
          <div className="flex flex-col space-y-3">
            <span className="font-semibold">About me</span>
            <span className="text-secondaryDarker leading-6">
              {CONFIG.description}
            </span>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          {/* Posts */}
          <div className="flex flex-col space-y-3 ">
            <span className="font-semibold md:px-6 pb-2">Recent Posts</span>
            <div className="flex flex-col space-y-8 md:space-y-1 md:px-2">
              {allPosts
                .filter((post) => post.metadata.featured === 'true')
                .sort((a, b) => {
                  if (
                    new Date(a.metadata.publishedAt) >
                    new Date(b.metadata.publishedAt)
                  ) {
                    return -1;
                  }
                  return 1;
                })
                .slice(0, 3)
                .map((post) => (
                  <Link
                    key={post.slug}
                    href={`/posts/${post.slug}`}
                    className="flex flex-row justify-between items-center duration-300 md:hover:bg-hoverBackground md:p-4 rounded-lg cursor-pointer"
                  >
                    <div className="flex flex-col space-y-2">
                      <span className="text-secondaryDark">
                        {post.metadata.title}
                      </span>
                      <div className="flex flex-row space-x-2 items-center text-secondaryDarker">
                        <span>{reformatDate(post.metadata.publishedAt)}</span>
                        <span className="h-1 w-1 bg-secondaryDarker rounded-full" />
                        <span>
                        <span>
                            {Intl.NumberFormat('en-US', {
                              notation: 'compact',
                            }).format(views[post.slug])}{' '}
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

                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-secondaryDarker"
                    >
                      <path
                        d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
                        fill="currentColor"
                      />
                    </svg>
                  </Link>
                ))}
            </div>
            <Link
              href="/posts"
              className="flex flex-row space-x-2 items-center md:px-6 group cursor-pointer justify-end "
            >
              <div className="mt-6 flex justify-center items-center">
                <span className="text-secondary text-sm  pr-2">Posts</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  className="text-secondary group-hover:translate-x-1 duration-200  "
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M1.25 8A.75.75 0 0 1 2 7.25h10.19L9.47 4.53a.75.75 0 0 1 1.06-1.06l4 4a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 1 1-1.06-1.06l2.72-2.72H2A.75.75 0 0 1 1.25 8"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </Link>
          </div>
          {/* Bookmarks */}
          <div className="flex flex-col space-y-3">
            <span className="font-semibold md:px-6 pb-2">Recent Bookmarks</span>
            <div className="flex flex-col space-y-8 md:space-y-1 md:px-2">
              {allBookmarks
                .sort((a: any, b: any) => {
                  if (
                    new Date(a.metadata.publishedAt) >
                    new Date(b.metadata.publishedAt)
                  ) {
                    return -1;
                  }
                  return 1;
                })
                .slice(0, 3)
                .map((bookmarks: any) => {
                  return (
                    <Link
                      key={bookmarks.slug}
                      href={`${bookmarks.metadata.link}`}
                      className="flex flex-row flex-wrap justify-between items-center duration-300 md:hover:bg-hoverBackground md:p-4 rounded-lg cursor-pointer"
                    >
                      <div className="flex md:flex-row flex-col md:items-center md:justify-center ">
                        <span className="text-secondaryDark">
                          {bookmarks.metadata.title}
                        </span>
                        <span className="h-1 w-1 bg-secondaryDarker rounded-full mx-3 hidden md:block"></span>
                        <span className="text-secondaryDarker md:mt-0 mt-2">
                          {reformatDate(bookmarks.metadata.publishedAt)}
                        </span>
                      </div>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-secondaryDarker"
                      >
                        <path
                          d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
                          fill="currentColor"
                        />
                      </svg>
                    </Link>
                  );
                })}
            </div>
            <Link
              href="/bookmarks"
              className="flex flex-row space-x-2 items-center md:px-6 group cursor-pointer justify-end "
            >
              <div className="mt-6 flex justify-center items-center">
                <span className="text-secondary text-sm  pr-2">Bookmarks</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  className="text-secondary group-hover:translate-x-1 duration-200  "
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M1.25 8A.75.75 0 0 1 2 7.25h10.19L9.47 4.53a.75.75 0 0 1 1.06-1.06l4 4a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 1 1-1.06-1.06l2.72-2.72H2A.75.75 0 0 1 1.25 8"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
