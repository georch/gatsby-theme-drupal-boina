/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

require('babel-polyfill');

const path = require('path');
const dotenv = require('dotenv');

const configPostCss = path.resolve(__dirname, './');

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`
});

exports.onCreateWebpackConfig = ({
  actions, loaders
}) => {
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.(s(a|c)ss|css)$/,
          loaders: [
            {
              loader: 'sass-resources-loader',
              options: {
                resources: path.resolve(__dirname, './src/nucleon/protons.scss')
              }
            }
          ]
        },
        {
          test: /\.(woff|woff2|eot|ttf|svg)$/,
          include: configPostCss,
          use: 'url-loader'
        },
        {
          test: /\.js$/,
          include: path.dirname(require.resolve('@weknow/gatsby-theme-drupal-boina')),
          use: [loaders.js()]
        }
      ]
    }
  });
};

exports.onCreateNode = ({
  node, actions
}) => {
  if (node.internal.type === 'MarkdownRemark') {
    const { createNodeField } = actions;
    // Create a slug value as a field on the node.
    createNodeField({
      node,
      name: 'slug',
      value: node.frontmatter.path
    });

    // Create a tags field on the node.
    createNodeField({
      node,
      name: 'tags',
      value: node.frontmatter.tags
    });
  }
};

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;

  const articleTemplate = path.resolve(__dirname, './src/components/templates/article/index.js');
  // const pageTemplate = path.resolve(__dirname, './src/components/templates/page/index.js');
  const tagsTemplate = path.resolve(__dirname, './src/components/templates/tags/index.js');

  return graphql(
    `
      {
        allMarkdownRemark {
          edges {
            node {
              html
              frontmatter {
                title
                path
              }
              fields {
                slug
              }
            }
          }
        }
      }
    `
  ).then((result) => {
    if (result.errors) {
      reject(result.errors);
    }

    // create pages
    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      createPage({
        path: node.fields.slug,
        component: articleTemplate,
        context: {
          slug: node.fields.slug
        }
      });
    });

    return null;
  });
};
