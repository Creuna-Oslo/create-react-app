/* eslint-env node */
/* eslint-disable no-console */
function createJsxFileContents(
  componentName,
  componentPascalName,
  humanReadableName
) {
  if (!componentName || !componentPascalName) {
    console.log('👻  You must specify a component name.');

    process.exit(1);
  }

  const head = `
    // ${humanReadableName || componentPascalName}
    import React from 'react';
    import Layout from '../../layout';
    
    import content from './${componentName}.json';`;

  const tail = `export default ${componentPascalName}`;

  return `${head}

    const ${componentPascalName} = () => (
      <Layout>
        {/* ------------------------- 📝 ------------------------- */}
      </Layout>
    );

    ${tail}`;
}

module.exports = createJsxFileContents;
