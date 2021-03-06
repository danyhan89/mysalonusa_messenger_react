import React from "react";

import join from "@app/join";
import Label from "@app/Label";
import ApplyButton from "src/components/ApplyButton";

import styles from "./index.scss";

const JobMessage = ({ job, onApplyClick, className, onViewClick }) => {
  return (
    <div
      key={job.id || index}
      className={join(
        "flex flex-column bg-white mr1 mr3-ns mb4 br2 w-90 w-40-m w-30-l",
        className,
        styles.job
      )}
    >
      <div className={join("pa2 flex flex-row items-center", styles.jobTitle)}>
        {job.title}
        <div className={join("dib pa br2 pa1", styles.newJob)}>
          <Label>newJob</Label>
        </div>
        <div className="flex-auto" />
        <div className="dib">
          ({job.views || 0} <Label>views</Label>)
        </div>
      </div>
      <div className={join("pa2", styles.jobDescription)}>
        {job.description}
      </div>
      <div
        className={join(
          "pa2 flex flex-row items-center",
          styles.jobApplySection
        )}
      >
        <ApplyButton onClick={onApplyClick} />
        <div className="flex-auto" />
        <div
          className={`${styles.viewDetails} dib i fw3 ml2 `}
          onClick={onViewClick}
        >
          <Label>viewDetails</Label>
        </div>
      </div>
    </div>
  );
};

export default JobMessage;
