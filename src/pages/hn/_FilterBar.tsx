import type { StoryType } from "./_types.ts";

interface FilterBarProps {
  storyType: StoryType;
  onStoryTypeChange: (type: StoryType) => void;
  dateRange: { start: Date | null; end: Date | null };
  onDateRangeChange: (start: Date | null, end: Date | null) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
  onReset: () => void;
}

const FilterBar = ({
  storyType,
  onStoryTypeChange,
  dateRange,
  onDateRangeChange,
  limit,
  onLimitChange,
  onReset,
}: FilterBarProps) => {
  const formatDateForInput = (date: Date | null) => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    onDateRangeChange(date, dateRange.end);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    onDateRangeChange(dateRange.start, date);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Story Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rodzaj postów
          </label>
          <select
            value={storyType}
            onChange={(e) => onStoryTypeChange(e.target.value as StoryType)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="topstories">Najpopularniejsze (24h)</option>
            <option value="beststories">Najlepsze</option>
            <option value="newstories">Najnowsze</option>
          </select>
        </div>

        {/* Date Range Start */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data od
          </label>
          <input
            type="date"
            value={formatDateForInput(dateRange.start)}
            onChange={handleStartDateChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Date Range End */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data do
          </label>
          <input
            type="date"
            value={formatDateForInput(dateRange.end)}
            onChange={handleEndDateChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Limit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Liczba postów
          </label>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value={10}>10</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Reset Button */}
      <div className="mt-4">
        <button
          type="button"
          onClick={onReset}
          className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors font-medium"
        >
          Resetuj filtry
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
