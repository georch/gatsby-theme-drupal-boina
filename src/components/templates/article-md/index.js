import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';

const ArticlePage = ({ post }) => (
  <div>
    <h1>{post.frontmatter.title}</h1>
    <p
      style={{
        display: 'block'
      }}
    >
      {post.frontmatter.date}
    </p>
    <div>
      <blockquote
        style={{
          ...scale(-1 / 10),
          borderLeft: '0.31415926rem solid #cccccc',
          display: 'block',
          marginBottom: rhythm(0.5),
          marginTop: rhythm(-0.5)
        }}
      >
        Escrito por:
        {' '}
        <strong>{post.frontmatter.author}</strong>
      </blockquote>
    </div>
    <hr />
    <div dangerouslySetInnerHTML={{ __html: post.html }} />
    <hr />
  </div>
);
export default ArticlePage;

export const query = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        author
        image {
          childImageSharp {
            fluid {
              src
            }
          }
        }
      }
    }
  }
`;

ArticlePage.propTypes = {
  post: PropTypes.object
};

ArticlePage.defaultProps = {
  post: null
};
