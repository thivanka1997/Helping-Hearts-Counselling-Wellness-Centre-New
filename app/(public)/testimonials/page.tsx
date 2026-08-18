'use client';

import React, { useState, useEffect } from 'react';
import { TestimonialsPage } from '@/components/public/TestimonialsPage';
import { api } from '@/lib/api-client';
import { Testimonial } from '@/src/types';
import { initialTestimonials } from '@/src/data/initialData';

export default function TestimonialsRoutePage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);

  useEffect(() => {
    api.getTestimonials().then(setTestimonials).catch(() => {});
  }, []);

  return <TestimonialsPage testimonials={testimonials} />;
}
