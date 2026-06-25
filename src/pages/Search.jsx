import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchUsers, getUser, searchRepos } from '../services/githubApi';
import { useDebounce } from '../hooks/useDebounce';
import { usePagination } from '../hooks/usePagination';
import { useSettings } from '../context/SettingsContext';
import UserCard from '../components/users/UserCard';
import RepoCard from '../components/repositories/RepoCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import Pagination from '../components/common/Pagination';
import Tabs from '../components/common/Tabs';
import './Search.css';

const LANGUAGES = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go',
  'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'C#',
];

/**
 * Search Page — Advanced search with filters, tabs, URL sync, debouncing.
 * Combines Module 2 (User Search) and Module 7 (Advanced Search).
 */
export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { defaultSearchType, paginationSize } = useSettings();

  // Read initial values from URL query parameters
  const initialQuery = searchParams.get('q') || '';
  const initialType = searchParams.get('type') || defaultSearchType;
  const initialLang = searchParams.get('language') || '';
  const initialStars = searchParams.get('stars') || '';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  const [query, setQuery] = useState(initialQuery);
  const [searchType, setSearchType] = useState(initialType);
  const [language, setLanguage] = useState(initialLang);
  const [stars, setStars] = useState(initialStars);
  const [results, setResults] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debouncedQuery = useDebounce(query, 500);

  const pagination = usePagination(totalCount, paginationSize);

  // Set initial page from URL
  useEffect(() => {
    if (initialPage > 1) pagination.setPage(initialPage);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const tabs = useMemo(() => [
    { id: 'users', label: 'Users', icon: '👤' },
    { id: 'repositories', label: 'Repositories', icon: '📦' },
  ], []);

  // Sync search state to URL
  const updateUrl = useCallback(
    (params) => {
      const newParams = new URLSearchParams();
      if (params.q) newParams.set('q', params.q);
      if (params.type && params.type !== 'users') newParams.set('type', params.type);
      if (params.language) newParams.set('language', params.language);
      if (params.stars) newParams.set('stars', params.stars);
      if (params.page && params.page > 1) newParams.set('page', params.page.toString());
      setSearchParams(newParams, { replace: true });
    },
    [setSearchParams]
  );

  // Perform search
  const performSearch = useCallback(async () => {
    if (!debouncedQuery.trim() && searchType === 'users') {
      setResults(null);
      setTotalCount(0);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (searchType === 'users') {
        // Try exact user match first, then search
        try {
          const exactUser = await getUser(debouncedQuery.trim());
          // Also do a search for more results
          const searchResult = await searchUsers(debouncedQuery.trim(), pagination.currentPage, paginationSize);
          // Put exact match first if not already in results
          const items = searchResult.items || [];
          const hasExact = items.some((u) => u.login.toLowerCase() === debouncedQuery.trim().toLowerCase());
          const finalItems = hasExact ? items : [exactUser, ...items];

          setResults(finalItems);
          setTotalCount(searchResult.total_count || finalItems.length);
        } catch {
          // Exact match failed, fall back to search
          const searchResult = await searchUsers(debouncedQuery.trim(), pagination.currentPage, paginationSize);
          setResults(searchResult.items || []);
          setTotalCount(searchResult.total_count || 0);
        }
      } else {
        // Repository search with filters
        const filters = {
          query: debouncedQuery.trim(),
          language,
          stars,
        };
        const searchResult = await searchRepos(filters, pagination.currentPage, paginationSize);
        setResults(searchResult.items || []);
        setTotalCount(searchResult.total_count || 0);
      }
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, searchType, language, stars, pagination.currentPage, paginationSize]);

  // Trigger search when debounced query or filters change
  useEffect(() => {
    performSearch();
    updateUrl({
      q: debouncedQuery,
      type: searchType,
      language,
      stars,
      page: pagination.currentPage,
    });
  }, [debouncedQuery, searchType, language, stars, pagination.currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTabChange = (type) => {
    setSearchType(type);
    setResults(null);
    setTotalCount(0);
    pagination.setPage(1);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🔍 Search</h1>
        <p>Find GitHub users and repositories</p>
      </div>

      {/* Search Tabs */}
      <Tabs tabs={tabs} activeTab={searchType} onChange={handleTabChange} />

      {/* Search Input & Filters */}
      <div className="search-controls card">
        <div className="search-input-wrapper">
          <span className="search-input-icon">🔍</span>
          <input
            type="text"
            className="search-main-input"
            placeholder={
              searchType === 'users'
                ? 'Search users (e.g., torvalds, gaearon)...'
                : 'Search repositories...'
            }
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              pagination.setPage(1);
            }}
            autoFocus
          />
          {query && (
            <button className="search-clear btn-ghost btn-icon" onClick={() => setQuery('')}>
              ✕
            </button>
          )}
        </div>

        {/* Repo filters */}
        {searchType === 'repositories' && (
          <div className="search-filters">
            <div className="filter-group">
              <label>Language</label>
              <select
                value={language}
                onChange={(e) => { setLanguage(e.target.value); pagination.setPage(1); }}
              >
                <option value="">All Languages</option>
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Min Stars</label>
              <input
                type="number"
                placeholder="e.g., 1000"
                value={stars}
                onChange={(e) => { setStars(e.target.value); pagination.setPage(1); }}
                min="0"
              />
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="search-results">
        {loading && <LoadingSpinner text="Searching GitHub..." />}

        {error && <ErrorMessage message={error} onRetry={performSearch} />}

        {!loading && !error && results && results.length === 0 && (
          <div className="empty-state card">
            <div className="empty-state-icon">🔍</div>
            <h3>No results found</h3>
            <p>Try a different search term or adjust your filters.</p>
          </div>
        )}

        {!loading && !error && results && results.length > 0 && (
          <>
            <p className="results-count text-sm mb-4">
              Showing {results.length} of {totalCount.toLocaleString()} results
            </p>
            <div className={`results-grid ${searchType === 'users' ? 'grid grid-2' : ''} stagger-children`}>
              {searchType === 'users'
                ? results.map((user) => (
                    <UserCard key={user.id} user={user} />
                  ))
                : results.map((repo) => (
                    <RepoCard key={repo.id} repo={repo} />
                  ))}
            </div>

            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={pagination.setPage}
              pageRange={pagination.pageRange}
              hasNextPage={pagination.hasNextPage}
              hasPrevPage={pagination.hasPrevPage}
            />
          </>
        )}

        {!loading && !error && !results && (
          <div className="empty-state card">
            <div className="empty-state-icon">✨</div>
            <h3>Start searching</h3>
            <p>
              {searchType === 'users'
                ? 'Enter a username to find GitHub developers.'
                : 'Search for repositories or browse by language.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
