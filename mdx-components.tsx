import type { MDXComponents as MDXComponentsType } from "mdx/types";
import { MDXComponents as components } from "./src/components/mdx-components";

// This File Is Required By Next.js For MDX Support
// It Exports The Custom Components To Use In MDX Files
export function useMDXComponents(
  customComponents: MDXComponentsType,
): MDXComponentsType {
  return {
    ...components,
    ...customComponents,
  };
}
