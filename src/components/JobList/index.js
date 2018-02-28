import React from "react";
import PropTypes from "prop-types";

import join from "@app/join";

import { fetchJobs } from "src/api";

import Button from '@app/Button'
import Label from '@app/Label'

import ApplyButton from "src/components/ApplyButton";
import ApplyOverlay from "src/components/ApplyOverlay";

import PaginationToolbar from "src/components/PaginationToolbar";

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

    this.onSkipChange = this.onSkipChange.bind(this);
    this.renderJobs = this.renderJobs.bind(this)
    this.updateJobViews = this.updateJobViews.bind(this)
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
    this.fetchJobs(skip);
    this.setState({
      skip
    });
  }

  fetchJobs(skip = 0, props = this.props) {
    const { community, state, limit } = props;
    this.setState({
      loading: true
    });
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
    const { limit, pagination, className } = this.props;

    return (
      <div className={join("pa3 flex flex-column", styles.jobList, className)}>
        {pagination ? <PaginationToolbar
          skip={skip}
          className="mb3"
          totalCount={totalCount}
          limit={limit}
          onSkipChange={this.onSkipChange}
        /> : null}
        {this.renderJobs()}
        {!this.state.initialLoading && pagination ? (
          <PaginationToolbar
            skip={skip}
            totalCount={totalCount}
            limit={limit}
            onSkipChange={this.onSkipChange}
          />
        ) : null}
        {this.renderApplyOverlay()}
      </div>
    );
  }

  renderJobs() {
    const { jobs } = this.state
    if (this.props.renderJobs) {
      return this.props.renderJobs(jobs, this.state.totalCount)
    }
    return <div className="w-100 center inline-flex flex-wrap ">
      {jobs.map(this.renderJob, this)}
    </div>
  }

  renderJob(job, index) {
    if (this.props.renderJob) {
      return this.props.renderJob(job, index)
    }
    return (
      <div
        key={job.id || index}
        className={join(
          "flex flex-column bg-white mr1 mr3-ns mb4 ba br3 w-90 w-40-m w-30-l",
          styles.job
        )}
      >
        <div className={join("pa3 bb", styles.jobTitle)}>{job.title} <div>({job.views || 0} <Label>views</Label>)</div></div>
        <div className={join("pa3 bb", styles.jobDescription)}>
          {job.description}
        </div>
        <div className={join("pa3", styles.jobApplySection)}>
          <ApplyButton
            onClick={() => {
              this.setState({
                applyForJob: job,
                viewOnly: false
              });
            }}
          />

          <Button
            onClick={() => {
              this.setState({
                applyForJob: job,
                viewOnly: true
              });
            }}
          ><Label>viewDetails</Label></Button>

        </div>
      </div>
    );
  }

  updateJobViews(job, views) {
    const { jobs } = this.state

    this.setState({
      jobs: jobs.map(j => {
        if (j.id == job.id) {
          j = { ...j, views }
        }

        return j
      })
    })
  }

  renderApplyOverlay() {
    const { applyForJob } = this.state;

    if (!applyForJob) {
      return null;
    }
    return (
      <ApplyOverlay
        readOnly={this.state.viewOnly}
        job={applyForJob}
        updateJobViews={this.updateJobViews}
        onDismiss={() => {
          this.setState({
            viewOnly: null,
            applyForJob: null
          });
        }}
      />
    );
  }
}

JobList.defaultProps = {
  limit: 5,
  pagination: true
};

JobList.propTypes = {
  limit: PropTypes.number,
  pagination: PropTypes.bool
};
export default JobList;
