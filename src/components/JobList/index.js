import React from "react";
import PropTypes from 'prop-types'

import join from "@app/join";

import { fetchJobs } from "src/api";

import ApplyButton from "src/components/ApplyButton";
import ApplyOverlay from "src/components/ApplyOverlay";

import PaginationToolbar from 'src/components/PaginationToolbar'

import styles from "./index.scss";

class JobList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      applyForJob: null,
      loading: true,
      skip: 0,
      initialLoading: true,
      jobs: []
    };

    this.onSkipChange = this.onSkipChange.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { state, community } = nextProps;

    if (state != this.props.state || community != this.props.community) {
      this.setState(
        {
          jobs: [],
          totalCount: 0
        },
        () => {
          this.fetchJobs(0, nextProps);
        }
      );
    }
  }

  componentWillMount() {
    this.fetchJobs(0);
  }

  onSkipChange(skip) {
    this.fetchJobs(skip)
    this.setState({
      skip
    })
  }

  fetchJobs(skip = 0, props = this.props) {
    const { community, state, limit } = props;
    this.setState({
      loading: true
    })
    fetchJobs({
      skip,
      limit,
      community,
      state
    }).then(({ jobs, totalCount }) => {
      this.setState({
        jobs,
        loading: false,
        initialLoading: false,
        totalCount
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
    const { jobs, totalCount, skip } = this.state;
    const { limit } = this.props

    return (
      <div className={join("pa3 flex flex-column", styles.jobList)}>
        <PaginationToolbar skip={skip} className="mb3" totalCount={totalCount} limit={limit} onSkipChange={this.onSkipChange} />
        <div className="w-100 center inline-flex flex-wrap ">
          {jobs.map(this.renderJob, this)}
        </div>
        {!this.state.initialLoading && <PaginationToolbar skip={skip} totalCount={totalCount} limit={limit} onSkipChange={this.onSkipChange} />}
        {this.renderApplyOverlay()}
      </div>
    );
  }

  renderJob(job, index) {
    return (
      <div
        key={job.id || index}
        className={join(
          "flex flex-column bg-white mr1 mr3-ns mb4 ba br3 w-90 w-40-m w-30-l",
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

JobList.defaultProps = {
  limit: 5
}

JobList.propTypes = {
  limit: PropTypes.number
}
export default JobList;
