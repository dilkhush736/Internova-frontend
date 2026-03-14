import React from "react";

function CourseHeader({ course }) {
  if (!course) return null;

  return (
    <div className="course-header-card premium-hero-card">
      <div className="course-header-left">
        <p className="section-kicker">Internova Learning Dashboard</p>
        <h1 className="course-header-title">{course.title}</h1>
        <p className="course-header-subtitle">
          {course.category} • {course.durationLabel}
        </p>

        <div className="hero-status-row">
          <span className="hero-status-pill success-pill">{course.status}</span>
          <span className="hero-status-pill info-pill">
            Certificate: {course.certificateStatus}
          </span>
        </div>
      </div>

      <div className="course-header-meta">
        <div className="course-meta-box premium-meta-box">
          <span className="course-meta-label">Enrolled On</span>
          <strong>
  {course.enrolledDate
    ? new Date(course.enrolledDate).toLocaleDateString()
    : "N/A"}
</strong>
        </div>

        <div className="course-meta-box premium-meta-box">
          <span className="course-meta-label">Duration</span>
          <strong>{course.durationLabel}</strong>
        </div>

        <div className="course-meta-box premium-meta-box">
          <span className="course-meta-label">Category</span>
          <strong>{course.category}</strong>
        </div>
      </div>
    </div>
  );
}

export default CourseHeader;