import React, { Component } from "react";
import styles from "./index.scss";

import { Link } from "react-router-dom";

import communities from "src/communities";
import Label from "@app/Label";
import Accordion from "@app/Accordion";
import ellipsis from "@app/ellipsis";

import JobList from "../JobList";
import ChatroomContent from "../ChatroomContent";

const emptyFn = () => {};

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

    return (
      <div className={`${styles.dashboard} pa3`}>
        <Accordion>
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
        </Accordion>
      </div>
    );
  }
}

export default Dashboard;
