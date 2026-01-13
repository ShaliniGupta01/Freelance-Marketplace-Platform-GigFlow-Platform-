import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  const submit = (e) => {
    e.preventDefault();
    dispatch(
      login({
        email: e.target.email.value,
        password: e.target.password.value,
      })
    );
  };

  //  Role-based redirect with debugging
  useEffect(() => {
    if (!user) {
      return;
    }

    if (user.role === "owner") {
      navigate("/create");
    } else if (user.role === "freelancer") {
      navigate("/");
    } else {
      console.log("Unknown role or no role, staying on login");
    }
  }, [user, navigate]);

  return (
    <div className="flex justify-center mt-10">
      <form onSubmit={submit} className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl font-bold mb-4">Login</h2>

        <input className="input" name="email" placeholder="Email" required />

        <input
          className="input"
          name="password"
          type="password"
          placeholder="Password"
          required
        />

        <button
          type="submit"
          className="btn-primary w-full mt-4"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
