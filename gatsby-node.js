/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

require('babel-polyfill');

const dateFormat = require('date-fns/format');
const path = require('path');
// const _isEmpty = require('lodash/isEmpty');
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
    // Fix missing fields on GraphQL schema
    // for (const prop in node) {
    //   if (prop.match(/^field_.*/)) {
    //     if (node[prop] === null) {
    //       node[prop] = '';
    //     }
    //   }
    // }

    const { createNodeField } = actions;
    // Create a slug value as a field on the node.
    const slug = node.frontmatter.path;
    createNodeField({
      node,
      name: 'slug',
      value: slug
    });

    // Create a formatted date field on the node.
    createNodeField({
      node,
      name: 'created_formatted',
      value: dateFormat(new Date(node.date), 'YYYY-MM-Do')
    });
  }
};

// Implement the Gatsby API “createPages”. This is called once the
// data layer is bootstrapped to let plugins create pages from data.
exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
    const articleTemplate = path.resolve(__dirname, './src/components/templates/article-md/index.js');
    // const pageTemplate = path.resolve(__dirname, './src/components/templates/page/index.js');
    // const tagsTemplate = path.resolve(__dirname, './src/components/templates/tags/index.js');
    // page building queries
    graphql(
      `
        {
          allMarkdownRemark(
            sort: { fields: [frontmatter___date], order: DESC }
            limit: 1000
          ) {
            edges {
              node {
                fields {
                  slug
                }
                frontmatter {
                  title
                  path
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
      // pages for each node__article
      result.data.allMarkdownRemark.edges.forEach(({ node }) => {
        createPage({
          path: node.fields.slug,
          component: articleTemplate,
          context: {
            slug: node.fields.slug
          }
        });
      });

      resolve();
    });
  });
};

// exports.createPages = ({ graphql, actions }) => {
//   const { createPage } = actions;

//   return graphql(`
//       {
//         # Articles Posts
//         allMarkdownRemark(
//           sort: { fields: [frontmatter___date], order: DESC }
//           limit: 1000
//         ) {
//           edges {
//             node {
//               fields {
//                 slug
//               }
//               frontmatter {
//                 title
//                 path
//               }
//             }
//           }
//         }
//       }
//     `).then((result) => {
//     if (result.errors) {
//       throw result.errors;
//     }

//     // Create articles pages.
//     const posts = result.data.allMarkdownRemark.edges;

//     posts.forEach(({ post }) => {
//       console.log(post); // eslint-disable-line
//       createPage({
//         path: post.node.fields.slug,
//         component: path.resolve(__dirname, './src/components/templates/article-md/index.js'),
//         context: {
//           slug: post.node.fields.slug
//         }
//       });
//     });

//     return null;
//   });
// };

// exports.onCreateNode = ({ node, actions }) => {
//   const { createNodeField } = actions;

//   if (node.internal.type === 'MarkdownRemark') {
//     const slug = node.frontmatter.path;
//     createNodeField({
//       name: 'slug',
//       node,
//       value: slug
//     });
//   }
// };
