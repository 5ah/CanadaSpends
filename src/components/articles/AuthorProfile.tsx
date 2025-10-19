import Image from "next/image";
import { Author } from "@/lib/articles";
import { FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FiGlobe } from "react-icons/fi";

interface AuthorProfileProps {
  author: Author;
}

export function AuthorProfile({ author }: AuthorProfileProps) {
  return (
    <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
      {/* Author Photo */}
      {author.photo && (
        <div className="flex-shrink-0">
          <Image
            src={author.photo}
            alt={author.name}
            width={80}
            height={80}
            className="rounded-full"
          />
        </div>
      )}

      {/* Author Info */}
      <div className="flex-1">
        <h4 className="text-lg font-bold text-gray-900 mb-1">{author.name}</h4>

        <p className="text-sm text-gray-600 mb-3">{author.bio}</p>

        {/* Social Links */}
        {author.social && (
          <div className="flex gap-3">
            {author.social.twitter && (
              <a
                href={`https://x.com/${author.social.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900 transition-colors"
                aria-label={`${author.name} on X (Twitter)`}
              >
                <FaSquareXTwitter className="w-5 h-5" />
              </a>
            )}

            {author.social.linkedin && (
              <a
                href={`https://linkedin.com/in/${author.social.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900 transition-colors"
                aria-label={`${author.name} on LinkedIn`}
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
            )}

            {author.social.website && (
              <a
                href={author.social.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900 transition-colors"
                aria-label={`${author.name}'s website`}
              >
                <FiGlobe className="w-5 h-5" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
