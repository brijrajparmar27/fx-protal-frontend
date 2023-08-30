import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import GridContainer from 'components/Grid/GridContainer.jsx';
import GridItem from 'components/Grid/GridItem.jsx';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';

import cx from 'classnames';
import { CMS } from '../../utils/API';
import { Helmet } from 'react-helmet';
// import { module } from 'assets/config';

import contentPageStyle from 'assets/jss/material-dashboard-pro-react/views/contentPageStyle.jsx';
import whatishedgeaccounting from './json/whatishedgeaccounting.json';
import typesofhedgeaccounting from './json/typesofhedgeaccounting.json';
import fxDealPayments from 'assets/s3-json/fxDealPayments.json';
import fxForwards from 'assets/s3-json/fxForwards.json';
import fxRiskManagement from 'assets/s3-json/fxRiskManagement.json';
import fxSpot from 'assets/s3-json/fxSpot.json';
import ourClients from 'assets/s3-json/ourClients.json';
import payments from 'assets/s3-json/payments.json';
import planInformation from 'assets/s3-json/planInformation.json';
import regulatoryInformation from 'assets/s3-json/regulatoryInformation.json';
import whatWeDo from 'assets/s3-json/whatWeDo.json';

import dealsPlanInformation from 'assets/s3-json/dealsPlanInformation.json';
import faq from 'assets/s3-json/faq.json';
import riskPlanInformation from 'assets/s3-json/riskPlanInformation.json';
import valueAdd from 'assets/s3-json/valueAdd.json';
import ourTeam from 'assets/s3-json/ourTeam.json';

