import { Tag } from '../../../components/ui/Tag.jsx';

export function TimelineFilter({ tags, years, activeTag, activeYear, onTagChange, onYearChange }) {
  return (
    <div className="flex flex-col gap-3" role="group" aria-label="Filter photos">
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Tag as="button" active={!activeTag} onClick={() => onTagChange(null)}>
            All
          </Tag>
          {tags.map((tag) => (
            <Tag key={tag} as="button" active={activeTag === tag} onClick={() => onTagChange(tag)}>
              {tag}
            </Tag>
          ))}
        </div>
      )}
      {years.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Tag as="button" active={!activeYear} onClick={() => onYearChange(null)} className="!bg-oxblood-100">
            All years
          </Tag>
          {years.map((year) => (
            <Tag
              key={year}
              as="button"
              active={activeYear === year}
              onClick={() => onYearChange(year)}
              className="!bg-oxblood-100"
            >
              {year}
            </Tag>
          ))}
        </div>
      )}
    </div>
  );
}
