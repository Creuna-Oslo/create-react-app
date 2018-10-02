/*
name: Page Index
path: /
*/
import React from 'react';

import pages from '../pages.js';

const PageIndex = () => {
  const groups = {};

  pages.forEach(page => {
    const group = page.group || 'Ungrouped';

    if (!groups[group]) {
      groups[group] = [];
    }

    groups[group].push(page);
  });

  const pageGroups = Object.keys(groups).map(groupName => ({
    name: groupName,
    pages: groups[groupName]
  }));

  return (
    <div
      style={{
        display: 'flex',
        'flex-wrap': 'wrap'
      }}
    >
      {pageGroups.map(group => (
        <div key={group.name} style={{ width: 300 }}>
          <p style={{ margin: 0 }}>{group.name}</p>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              marginBottom: 40,
              marginTop: 10
            }}
          >
            {group.pages.map(page => (
              <li key={page.url}>
                <a href={page.url} style={{ color: 'black' }}>
                  {page.name || page.url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PageIndex;