const ContentPage = (props) => {
  const [cms, setCms] = useState();
  const { classes, contentPath } = props;

  function componentDidMount() {
    if (contentPath.includes('local')) {
      if (contentPath == 'local-whatishedgeaccounting') {
        setCms(whatishedgeaccounting);
      } else {
        setCms(typesofhedgeaccounting);
      }
    } else {
      console.log(contentPath);
      // if (!sessionStorage.getItem('module') || sessionStorage.getItem('module') === 'RISKS') {
        if (contentPath.includes('fxDealPayments.json')) {
          setCms(fxDealPayments);
        } else if (contentPath.includes('fxForwards.json')) {
          setCms(fxForwards);
        } else if (contentPath.includes('fxRiskManagement.json')) {
          setCms(fxRiskManagement);
        } else if (contentPath.includes('fxSpot.json')) {
          setCms(fxSpot);
        } else if (contentPath.includes('ourClients.json')) {
          setCms(ourClients);
        } else if (contentPath.includes('payments.json')) {
          setCms(payments);
        } else if (contentPath.includes('planInformation.json')) {
          setCms(planInformation);
          window.scrollTo(0, 1000);
        } else if (contentPath.includes('regulatoryInformation.json')) {
          setCms(regulatoryInformation);
        } else if (contentPath.includes('whatWeDo.json')) {
          setCms(whatWeDo);
        } else if (contentPath.includes('dealsPlanInformation.json')) {
          setCms(dealsPlanInformation);
        } else if (contentPath.includes('faq.json')) {
          setCms(faq);
        } else if (contentPath.includes('riskPlanInformation.json')) {
          setCms(riskPlanInformation);
        } else if (contentPath.includes('valueAdd.json')) {
          setCms(valueAdd);
        } else if (contentPath.includes('ourTeam.json')) {
          setCms(ourTeam);
        } else {
          CMS.get(contentPath).then((res) => {
            const cms = res.data;
            setCms(cms);
          });
        }
      // } else {
      //   CMS.get(contentPath).then((res) => {
      //     const cms = res.data;
      //     setCms(cms);
      //   });
      // }
    }
  }

  useEffect(() => {
    componentDidMount();
  }, []);

  useEffect(() => {
    // if (contentPath.includes('planInformation.json')) {
    //   window.scrollTo(0, 650);
    //   console.log(window.scrollY);
    // } else {
    window.scrollTo(0, 0);
    console.log(window.scrollY);
    // }
  }, [cms]);

  const renderContent = (content) => {
    if (typeof content === 'string') {
      return <p className={classes.groupSubtext}>{cms.body.content}</p>;
    } else if (Array.isArray(content)) {
      return createTag(content);
    }
  };

  const formatContent = (content) => {
    if (typeof content === 'string') {
      return content;
    } else if (typeof content === 'object' && !Array.isArray(content)) {
      if (content.type === 'a') {
        return <a href={content.link}>{content.linkText}</a>;
      } else if (content.type === 'p') {
        return content.content;
      } else if (content.type === 'inline') {
        const renderedContent = content.content && content.content.map((pContent) => formatContent(pContent));
        return renderedContent;
      }
    }
  };

  const createTag = (content, wrapperEl) => {
    return content.map((item, key) => {
      if (item.type === 'p' || item.type === 'div') {
        const renderedContent =
          item.content &&
          item.content.map((pContent, pKey) =>
            item.type === 'p' ? (
              <>
                {pKey === 0 && item.heading && (
                  <h4>
                    <b>{item.heading}</b>
                  </h4>
                )}
                <p className={cx(classes.grouptext, classes[item.classes])} key={pKey}>
                  {formatContent(pContent)}
                </p>
              </>
            ) : (
              <div className={cx(classes.grouptext, classes[item.classes])} key={pKey}>
                {formatContent(pContent)}
              </div>
            )
          );

        if (wrapperEl && wrapperEl === 'li')
          return (
            <li key={key}>
              {/* {item.heading && (
                <>
                  <div>{item.heading}</div>
                  <br />
                </>
              )} */}

              {renderedContent && <div className={classes.grouptext}>{renderedContent}</div>}
              {item.afterContent && renderContent(item.afterContent)}
            </li>
          );
        if (wrapperEl && wrapperEl === 'td')
          return (
            <td className={classes.td} key={key}>
              {renderedContent}
            </td>
          );
        return renderedContent;
      } else if (item.type === 'ol') {
        return (
          <ol className={(classes.grouptext, classes[item.classes])} key={key}>
            {createTag(item.content, 'li')}
          </ol>
        );
      } else if (item.type === 'ul') {
        return (
          <ul className={(classes.grouptext, classes.ulStyle)} key={key}>
            {createTag(item.content, 'li')}
          </ul>
        );
      } else if (item.type === 'table') {
        return (
          <div style={{ overflowX: 'auto' }}>
            <table className={classes.table} key={key}>
              <tbody>{createTag(item.content, 'tr')}</tbody>
            </table>
          </div>
        );
      } else if (item.type === 'tr') {
        return <tr key={key}>{createTag(item.content, 'td')}</tr>;
      } else if (item.type === 'text') {
        return <p className={cx(classes[item.classes])}>{item.content}</p>;
      } else {
        return item;
      }
    });
  };
  const SEO = ({ title, description, name, type }) => {
    // console.log('SEO - ', title, description, name, type);
    return (
      <Helmet>
        {/* Standard metadata tags */}
        <title>{title}</title>
        <meta name="description" content={description} />
        {/* End standard metadata tags */}
        {/* Facebook tags */}
        <meta property="og:type" content={type} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {/* End Facebook tags */}
        {/* Twitter tags */}
        <meta name="twitter:creator" content={name} />}
        <meta name="twitter:card" content={type} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {/* End Twitter tags */}
      </Helmet>
    );
  };
  const CMSPrefix = 'https://fxguard-cms.s3.eu-west-2.amazonaws.com/';
  return cms ? (
    <div className={cx(classes.container)}>
      <GridContainer justify="center" className={classes.groupContainer}>
        <GridItem xs={10} sm={10} md={10} lg={8}>
          {/* {console.log(cms)} */}
          {cms.seo &&
            <SEO
              title={cms.seo.title}
              description={cms.seo.description}
              name={cms.seo.name}
              type={cms.seo.type}
            />
          }
          {cms.heading && <h1 className={cx(classes.groupHeader, classes.featureTitleHeader)}>{cms.heading.content}</h1>}
          {cms.body && cms.body.content && renderContent(cms.body.content)}
          {cms.list && (
            <div className={classes.grouptext}>
              {cms.list.map((item, key) => {
                return (
                  <div key={key} style={{ display: window.innerWidth > 768 ? (item.image ? 'flex' : 'block') : 'block' }}>
                    {item.image && (
                      <div>
                        <h3 />
                        <img src={CMSPrefix + item.image.url} alt={'title_' + key} className={classes.titleImage} style={{ width: 300, height: 300, marginRight: 30 }} />
                      </div>
                    )}
                    <div>
                      <h3>{item.heading.content}</h3>
                      <p>{item.body.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </GridItem>
      </GridContainer>
    </div>
  ) : null;
};

ContentPage.propTypes = {
  classes: PropTypes.object.isRequired,
  contentPath: PropTypes.object.isRequired,
};

export default withStyles(contentPageStyle)(ContentPage);
