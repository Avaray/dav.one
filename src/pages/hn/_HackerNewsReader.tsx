import { useEffect, useState } from "react";
import StoryList from "./_StoryList.tsx";
import FilterBar from "./_FilterBar.tsx";
import type { Story, StoryType } from "./_types.ts";

const API_BASE = "https://hacker-news.firebaseio.com/v0";

const HackerNewsReader = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [storyType, setStoryType] = useState<StoryType>("topstories");
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [limit, setLimit] = useState(30);

  useEffect(() => {
    fetchStories();
  }, [storyType, limit]);

  useEffect(() => {
    applyFilters();
  }, [stories, dateRange]);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/${storyType}.json`);
      const storyIds: number[] = await response.json();

      const storyPromises = storyIds.slice(0, limit).map((id) =>
        fetch(`${API_BASE}/item/${id}.json`).then((res) => res.json())
      );

      const fetchedStories = await Promise.all(storyPromises);
      const validStories = fetchedStories.filter(
        (story) => story && !story.deleted && !story.dead,
      );

      setStories(validStories);
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...stories];

    if (dateRange.start || dateRange.end) {
      filtered = filtered.filter((story) => {
        const storyDate = new Date(story.time * 1000);
        if (dateRange.start && storyDate < dateRange.start) return false;
        if (dateRange.end && storyDate > dateRange.end) return false;
        return true;
      });
    }

    setFilteredStories(filtered);
  };

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setDateRange({ start, end });
  };

  const handleReset = () => {
    setDateRange({ start: null, end: null });
    setStoryType("topstories");
    setLimit(30);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-gray-100">
      <header className="bg-orange-500 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white">Hacker News Reader</h1>
          <p className="text-orange-100 mt-1">
            Proste i czytelne przeglądanie Hacker News
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <FilterBar
          storyType={storyType}
          onStoryTypeChange={setStoryType}
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          limit={limit}
          onLimitChange={setLimit}
          onReset={handleReset}
        />

        {loading
          ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
            </div>
          )
          : (
            <>
              <div className="mb-4 text-gray-600">
                Wyświetlanie {filteredStories.length} postów
              </div>
              <StoryList stories={filteredStories} />
            </>
          )}
      </main>

      <footer className="bg-gray-800 text-gray-300 py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>
            Dane z{" "}
            <a
              href="https://news.ycombinator.com/"
              className="text-orange-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hacker News API
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HackerNewsReader;
