import React, { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { Link, useSearchParams } from "react-router-dom";

function Internships() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const [localSearch, setLocalSearch] = useState(initialSearch);

  const [branchFilter, setBranchFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  const fetchInternships = async () => {
    try {
      const { data } = await API.get("/internships");
      setInternships(data.internships || []);
    } catch (error) {
      console.error("Failed to fetch internships:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  useEffect(() => {
    if (localSearch.trim()) {
      setSearchParams({ search: localSearch.trim() });
    } else {
      setSearchParams({});
    }
  }, [localSearch, setSearchParams]);

  const uniqueBranches = useMemo(() => {
    const branches = internships.map((item) => item.branch).filter(Boolean);
    return ["All", ...new Set(branches)];
  }, [internships]);

  const uniqueCategories = useMemo(() => {
    const categories = internships.map((item) => item.category).filter(Boolean);
    return ["All", ...new Set(categories)];
  }, [internships]);

  const filteredInternships = useMemo(() => {
    const query = localSearch.trim().toLowerCase();

    let filtered = internships.filter((item) => {
      const title = item.title?.toLowerCase() || "";
      const branch = item.branch?.toLowerCase() || "";
      const category = item.category?.toLowerCase() || "";
      const description = item.description?.toLowerCase() || "";

      const matchesSearch =
        !query ||
        title.includes(query) ||
        branch.includes(query) ||
        category.includes(query) ||
        description.includes(query);

      const matchesBranch =
        branchFilter === "All" || item.branch === branchFilter;

      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;

      return matchesSearch && matchesBranch && matchesCategory;
    });

    if (sortBy === "title-asc") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "price-low") {
      filtered.sort((a, b) => {
        const aMin = Math.min(...(a.durations?.map((d) => d.price) || [0]));
        const bMin = Math.min(...(b.durations?.map((d) => d.price) || [0]));
        return aMin - bMin;
      });
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => {
        const aMax = Math.max(...(a.durations?.map((d) => d.price) || [0]));
        const bMax = Math.max(...(b.durations?.map((d) => d.price) || [0]));
        return bMax - aMax;
      });
    }

    return filtered;
  }, [internships, localSearch, branchFilter, categoryFilter, sortBy]);

  const clearAllFilters = () => {
    setLocalSearch("");
    setBranchFilter("All");
    setCategoryFilter("All");
    setSortBy("default");
    setSearchParams({});
  };

  if (loading) {
    return <div className="container py-5">Loading internships...</div>;
  }

  return (
    <div className="container py-5">
      <div className="card border-0 shadow rounded-4 overflow-hidden">
        <div className="bg-dark text-white p-4">
          <h2 className="mb-1">Explore Internship Programs</h2>
          <p className="mb-0 text-light">
            Discover industry-focused internships across multiple domains and durations.
          </p>
        </div>

        <div className="p-4">
          {(localSearch || branchFilter !== "All" || categoryFilter !== "All" || sortBy !== "default") && (
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
              <div>
                <h5 className="mb-1">Filtered Results</h5>
                <p className="text-muted mb-0">
                  {localSearch ? (
                    <>
                      Search: <strong>{localSearch}</strong>
                    </>
                  ) : (
                    "Using selected filters"
                  )}
                </p>
              </div>

              <button className="btn btn-outline-dark" onClick={clearAllFilters}>
                Clear All
              </button>
            </div>
          )}

          <div className="row g-3 mb-4">
            <div className="col-md-12">
              <label className="form-label fw-bold">Search Internships</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by title, branch, category, or description..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-bold">Filter by Branch</label>
              <select
                className="form-select"
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
              >
                {uniqueBranches.map((branch, index) => (
                  <option key={index} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label fw-bold">Filter by Category</label>
              <select
                className="form-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {uniqueCategories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label fw-bold">Sort By</label>
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Default</option>
                <option value="title-asc">Title A-Z</option>
                <option value="price-low">Lowest Price</option>
                <option value="price-high">Highest Price</option>
              </select>
            </div>
          </div>

          <div className="row g-4">
            {filteredInternships.map((item) => (
              <div className="col-md-4" key={item._id}>
                <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                  <img
                    src={item.thumbnail || "https://via.placeholder.com/400x250"}
                    className="card-img-top"
                    alt={item.title}
                    style={{ height: "220px", objectFit: "cover" }}
                  />

                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title mb-0">{item.title}</h5>
                      <span className="badge bg-secondary">{item.branch}</span>
                    </div>

                    <p className="mb-2">
                      <strong>Category:</strong> {item.category}
                    </p>

                    <p className="text-muted mb-3">
                      {item.description?.length > 110
                        ? `${item.description.slice(0, 110)}...`
                        : item.description}
                    </p>

                    <div className="d-flex flex-wrap gap-2">
                      {item.durations?.map((duration, index) => (
                        <span key={index} className="badge bg-light text-dark border">
                          {duration.label} • INR {duration.price}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="card-footer bg-white border-0 px-4 pb-4 pt-0">
                    <Link
                      to={`/internships/${item._id}`}
                      className="btn btn-dark w-100"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredInternships.length === 0 && (
            <div className="alert alert-info mt-4 mb-0">
              No internships found with the selected search or filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Internships;