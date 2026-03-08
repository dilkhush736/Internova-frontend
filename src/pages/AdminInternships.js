import React, { useEffect, useState } from "react";
import API from "../services/api";

const initialForm = {
  title: "",
  branch: "",
  category: "",
  description: "",
  thumbnail: "",
  durations: [
    { label: "1 Month", price: 1 },
    { label: "3 Months", price: 990 },
    { label: "6 Months", price: 1490 },
  ],
  modules: [
    { title: "", description: "" },
  ],
  quiz: [
    {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    },
  ],
};

function AdminInternships() {
  const [internships, setInternships] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchInternships = async () => {
    try {
      const { data } = await API.get("/internships");
      setInternships(data.internships || []);
    } catch (error) {
      console.error("Failed to fetch internships:", error);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const handleBasicChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDurationChange = (index, field, value) => {
    const updated = [...formData.durations];
    updated[index][field] = field === "price" ? Number(value) : value;
    setFormData((prev) => ({ ...prev, durations: updated }));
  };

  const handleModuleChange = (index, field, value) => {
    const updated = [...formData.modules];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, modules: updated }));
  };

  const handleQuizChange = (qIndex, field, value) => {
    const updated = [...formData.quiz];
    updated[qIndex][field] = field === "correctAnswer" ? Number(value) : value;
    setFormData((prev) => ({ ...prev, quiz: updated }));
  };

  const handleQuizOptionChange = (qIndex, oIndex, value) => {
    const updated = [...formData.quiz];
    updated[qIndex].options[oIndex] = value;
    setFormData((prev) => ({ ...prev, quiz: updated }));
  };

  const addModule = () => {
    setFormData((prev) => ({
      ...prev,
      modules: [...prev.modules, { title: "", description: "" }],
    }));
  };

  const addQuizQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      quiz: [
        ...prev.quiz,
        { question: "", options: ["", "", "", ""], correctAnswer: 0 },
      ],
    }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...formData,
        modules: formData.modules.filter((m) => m.title.trim()),
        quiz: formData.quiz.filter((q) => q.question.trim()),
      };

      if (editingId) {
        await API.put(`/internships/${editingId}`, payload);
        alert("Internship updated successfully");
      } else {
        await API.post("/internships", payload);
        alert("Internship created successfully");
      }

      resetForm();
      fetchInternships();
    } catch (error) {
      console.error("Save internship failed:", error);
      alert(error.response?.data?.message || "Failed to save internship");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const { data } = await API.get(`/internships/${id}`);
      const internship = data.internship;

      setFormData({
        title: internship.title || "",
        branch: internship.branch || "",
        category: internship.category || "",
        description: internship.description || "",
        thumbnail: internship.thumbnail || "",
        durations: internship.durations?.length
          ? internship.durations
          : initialForm.durations,
        modules: internship.modules?.length
          ? internship.modules
          : [{ title: "", description: "" }],
        quiz: internship.quiz?.length
          ? internship.quiz
          : [{ question: "", options: ["", "", "", ""], correctAnswer: 0 }],
      });

      setEditingId(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Failed to load internship for edit:", error);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this internship?");
    if (!ok) return;

    try {
      await API.delete(`/internships/${id}`);
      alert("Internship deleted successfully");
      fetchInternships();
    } catch (error) {
      console.error("Delete internship failed:", error);
      alert(error.response?.data?.message || "Failed to delete internship");
    }
  };

  return (
    <div className="container py-5">
      <div className="card border-0 shadow rounded-4 overflow-hidden mb-4">
        <div className="bg-dark text-white p-4">
          <h2 className="mb-1">Admin Internship Manager</h2>
          <p className="mb-0 text-light">
            Create, edit, and manage internship programs from one place.
          </p>
        </div>

        <div className="p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">Title</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={formData.title}
                  onChange={handleBasicChange}
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label fw-bold">Branch</label>
                <input
                  type="text"
                  className="form-control"
                  name="branch"
                  value={formData.branch}
                  onChange={handleBasicChange}
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label fw-bold">Category</label>
                <input
                  type="text"
                  className="form-control"
                  name="category"
                  value={formData.category}
                  onChange={handleBasicChange}
                  required
                />
              </div>

              <div className="col-md-12">
                <label className="form-label fw-bold">Thumbnail URL</label>
                <input
                  type="text"
                  className="form-control"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleBasicChange}
                />
              </div>

              <div className="col-md-12">
                <label className="form-label fw-bold">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  name="description"
                  value={formData.description}
                  onChange={handleBasicChange}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <h5>Durations</h5>
              <div className="row g-3">
                {formData.durations.map((duration, index) => (
                  <React.Fragment key={index}>
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        value={duration.label}
                        onChange={(e) =>
                          handleDurationChange(index, "label", e.target.value)
                        }
                        placeholder="Duration Label"
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="number"
                        className="form-control"
                        value={duration.price}
                        onChange={(e) =>
                          handleDurationChange(index, "price", e.target.value)
                        }
                        placeholder="Price"
                      />
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Modules</h5>
                <button
                  type="button"
                  className="btn btn-outline-dark btn-sm"
                  onClick={addModule}
                >
                  Add Module
                </button>
              </div>

              {formData.modules.map((module, index) => (
                <div className="row g-3 mb-3" key={index}>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder={`Module ${index + 1} Title`}
                      value={module.title}
                      onChange={(e) =>
                        handleModuleChange(index, "title", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder={`Module ${index + 1} Description`}
                      value={module.description}
                      onChange={(e) =>
                        handleModuleChange(index, "description", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Quiz Questions</h5>
                <button
                  type="button"
                  className="btn btn-outline-dark btn-sm"
                  onClick={addQuizQuestion}
                >
                  Add Question
                </button>
              </div>

              {formData.quiz.map((q, qIndex) => (
                <div className="border rounded-4 p-3 mb-3" key={qIndex}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Question {qIndex + 1}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={q.question}
                      onChange={(e) =>
                        handleQuizChange(qIndex, "question", e.target.value)
                      }
                    />
                  </div>

                  <div className="row g-3">
                    {q.options.map((option, oIndex) => (
                      <div className="col-md-6" key={oIndex}>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={`Option ${oIndex + 1}`}
                          value={option}
                          onChange={(e) =>
                            handleQuizOptionChange(qIndex, oIndex, e.target.value)
                          }
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-3">
                    <label className="form-label fw-bold">Correct Answer Index</label>
                    <select
                      className="form-select"
                      value={q.correctAnswer}
                      onChange={(e) =>
                        handleQuizChange(qIndex, "correctAnswer", e.target.value)
                      }
                    >
                      <option value={0}>Option 1</option>
                      <option value={1}>Option 2</option>
                      <option value={2}>Option 3</option>
                      <option value={3}>Option 4</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <div className="d-flex gap-2 flex-wrap">
              <button className="btn btn-dark" type="submit" disabled={loading}>
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Internship"
                  : "Create Internship"}
              </button>

              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={resetForm}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card border-0 shadow rounded-4 overflow-hidden">
        <div className="bg-light p-4 border-bottom">
          <h3 className="mb-0">Existing Internships</h3>
        </div>

        <div className="p-4">
          <div className="row g-4">
            {internships.map((item) => (
              <div className="col-md-6" key={item._id}>
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body p-4">
                    <h4 className="mb-2">{item.title}</h4>
                    <p className="mb-1">
                      <strong>Branch:</strong> {item.branch}
                    </p>
                    <p className="mb-1">
                      <strong>Category:</strong> {item.category}
                    </p>
                    <p className="text-muted mb-3">
                      {item.description?.slice(0, 120)}...
                    </p>

                    <div className="d-flex gap-2 flex-wrap">
                      <button
                        className="btn btn-outline-dark"
                        onClick={() => handleEdit(item._id)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {internships.length === 0 && (
            <div className="alert alert-info mb-0">
              No internships available yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminInternships;