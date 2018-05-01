import React from "react";
import PropTypes from "prop-types";

import join from "@app/join";
import ellipsis from "@app/ellipsis";
import Overlay from "@app/Overlay";

import Loader from "@app/Loader";

import { fetchJobs, incrementJobView } from "src/api";

import Button from "@app/Button";
import Label from "@app/Label";
import PostJobForm from "src/components/PostAJob/PostJobForm";

import ApplyButton from "src/components/ApplyButton";
import ApplyOverlay from "src/components/ApplyOverlay";

import PaginationToolbar from "src/components/PaginationToolbar";

import styles from "./index.scss";
import ViewAndApply from "../ViewAndApply";

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
    this.renderJobs = this.renderJobs.bind(this);
    this.updateJobViews = this.updateJobViews.bind(this);
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
        <div className="flex flex-row flex-wrap">
          {pagination ? (
            <PaginationToolbar
              skip={skip}
              className="mb3 mr3"
              totalCount={totalCount}
              limit={limit}
              onSkipChange={this.onSkipChange}
            />
          ) : null}
          <div style={{ flex: 1 }} />
          <Button
            className="mb3  pv2 bg-white"
            onClick={() =>
              this.setState({
                showPostJob: true
              })
            }
          >
            <Label>postAJob</Label>
          </Button>
        </div>
        {this.renderJobs()}
        {this.renderPostJobOverlay()}
        {!this.state.initialLoading && pagination && jobs.length > limit ? (
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

  renderPostJobOverlay() {
    if (!this.state.showPostJob) {
      return null;
    }
    return (
      <Overlay
        closeable
        onClose={() => {
          this.setState({ showPostJob: false });
        }}
      >
        <PostJobForm
          onSuccess={() => {
            this.setState({ showPostJob: false });
            this.onSkipChange(0);
          }}
          lang={this.props.lang}
          state={this.props.state}
          community={this.props.community}
        />
      </Overlay>
    );
  }

  renderJobs() {
    const { jobs, loading } = this.state;
    if (this.props.renderJobs) {
      return this.props.renderJobs(jobs, this.state.totalCount);
    }
    return (
      <div className="w-100 center mb3 inline-flex flex-wrap ">
        {this.renderLoading()}
        {jobs.map(this.renderJob, this)}

        {!jobs.length && !loading ? <Label>noJobs</Label> : null}
      </div>
    );
  }

  renderLoading() {
    if (!this.state.loading) {
      return null;
    }
    return (
      <div className={"tc w-100 absolute z-1"}>
        <Loader size={20} />
      </div>
    );
  }

  renderJob(job, index) {
    if (this.props.renderJob) {
      return this.props.renderJob(job, index);
    }

    const title = (
      <div className={`${styles.title} fw5`}>
        {job.title || ellipsis(job.description, 50)}
      </div>
    );

    return (
      <div
        onClick={() => {
          this.setState({
            applyForJob: job,
            viewOnly: true
          });
        }}
        key={job.id || index}
        className={join(
          "flex flex-column mh3  mv1 br2 bg-white w-100 ",
          styles.job
        )}
      >
        <svg
          className={styles.viewIcon}
          height="24"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
        </svg>
        <div className={join("pa3", styles.jobTitle)}>
          {title}
          <div className={`${styles.views} fw2`}>
            {job.views || 0} <Label>views</Label>
          </div>
        </div>
      </div>
    );
  }

  updateJobViews(job) {
    incrementJobView(job).then(({ views }) => {
      this.setState({
        jobs: this.state.jobs.map(j => {
          if (j.id == job.id) {
            j = { ...j, views };
          }

          return j;
        })
      });
    });
  }

  renderApplyOverlay() {
    const { applyForJob } = this.state;

    if (!applyForJob) {
      return null;
    }
    const job = applyForJob;

    return (
      <ViewAndApply
        job={job}
        lang={this.props.lang}
        community={this.props.community}
        state={this.props.state}
        onDismiss={applied => {
          this.setState({ applyForJob: null });
          this.updateJobViews(job);
        }}
      />
    );

    return (
      <Overlay
        closeable
        onClose={() => {
          this.setState({ applyForJob: null });
          this.updateJobViews(job);
        }}
      >
        <PostJobForm
          step="apply"
          defaultValues={job}
          onApplyClick={() => {
            this.setState({
              applyForJob: null
            });
            //this.onApply(job, this.state.jobToViewMessage);
          }}
          lang={this.props.lang}
          state={this.props.state}
          community={this.props.community}
        />
      </Overlay>
    );
  }
}

JobList.defaultProps = {
  limit: 25,
  pagination: true
};

JobList.propTypes = {
  limit: PropTypes.number,
  pagination: PropTypes.bool
};
export default JobList;
