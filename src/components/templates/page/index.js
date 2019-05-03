import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import Img from 'gatsby-image';
import Layout from '../layout';
import './style.scss';

const dateFormat = require('date-fns/format');

const Page = ({ data }) => {
  const { domain } = data.site.siteMetadata;
  return (
    <Layout
      showFooterCta
      darkMenu
      postUrl={domain}
      postTitle={data.site.siteMetadata.settings.field_name}
      postDesc={data.site.siteMetadata.settings.field_description}
      postDate={dateFormat(new Date(), 'MMMM Do, YYYY')}
      postImage={`${domain}${data.nodePage.relationships.field_image.relationships.field_media_image.localFile.childImageSharp.fluid.src}`}
    >
      <div className="c-page u-push-top--inside--9x u-push-bottom--inside--4x">
        <div className="grid-container align-center">
          <div className="c-page__content cell medium-10 large-8 xlarge-8 small-11 grid-x grid-margin-x align-center">
            <div className="cell medium-6 small-11 large-6">
              <Img
                fluid={
                  data.nodePage.relationships.field_image.relationships.field_media_image.localFile.childImageSharp.fluid
                }
                alt={data.site.siteMetadata.settings.field_name}
              />
            </div>
            <div className="cell medium-6 small-11 large-6">
              <h1 className="c-page__title">{data.nodePage.title}</h1>
              <div dangerouslySetInnerHTML={{ __html: data.nodePage.fields.markdownBody.childMarkdownRemark.html }} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default Page;

export const query = graphql`
  query($slug: String!) {
    site{
      siteMetadata{
        domain
        settings {
          field_name
          field_slogan
          field_description
        }
      }
    }
    markdownRemark(fields:{slug:{eq:$slug}}){
      html
      frontmatter {
        title
        path
        image {
          childImageSharp {
            fluid {
              src
            }
          }
        }
      }
      fields {
        slug
        created_formatted
      }
    }
  }
`;

Page.propTypes = {
  data: PropTypes.object
};

Page.defaultProps = {
  data: null
};
