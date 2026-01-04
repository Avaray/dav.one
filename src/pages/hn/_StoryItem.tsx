import type { Story } from "./_types.ts";

interface StoryItemProps {
  story: Story;
  index: number;
}

const StoryItem = ({ story, index }: StoryItemProps) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min temu`;
    if (diffHours < 24) return `${diffHours}h temu`;
    if (diffDays < 7) return `${diffDays}d temu`;

    return date.toLocaleDateString("pl-PL");
  };

  const getDomain = (url?: string) => {
    if (!url) return null;
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return null;
    }
  };

  const storyUrl = story.url ||
    `https://news.ycombinator.com/item?id=${story.id}`;
  const domain = getDomain(story.url);

  return (
    <div className="rounded-lg over:shadow-md transition-shadow p-4 border border-base-content/5">
      <div className="flex gap-4">
        {/* Index */}
        <div className="shrink-0 text-gray-400 font-mono text-sm w-8">
          {index}.
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            <a
              href={storyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-600 transition-colors"
            >
              {story.title}
            </a>
            {domain && (
              <span className="ml-2 text-sm text-gray-500 font-normal">
                ({domain})
              </span>
            )}
          </h2>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              {story.score} punktów
            </span>
            <span>
              przez <span className="font-medium">{story.by}</span>
            </span>
            <span>{formatDate(story.time)}</span>
            {story.descendants !== undefined && (
              <a
                href={`https://news.ycombinator.com/item?id=${story.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-600 transition-colors"
              >
                {story.descendants} komentarzy
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryItem;
