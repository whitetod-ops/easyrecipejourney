'use client';

import { algoliasearch } from 'algoliasearch';
import { InstantSearch, SearchBox, Hits, RefinementList, Configure, useInstantSearch } from 'react-instantsearch';
import RecipeCard from '@/components/RecipeCard';

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!,
);
const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'recipes';

function Hit({ hit }: { hit: any }) {
  return (
    <RecipeCard
      slug={hit.slug}
      title={hit.title}
      cuisine={hit.cuisine}
      course={hit.course}
      total_time={hit.total_time}
      photo={hit.photo}
    />
  );
}

function NoResults() {
  const { results } = useInstantSearch();
  if (!results || results.nbHits > 0) return null;
  return (
    <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#9A8070',
      gridColumn: '1 / -1', textAlign: 'center', padding: '2rem 0' }}>
      No recipes found. Try a different search or browse by cuisine.
    </p>
  );
}

export default function RecipesSearch({ initialQuery }: { initialQuery?: string }) {
  return (
    <InstantSearch searchClient={searchClient} indexName={indexName} routing>
      <Configure hitsPerPage={60} query={initialQuery} />

      <div style={{ marginBottom: 24, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <SearchBox
          placeholder="Search recipes, ingredients, cuisines..."
          defaultValue={initialQuery}
          classNames={{
            root: '',
            form: '',
            input: '',
            submit: '',
            reset: '',
          }}
          style={{ flex: 1 }}
        />
      </div>

      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
        <aside style={{ minWidth: 160, flexShrink: 0 }}>
          <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 11,
            fontWeight: 600, color: '#9A8070', textTransform: 'uppercase',
            letterSpacing: '0.08em', marginBottom: 10 }}>
            Cuisine
          </p>
          <RefinementList
            attribute="cuisine"
            limit={15}
            showMore
            classNames={{ list: '', item: '', label: '', checkbox: '', count: '', showMore: '' }}
          />
        </aside>

        <div style={{ flex: 1 }}>
          <Hits
            hitComponent={Hit}
            classNames={{
              root: '',
              list: '',
              item: '',
            }}
          />
          <NoResults />
        </div>
      </div>

      <style>{`
        .ais-SearchBox-form { display: flex; gap: 8px; }
        .ais-SearchBox-input {
          flex: 1; padding: 10px 16px; border-radius: 8px;
          border: 1px solid #E0D0C0; background: #fff;
          font-family: "Plus Jakarta Sans", sans-serif; font-size: 14px;
          color: #2C2018; outline: none;
        }
        .ais-SearchBox-input:focus { border-color: #9A8070; }
        .ais-SearchBox-submit, .ais-SearchBox-reset {
          padding: 10px 18px; border-radius: 8px; border: none; cursor: pointer;
          font-family: "Plus Jakarta Sans", sans-serif; font-size: 13px; font-weight: 600;
        }
        .ais-SearchBox-submit { background: #2C2018; color: #E8D5C0; }
        .ais-SearchBox-reset { background: #F0EBE4; color: #9A8070; }
        .ais-Hits-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px; list-style: none; padding: 0; margin: 0;
        }
        .ais-Hits-item { padding: 0; }
        .ais-RefinementList-list { list-style: none; padding: 0; margin: 0; }
        .ais-RefinementList-item { margin-bottom: 6px; }
        .ais-RefinementList-label {
          display: flex; align-items: center; gap: 8px; cursor: pointer;
          font-family: "Plus Jakarta Sans", sans-serif; font-size: 13px; color: #2C2018;
        }
        .ais-RefinementList-checkbox { accent-color: #2C2018; }
        .ais-RefinementList-count {
          background: #F0EBE4; color: #9A8070; border-radius: 10px;
          padding: 1px 7px; font-size: 11px; margin-left: auto;
        }
        .ais-RefinementList-showMore {
          margin-top: 8px; background: none; border: none; cursor: pointer;
          font-family: "Plus Jakarta Sans", sans-serif; font-size: 12px; color: #8B5E3C;
          padding: 0;
        }
      `}</style>
    </InstantSearch>
  );
}
