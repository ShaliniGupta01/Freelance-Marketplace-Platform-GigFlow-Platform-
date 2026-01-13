/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGigs } from "../features/gigs/gigSlice";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { gigs } = useSelector((state) => state.gigs);

  useEffect(() => {
    dispatch(getGigs());
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Available Gigs</h2>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {gigs.map((gig) => (
          <Link key={gig._id} to={`/gigs/${gig._id}`}>
            <div className="card p-5">
              <h3 className="font-semibold text-lg mb-2">{gig.title}</h3>
              <p className="text-gray-500 line-clamp-2">{gig.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="font-bold text-indigo-600">₹{gig.budget}</span>
                <span className="text-sm bg-green-100 text-green-600 px-3 py-1 rounded-full">
                  Open
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
