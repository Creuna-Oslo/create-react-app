// Eksempelgruppe/eksempelside
import React from 'react';

import Layout from '../../layout';

import content from './example-page.json';

const ExamplePage = () => (
  <Layout showFooter={false} showHeader={false}>
    <div className="example-page">
      <h1 data-title>{content.title}</h1>
      <div>
        <img src={content.image} />
      </div>
      <button
        data-back-button
        type="button"
        onClick={() => history && history.back()}
      >
        {content.buttonText}
      </button>
    </div>
  </Layout>
);

ExamplePage.propTypes = {};

export default ExamplePage;
