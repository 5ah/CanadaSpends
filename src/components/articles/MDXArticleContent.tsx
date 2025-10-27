"use client";

import { MDXComponents } from "@/components/mdx-components";
import { ComponentType } from "react";

interface MDXArticleContentProps {
  MDXContent: ComponentType;
}

export function MDXArticleContent({ MDXContent }: MDXArticleContentProps) {
  // Pass components directly to the MDX component
  // This is how Next.js MDX works in the app router
  return <MDXContent components={MDXComponents} />;
}
