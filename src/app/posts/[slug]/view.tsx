'use client';

import { useEffect } from 'react';

export const ReportView: React.FC<{ slug: string }> = ({ slug }) => {
  useEffect(() => {
    const visitedPages = JSON.parse(
      localStorage.getItem('visitedPages') || '{}',
    );
    if (!visitedPages[slug]) {
      fetch('/api/increment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug }),
      });
      visitedPages[slug] = true;
      localStorage.setItem('visitedPages', JSON.stringify(visitedPages));
    }

    return () => {
      visitedPages[slug] = false;
      localStorage.setItem('visitedPages', JSON.stringify(visitedPages));
    };
  }, [slug]);

  return null;
};
