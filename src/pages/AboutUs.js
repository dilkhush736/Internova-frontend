import React, { useEffect } from "react";
import { Link } from "react-router-dom";

function AboutUs() {
  useEffect(() => {
    document.title =
      "InternovaTech - Online Internships, Verified Certificates and Tech Training";

    const metaDescription = document.querySelector('meta[name="description"]');
    const previousDescription = metaDescription?.getAttribute("content") || "";

    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "InternovaTech offers online internships in Web Development, Data Science, Artificial Intelligence, Finance and more with practical learning, assessments, progress tracking and verified certificates."
      );
    }

    let canonicalTag = document.querySelector('link[rel="canonical"]');
    const canonicalAlreadyExists = !!canonicalTag;

    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalTag);
    }

    canonicalTag.setAttribute("href", "https://www.internovatech.com/");

    return () => {
      document.title =
        "InternovaTech - Online Internships, Certificates and Tech Training";

      if (metaDescription) {
        metaDescription.setAttribute("content", previousDescription);
      }

      if (!canonicalAlreadyExists && canonicalTag) {
        canonicalTag.remove();
      }
    };
  }, []);

  return (
    <>
      <style>{`
        .about-page-wrap {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(59,130,246,0.12), transparent 30%),
            radial-gradient(circle at bottom right, rgba(37,99,235,0.12), transparent 32%),
            linear-gradient(135deg, #f8fbff 0%, #eef4ff 50%, #eaf2ff 100%);
          padding: 70px 0 90px;
          position: relative;
          overflow: hidden;
        }

        .about-page-wrap::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 15% 20%, rgba(255,255,255,0.65), transparent 16%),
            radial-gradient(circle at 85% 75%, rgba(255,255,255,0.5), transparent 18%);
          pointer-events: none;
        }

        .about-shell {
          position: relative;
          z-index: 2;
        }

        .about-hero-card {
          border-radius: 34px;
          background: rgba(255,255,255,0.78);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid rgba(255,255,255,0.78);
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.10);
          -webkit-box-shadow: 0 24px 60px rgba(15, 23, 42, 0.10);
          padding: 44px;
          overflow: hidden;
          position: relative;
          -webkit-transition: all 0.35s ease;
          transition: all 0.35s ease;
        }

        .about-hero-card:hover {
          transform: translateY(-4px);
          -webkit-transform: translateY(-4px);
          box-shadow: 0 32px 70px rgba(15, 23, 42, 0.14);
          -webkit-box-shadow: 0 32px 70px rgba(15, 23, 42, 0.14);
        }

        .about-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 999px;
          background: rgba(37,99,235,0.10);
          border: 1px solid rgba(37,99,235,0.16);
          color: #1d4ed8;
          font-weight: 800;
          font-size: 0.82rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 18px;
        }

        .about-title {
          font-size: 3rem;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.04em;
          margin-bottom: 16px;
          line-height: 1.15;
          max-width: 920px;
        }

        .about-highlight {
          color: #1d4ed8;
        }

        .about-subtitle {
          color: #475569;
          font-size: 1.08rem;
          line-height: 1.95;
          max-width: 920px;
          margin-bottom: 0;
        }

        .about-cta-row {
          margin-top: 28px;
        }

        .about-primary-btn,
        .about-secondary-btn,
        .about-outline-btn {
          min-height: 54px;
          border-radius: 16px;
          padding: 12px 22px;
          font-weight: 700;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          -webkit-transition: all 0.3s ease;
        }

        .about-primary-btn {
          background: linear-gradient(135deg, #0b1736 0%, #142850 45%, #1d4ed8 100%);
          color: #ffffff;
          border: none;
          box-shadow: 0 18px 38px rgba(29,78,216,0.18);
          -webkit-box-shadow: 0 18px 38px rgba(29,78,216,0.18);
        }

        .about-primary-btn:hover {
          color: #ffffff;
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
        }

        .about-secondary-btn {
          background: #16a34a;
          color: #ffffff;
          border: none;
          box-shadow: 0 16px 34px rgba(22,163,74,0.16);
          -webkit-box-shadow: 0 16px 34px rgba(22,163,74,0.16);
        }

        .about-secondary-btn:hover {
          color: #ffffff;
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
        }

        .about-outline-btn {
          background: rgba(255,255,255,0.84);
          color: #0f172a;
          border: 1px solid #dbeafe;
        }

        .about-outline-btn:hover {
          color: #0f172a;
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
          background: #ffffff;
        }

        .about-stat-grid {
          margin-top: 34px;
        }

        .about-stat-card {
          height: 100%;
          border-radius: 24px;
          padding: 24px;
          background: rgba(255,255,255,0.84);
          border: 1px solid rgba(148,163,184,0.18);
          box-shadow: 0 16px 36px rgba(15,23,42,0.05);
          -webkit-box-shadow: 0 16px 36px rgba(15,23,42,0.05);
        }

        .about-stat-title {
          font-size: 0.86rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 800;
          color: #64748b;
          margin-bottom: 8px;
        }

        .about-stat-value {
          font-size: 1.7rem;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .about-stat-text {
          color: #475569;
          line-height: 1.8;
          margin-bottom: 0;
        }

        .about-section {
          margin-top: 34px;
        }

        .about-info-card {
          height: 100%;
          border-radius: 26px;
          background: rgba(255,255,255,0.82);
          border: 1px solid rgba(148,163,184,0.18);
          box-shadow: 0 14px 34px rgba(15,23,42,0.05);
          -webkit-box-shadow: 0 14px 34px rgba(15,23,42,0.05);
          padding: 28px;
          transition: all 0.3s ease;
          -webkit-transition: all 0.3s ease;
        }

        .about-info-card:hover {
          transform: translateY(-5px);
          -webkit-transform: translateY(-5px);
          box-shadow: 0 24px 44px rgba(15,23,42,0.10);
          -webkit-box-shadow: 0 24px 44px rgba(15,23,42,0.10);
        }

        .about-info-icon {
          width: 58px;
          height: 58px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          color: #1d4ed8;
          font-size: 1.4rem;
          font-weight: 800;
          margin-bottom: 18px;
          border: 1px solid #dbeafe;
        }

        .about-info-title {
          font-size: 1.16rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 12px;
        }

        .about-info-text {
          color: #475569;
          line-height: 1.9;
          margin-bottom: 0;
        }

        .about-wide-card {
          margin-top: 34px;
          border-radius: 30px;
          background: linear-gradient(135deg, #081226 0%, #102247 55%, #1d4ed8 100%);
          color: #ffffff;
          padding: 36px;
          box-shadow: 0 26px 60px rgba(15, 23, 42, 0.16);
          -webkit-box-shadow: 0 26px 60px rgba(15, 23, 42, 0.16);
        }

        .about-wide-title {
          font-size: 2rem;
          font-weight: 900;
          margin-bottom: 14px;
          letter-spacing: -0.03em;
        }

        .about-wide-text {
          color: rgba(255,255,255,0.84);
          line-height: 1.9;
          margin-bottom: 0;
        }

        .about-link-list {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 22px;
        }

        .about-link-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 18px;
          border-radius: 999px;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.16);
          color: #ffffff;
          text-decoration: none;
          font-weight: 700;
          transition: all 0.3s ease;
          -webkit-transition: all 0.3s ease;
        }

        .about-link-chip:hover {
          color: #ffffff;
          background: rgba(255,255,255,0.16);
          transform: translateY(-2px);
          -webkit-transform: translateY(-2px);
        }

        .about-final-card {
          margin-top: 34px;
          border-radius: 28px;
          background: rgba(255,255,255,0.84);
          border: 1px solid rgba(148,163,184,0.18);
          box-shadow: 0 18px 42px rgba(15,23,42,0.06);
          -webkit-box-shadow: 0 18px 42px rgba(15,23,42,0.06);
          padding: 32px;
        }

        .about-final-title {
          font-size: 1.5rem;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 12px;
        }

        .about-final-text {
          color: #475569;
          line-height: 1.9;
          margin-bottom: 0;
        }

        @media (max-width: 991px) {
          .about-title {
            font-size: 2.45rem;
          }
        }

        @media (max-width: 767px) {
          .about-page-wrap {
            padding: 46px 0 60px;
          }

          .about-hero-card,
          .about-wide-card,
          .about-final-card {
            padding: 24px;
            border-radius: 22px;
          }

          .about-title {
            font-size: 2rem;
          }

          .about-wide-title {
            font-size: 1.55rem;
          }

          .about-subtitle,
          .about-wide-text,
          .about-final-text,
          .about-info-text,
          .about-stat-text {
            line-height: 1.8;
          }

          .about-link-list {
            gap: 10px;
          }
        }
      `}</style>

      <div className="about-page-wrap">
        <div className="container about-shell">
          <div className="about-hero-card">
            <div className="about-badge">About InternovaTech</div>

            <h1 className="about-title">
              <span className="about-highlight">InternovaTech</span> is your
              modern platform for online internships, practical learning, skill
              development, and verified certificates.
            </h1>

            <p className="about-subtitle">
              InternovaTech helps students, freshers, and learners build real
              career-focused skills through structured internship programs,
              guided modules, assessments, progress tracking, and certificate
              verification support. Our platform is designed to make online
              internships more professional, accessible, and outcome-driven
              across domains like Web Development, Data Science, Artificial
              Intelligence, Finance, and other in-demand fields.
            </p>

            <div className="d-flex flex-wrap gap-3 about-cta-row">
              <Link to="/internships" className="about-primary-btn">
                Explore Internships
              </Link>

              <Link to="/verify" className="about-secondary-btn">
                Verify Certificate
              </Link>

              <Link to="/login" className="about-outline-btn">
                Login to Dashboard
              </Link>

              <Link to="/contact" className="about-outline-btn">
                Contact Us
              </Link>
            </div>

            <div className="row g-4 about-stat-grid">
              <div className="col-lg-4 col-md-6">
                <div className="about-stat-card">
                  <div className="about-stat-title">Programs</div>
                  <div className="about-stat-value">Career-Focused Learning</div>
                  <p className="about-stat-text">
                    Explore structured online internship programs designed to
                    improve practical knowledge, confidence, and job-ready
                    skills.
                  </p>
                </div>
              </div>

              <div className="col-lg-4 col-md-6">
                <div className="about-stat-card">
                  <div className="about-stat-title">Progress</div>
                  <div className="about-stat-value">Track Every Step</div>
                  <p className="about-stat-text">
                    Learners can continue their modules, monitor progress,
                    complete mini tests, and move smoothly toward certificate
                    eligibility.
                  </p>
                </div>
              </div>

              <div className="col-lg-4 col-md-12">
                <div className="about-stat-card">
                  <div className="about-stat-title">Trust</div>
                  <div className="about-stat-value">Verified Certificates</div>
                  <p className="about-stat-text">
                    Eligible learners can generate, download, and verify
                    InternovaTech certificates through a trusted digital
                    validation process.
                  </p>
                </div>
              </div>
            </div>

            <div className="row g-4 about-section">
              <div className="col-lg-4 col-md-6">
                <div className="about-info-card">
                  <div className="about-info-icon">01</div>
                  <h2 className="about-info-title">Structured Learning Experience</h2>
                  <p className="about-info-text">
                    InternovaTech provides organized program access with guided
                    learning modules, practical training flow, and learner-first
                    digital support so users can focus on real growth instead of
                    confusion.
                  </p>
                </div>
              </div>

              <div className="col-lg-4 col-md-6">
                <div className="about-info-card">
                  <div className="about-info-icon">02</div>
                  <h2 className="about-info-title">Assessments and Progress Tracking</h2>
                  <p className="about-info-text">
                    Our platform supports assessments, learning continuity,
                    progress-based unlocking, and dashboard-driven tracking so
                    learners can clearly understand their journey and complete
                    each stage with confidence.
                  </p>
                </div>
              </div>

              <div className="col-lg-4 col-md-12">
                <div className="about-info-card">
                  <div className="about-info-icon">03</div>
                  <h2 className="about-info-title">Certificate Verification Support</h2>
                  <p className="about-info-text">
                    InternovaTech also focuses on reliable certificate support by
                    offering completion-based certificate services, digital
                    verification, and a more trusted experience for learners and
                    recruiters.
                  </p>
                </div>
              </div>
            </div>

            <div className="row g-4 about-section">
              <div className="col-md-6">
                <div className="about-info-card">
                  <div className="about-info-icon">04</div>
                  <h2 className="about-info-title">Our Mission</h2>
                  <p className="about-info-text">
                    Our mission is to make online internships and digital
                    learning more accessible, professional, and skill-oriented
                    by combining structured training, learner support,
                    assessments, and verified achievement in one place.
                  </p>
                </div>
              </div>

              <div className="col-md-6">
                <div className="about-info-card">
                  <div className="about-info-icon">05</div>
                  <h2 className="about-info-title">What We Focus On</h2>
                  <p className="about-info-text">
                    InternovaTech focuses on practical skill development,
                    internship participation, assessment readiness, progress
                    visibility, certificate eligibility, and a clean learner
                    experience from start to completion.
                  </p>
                </div>
              </div>
            </div>

            <div className="about-wide-card">
              <h2 className="about-wide-title">
                Why learners choose InternovaTech
              </h2>
              <p className="about-wide-text">
                InternovaTech combines premium design, learner-friendly access,
                practical internships, transparent training flow, and verified
                certificate support in one place. This makes it easier for
                students and freshers to build discipline, improve skills, and
                present more credible learning outcomes.
              </p>

              <div className="about-link-list">
                <Link to="/internships" className="about-link-chip">
                  View Internship Programs
                </Link>
                <Link to="/verify" className="about-link-chip">
                  Certificate Verification
                </Link>
                <Link to="/privacy-policy" className="about-link-chip">
                  Privacy Policy
                </Link>
                <Link to="/terms-and-conditions" className="about-link-chip">
                  Terms & Conditions
                </Link>
                <Link to="/refund-policy" className="about-link-chip">
                  Refund Policy
                </Link>
              </div>
            </div>

            <div className="about-final-card">
              <h2 className="about-final-title">
                Start your learning journey with InternovaTech
              </h2>
              <p className="about-final-text">
                Whether you want to explore an internship, continue your
                learning dashboard, or verify a certificate, InternovaTech is
                built to give you a smooth, trusted, and growth-focused digital
                experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AboutUs;