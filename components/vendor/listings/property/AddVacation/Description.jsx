import { useState, useEffect } from "react";

const Description = ({ data, categories = [], subcategories = [], onUpdate }) => {
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  // Filter subcategories based on selected category
  useEffect(() => {
    if (data?.category_id) {
      const filtered = subcategories.filter(
        (sub) => sub.listing_category_id === data.category_id
      );
      setFilteredSubcategories(filtered);
    } else {
      setFilteredSubcategories([]);
    }
  }, [data?.category_id, subcategories]);

  const handleChange = (field, value) => {
    if (onUpdate) {
      onUpdate(field, value);
    }
  };

  const handleStarRatingChange = (rating) => {
    handleChange("star_rating", rating);
  };

  return (
    <div className="row y-gap-10 x-gap-10">
      <h1 className="text-20 lh-14 fw-600">Property Description</h1>
      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Listing Title</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Enter listing title"
          value={data?.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          required
        />
      </div>

      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Category</h1>
        <select
          className="form-select rounded-8 border-light px-15 py-10 justify-between text-14 w-full mt-10"
          value={data?.category_id || ""}
          onChange={(e) => {
            const categoryId = e.target.value ? parseInt(e.target.value, 10) : null;
            handleChange("category_id", categoryId);
            // Clear subcategory when category changes
            if (onUpdate) {
              onUpdate("subcategory_id", null);
            }
          }}
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Subcategory</h1>
        <select
          className="form-select rounded-8 border-light px-15 py-10 justify-between text-14 w-full mt-10"
          value={data?.subcategory_id || ""}
          onChange={(e) => {
            const subcategoryId = e.target.value ? parseInt(e.target.value, 10) : null;
            handleChange("subcategory_id", subcategoryId);
          }}
          disabled={!data?.category_id}
        >
          <option value="">Select subcategory</option>
          {filteredSubcategories.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>
      </div>

      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Star Rating</h1>
        <div className="d-flex items-center gap-1 mt-10">
          {Array(5)
            .fill(null)
            .map((_, index) => {
              const rating = index + 1;
              const isSelected = data?.star_rating && rating <= data.star_rating;
              return (
                <span
                  key={index}
                  className="text-20 text-yellow-1 lh-14 cursor-pointer"
                  onClick={() => handleStarRatingChange(rating)}
                >
                  {isSelected ? "★" : "☆"}
                </span>
              );
            })}
        </div>
      </div>

      <div className="col-sm-12 mt-5">
        <h1 className="text-14 lh-12 fw-500">Listing Description</h1>
        <textarea
          rows={5}
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Describe your property"
          value={data?.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          required
        />
      </div>
    </div>
  );
};

export default Description;
