import { useDispatch, useSelector } from "react-redux";
import { createGig } from "../features/gigs/gigSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const CreateGig = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.gigs);

  const [created, setCreated] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    const resultAction = await dispatch(
      createGig({
        title: e.target.title.value,
        description: e.target.description.value,
        budget: e.target.budget.value,
      })
    );

    if (createGig.fulfilled.match(resultAction)) {
      setCreated(true); // mark gig as created
    }
  };

  // Redirect to Dashboard only after gig is successfully created
  useEffect(() => {
    if (created) {
      navigate("/"); // go to dashboard
    }
  }, [created, navigate]);

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <form
        onSubmit={submit}
        className="bg-white p-8 rounded-xl shadow-lg w-[400px]"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
          Create New Gig
        </h2>

        <input className="input mb-4" name="title" placeholder="Gig Title" />
        <textarea
          className="input mb-4"
          rows="3"
          name="description"
          placeholder="Describe your project"
        />
        <input className="input mb-4" name="budget" placeholder="Budget (₹)" />

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Creating..." : "Create Gig"}
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default CreateGig;
