import type { Story } from "./_types.ts";
import StoryItem from "./_StoryItem.tsx";

interface StoryListProps {
  stories: Story[];
}

const StoryList = ({ stories }: StoryListProps) => {
  if (stories.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
        Brak postów do wyświetlenia
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {stories.map((story, index) => <StoryItem key={story.id} story={story} index={index + 1} />)}
    </div>
  );
};

export default StoryList;
