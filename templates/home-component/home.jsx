import React from 'react';
import PropTypes from 'prop-types';

const Home = ({ pageGroups }) => (
  <div className="home">
    <style>{`
      .home {
        display: flex;
        flex-wrap: wrap;
      }
    `}</style>
    <h1 className="name" style={{ width: '100%' }}>
      $projectName
    </h1>
    {pageGroups.map(group => (
      <div key={group.title} style={{ width: 300 }}>
        <p style={{ margin: 0 }}>{group.title}</p>
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

Home.propTypes = {
  pageGroups: PropTypes.array
};

Home.defaultProps = {
  pages: []
};

export default Home;
