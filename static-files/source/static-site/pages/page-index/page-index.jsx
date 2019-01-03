/*
name: Page Index
path: /
*/
import React from 'react';

import pages from '../../pages.js';

const PageIndex = () => {
  const groups = pages.reduce((accumulator, page) => {
    const group = accumulator[page.group] || [];
    return { ...accumulator, [page.group]: group.concat(page) };
  }, {});

  const pageGroups = Object.entries(groups)
    .map(([groupName, pages]) => ({
      name: groupName,
      pages: pages.sort((a, b) => a.name.localeCompare(b.name))
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap'
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
              <li key={page.path}>
                <a href={page.path} style={{ color: 'black' }}>
                  {page.name || page.path}
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
