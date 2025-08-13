"use client";

import { ExternalLink } from "@/components/Layout";
import { Trans, useLingui } from "@lingui/react/macro";
import Image from "next/image";
import Link from "next/link";
import { FaXTwitter } from "react-icons/fa6";
import logoText from "./logo-text.svg";

export const Footer = () => {
  return (
    <footer className="border-t-gray-200 border-t-2 border-solid">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 ">
        <div className="mx-auto max-w-7xl px-6 pb-8 pt-20 sm:pt-24 lg:px-8 lg:pt-32">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="grid grid-cols-2 gap-8 xl:col-span-2">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <Image src={logoText} alt="Canada Spends Logo" height={300} />
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                      <Link
                        href="/about"
                        className="text-sm/6 text-gray-600 hover:text-gray-900"
                      >
                        <Trans>About Us</Trans>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="https://buildcanada.com/get-involved"
                        target="_blank"
                        className="text-sm/6 text-gray-600 hover:text-gray-900"
                      >
                        <Trans>Get Involved</Trans>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/contact"
                        className="text-sm/6 text-gray-600 hover:text-gray-900"
                      >
                        <Trans>Contact</Trans>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-10 xl:mt-0 flex flex-col gap-2">
              <h3 className="text-sm/6 font-semibold text-gray-900">
                <Trans>Subscribe to our newsletter</Trans>
              </h3>
              <p className="text-sm/6 text-gray-600">
                <Trans>Get weekly recaps of current events and updates from our team.</Trans>
              </p>
              <a 
                href="https://buildcanada.substack.com/subscribe"
                target="_blank"
                className="bg-indigo-950 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 rounded-md w-fit"
              >
                Subscribe
              </a>
            </div>
          </div>

          <div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 md:flex md:items-center md:justify-between lg:mt-24">
            <div className="flex gap-x-6 md:order-2">
              <ExternalLink
                href="https://x.com/canada_spends"
                className="text-gray-600 hover:text-gray-800"
              >
                <span className="sr-only">X</span>
                <FaXTwitter aria-hidden="true" className="size-6" />
              </ExternalLink>
            </div>
            <p className="mt-8 text-sm/6 text-gray-600 md:order-1 md:mt-0">
              <Trans>
                &copy; 2025 Canada Spends. All rights reserved. A Project of{" "}
                <ExternalLink
                  href="https://www.buildcanada.com"
                  className="underline text-gray-900 font-bold"
                >
                  Build Canada
                </ExternalLink>
                .
              </Trans>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
