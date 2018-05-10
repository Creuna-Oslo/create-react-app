// Eksempelgruppe/eksempelside
import React from 'react';

import Layout from '../../layout';

import content from './example-page.json';

const ExamplePage = () => (
  <Layout showFooter={false} showHeader={false}>
    <div className="example-page">
      <h1>{content.title}</h1>
      <img src={content.image} />
    </div>
  </Layout>
);

ExamplePage.propTypes = {};

export default ExamplePage;
