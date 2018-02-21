import React from "react";

import join from "@app/join";

import { fetchJobs } from "src/api";

import ApplyButton from "src/components/ApplyButton";
import ApplyOverlay from "src/components/ApplyOverlay";
import styles from "./index.scss";

class JobList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      applyForJob: null,
      jobs: []
    };
  }

  componentWillReceiveProps(nextProps) {
    const { state, community } = nextProps;

    if (state != this.props.state || community != this.props.community) {
      this.setState(
        {
          jobs: []
        },
        () => {
          this.fetchJobs(nextProps);
        }
      );
    }
  }

  componentWillMount() {
    this.fetchJobs();
  }

  fetchJobs(props = this.props) {
    const { community, state } = props;
    fetchJobs({
      skip: 0,
      limit: 2,
      community,
      state
    }).then(jobs => {
      this.setState({
        jobs
      });
    });
  }
  render() {
    //const { jobs } = this.props
    // t.string   "nickname",     null: false
    // t.string   "email",        null: false
    // t.text     "description",  null: false
    // t.integer  "community_id"
    // t.integer  "city_id"
    // t.datetime "created_at",   null: false
    // t.datetime "updated_at",   null: false
    // t.integer  "state_id"
    // t.string   "alias"
    const { jobs } = this.state;

    return (
      <div className={join("pa3 ", styles.jobList)}>
        <div className="w-100 center flex flex-wrap justify-around">
          {jobs.map(this.renderJob, this)}
        </div>
        {this.renderApplyOverlay()}
      </div>
    );
  }

  renderJob(job, index) {
    return (
      <div
        key={job.id || index}
        style={{ minWidth: "20rem" }}
        className={join(
          "flex flex-column bg-white mw5 mw6-ns mr1 mb4 ba br3",
          styles.job
        )}
      >
        <div className={join("pa3 bb", styles.jobTitle)}>{job.title}</div>
        <div className={join("pa3 bb", styles.jobDescription)}>
          {job.description}
        </div>
        <div className={join("pa3", styles.jobApplySection)}>
          <ApplyButton
            onClick={() => {
              this.setState({
                applyForJob: job
              });
            }}
          />
        </div>
      </div>
    );
  }

  renderApplyOverlay() {
    const { applyForJob } = this.state;

    if (!applyForJob) {
      return null;
    }
    return (
      <ApplyOverlay
        job={applyForJob}
        onDismiss={() => {
          this.setState({
            applyForJob: null
          });
        }}
      />
    );
  }
}

export default JobList;
