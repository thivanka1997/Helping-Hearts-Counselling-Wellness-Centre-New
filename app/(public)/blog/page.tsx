'use client';

import React, { useState, useEffect } from 'react';
import { BlogPage } from '@/components/public/BlogPage';
import { api } from '@/lib/api-client';
import { BlogArticle } from '@/src/types';
import { initialBlogs } from '@/src/data/initialData';

export default function BlogRoutePage() {
  const [blogs, setBlogs] = useState<BlogArticle[]>(initialBlogs);

  useEffect(() => {
    api.getBlogs().then(setBlogs).catch(() => {});
  }, []);

  return <BlogPage blogs={blogs} />;
}
