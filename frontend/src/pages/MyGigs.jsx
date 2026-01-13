import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyGigs } from "../features/gigs/gigSlice";

const MyGigs = () => {
  const dispatch = useDispatch();

  const { myGigs, loading, error } = useSelector((state) => state.gigs);

  useEffect(() => {
    dispatch(getMyGigs());
  }, [dispatch]);

  if (loading) return <p>Loading my gigs...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Gigs</h2>

      {myGigs.length === 0 ? (
        <p>No gigs created yet</p>
      ) : (
        myGigs.map((gig) => (
          <div
            key={gig._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3>{gig.title}</h3>
            <p>{gig.description}</p>
            <p><b>Budget:</b> ₹{gig.budget}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default MyGigs;


