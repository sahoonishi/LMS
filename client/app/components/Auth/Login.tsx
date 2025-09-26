type LoginProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRoute: React.Dispatch<React.SetStateAction<string>>;
};

const Login: React.FC<LoginProps> = ({ setOpen, setRoute }) => {
  return (
    <div>
      <h2>Login</h2>
      <button onClick={() => setOpen(false)}>Close</button>
      <button onClick={() => setRoute("Register")}>Go to Register</button>
    </div>
  );
};

export default Login;
