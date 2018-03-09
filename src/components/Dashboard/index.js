import React, { Component } from "react";
import styles from "./index.scss";

import { Link } from "react-router-dom";

import communities, { getCommunity } from "src/communities";
import Label from "@app/Label";
import Accordion from "@app/Accordion";
import ellipsis from "@app/ellipsis";
import join from "@app/join";

import JobList from "../JobList";
import ChatroomContent from "../ChatroomContent";

const emptyFn = () => {};

const Box = ({ to, title, children, style, className }) => {
  return (
    <Link
      to={to}
      style={{ flex: 1, ...style }}
      className={join(
        "flex flex-column justify-end bg-white mr1 mr3-ns mb4 br3 w-90 w-40-m w-30-l",
        styles.box,
        className
      )}
    >
      <div className={`${styles.textLayer} pa3 `}>
        <Link to={to} className={`${styles.boxTitle} b dib f4 ttu mb3`}>
          {title}
        </Link>
        <div className={`${styles.boxContent}`}>{children}</div>
      </div>
    </Link>
  );
};

class Dashboard extends Component {
  render() {
    const { state, community, lang } = this.props;
    const jobListProps = {
      pagination: false,
      className: `${styles.jobList} flex-column`,
      state,
      limit: 5,
      community: community || lang
    };

    const headLineClassName = `${styles.headLine} f4`;

    const url = `/${lang}/${state}/${community || lang}`;

    return (
      <div className={`${styles.dashboard} pa3`}>
        {/*<Accordion>
          <div
            tabTitle={
              <div className={headLineClassName}>
                <Label>recentJobs</Label>
              </div>
            }
          >
            <JobList
              {...jobListProps}
              renderJobs={(jobs, totalCount) => {
                const children = jobs.map(job => {
                  return (
                    <div key={job.id} className={`mb3 ${styles.job} db`}>
                      <div className={styles.jobTitle}>
                        {job.title || "Untitled"}
                      </div>
                      <div className={styles.jobDescription}>
                        {ellipsis(job.description, 150)}
                      </div>
                    </div>
                  );
                });

                children.push(
                  <Link
                    key="seeMore"
                    to={`/${lang}/${state}/${community || lang}/jobs`}
                  >
                    see more - there's {Math.max(totalCount - 5, 0)} others
                  </Link>
                );

                return children;
              }}
            />
          </div>

          <div tabTitle={<Label>recentChat</Label>}>
            <ChatroomContent
              limit={10}
              showLoading={false}
              showForm={false}
              showEditIcons={false}
              state={state}
              lang={lang}
              community={community || lang}
            />
          </div>

          <div
            className={headLineClassName}
            tabTitle={<Label>businessOnSale</Label>}
          >
            ...
          </div>
            </Accordion>*/}
        <div className={"mb3 fw3 f3"}>
          {" "}
          <Label values={{ community: getCommunity(community).label }}>
            dashboardWelcome
          </Label>
        </div>
        <div className="flex flex-wrap">
          <Box
            to={`${url}/jobs`}
            title="Jobs"
            style={{
              //            background: 'url("https://s3.us-east-2.amazonaws.com/mysalonusa/uploads/banner_cards/find_jobs2.jpg") center/cover'
              background:
                'url("https://s3.us-east-2.amazonaws.com/mysalonusa/uploads/banner_cards/post_jobs.jpg") center/cover'
            }}
          >
            <Label values={{ count: <b>54</b> }}>xrecentjobs</Label>
            <br />
            <Label values={{ period: <b>2</b> }}>inperiod</Label>
          </Box>
          <Box
            to={`${url}/jobs`}
            title="Business on sale"
            style={{
              background:
                'url("https://s3.us-east-2.amazonaws.com/mysalonusa/uploads/banner_cards/Business_On_Sale_2.jpg") center/cover'
            }}
          >
            <Label values={{ count: <b>4</b> }}>xrecentjobs</Label>
            <br />
            <Label values={{ period: <b>3</b> }}>inperiod</Label>
          </Box>
          <Box to={`${url}/jobs`} title="Chatroom">
            There are 54 recent jobs posted int he last 2 weeks
          </Box>
          <Box
            to={`${url}/jobs`}
            title="Post a job"
            style={{
              background:
                'url("https://s3.us-east-2.amazonaws.com/mysalonusa/uploads/banner_cards/find_jobs2.jpg") center/cover',
              backgroundPositionX: "40%"
            }}
          >
            There are 54 recent jobs posted int he last 2 weeks
          </Box>
        </div>
      </div>
    );
  }
}

export default Dashboard;
