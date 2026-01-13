
import { useDispatch, useSelector } from "react-redux";
import { register } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [success, setSuccess] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(
        register({
          name: e.target.name.value,
          email: e.target.email.value,
          password: e.target.password.value,
          
        })
      );

      if (register.fulfilled.match(resultAction)) {
        setSuccess(true); // registration successful
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Navigate to login page after successful registration
  useEffect(() => {
    if (success) {
      navigate("/login");
    }
  }, [success, navigate]);

  return (
    <div className="flex justify-center mt-10">
      <form onSubmit={submit} className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl font-bold mb-4">Register</h2>
        <input className="input" name="name" placeholder="Name" />
        <input className="input" name="email" placeholder="Email" />
        <input className="input" name="password" type="password" placeholder="Password" />
        <button
          type="submit"
          className="btn-primary w-full mt-4"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
      

    </div>
  );
};

export default Register;
