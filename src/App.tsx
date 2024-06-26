import { useEffect } from "react";
import userService, { Users } from "./services/user-service";
import useUsers from "./hooks/useUsers";

function App() {
  const { users, error, isLoading, setUsers, setError } = useUsers();

  useEffect(() => {
    document.title = "Cancel Fetching Data";
  });

  const deleteUser = (user: Users) => {
    const originalUsers = [...users];
    setUsers(users.filter((u) => u.id !== user.id));

    userService.delete(user.id).catch((err) => {
      setError(err.message);
      setUsers(originalUsers);
    });
  };

  const createUser = () => {
    const originalUsers = [...users];
    const newUser = { id: 0, name: "Bhoying" };
    setUsers([newUser, ...users]);

    userService
      .create(newUser)
      .then(({ data: savedUser }) => setUsers([savedUser, ...users]))
      .catch((err) => {
        setError(err.message);
        setUsers(originalUsers);
      });
  };

  const updateUser = (user: Users) => {
    const originalUsers = [...users];

    const updatedUser = { ...user, name: user.name + "!" };
    setUsers(users.map((u) => (u.id === user.id ? updatedUser : u)));

    userService.update(updatedUser).catch((err) => {
      setError(err.message);
      setUsers(originalUsers);
    });
  };

  return (
    <div>
      {error && <h3 className="text-danger">{error}!</h3>}
      {isLoading && <div className="text-secondary spinner-border"></div>}
      <div onClick={createUser} className="mb-3 btn btn-primary">
        Add User
      </div>
      <ul className="list-group">
        {users.map((user) => (
          <div className="" key={user.id}>
            <div>
              <li className="list-group-item d-flex justify-content-between  align-items-center">
                <div>
                  <p>{user.name}</p>
                </div>
                <div>
                  <button
                    className="mx-2 btn btn-outline-secondary"
                    onClick={() => updateUser(user)}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => deleteUser(user)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default App;

// useEffect(() => {
//   setLoading(true);
//   const controller = new AbortController();
//   const fetchData = async () => {
//     try {
//       const res = await apiClient.get<Users[]>("/users/", {
//         signal: controller.signal
//       });
//       setUsers(res.data);
//       setLoading(false);
//     } catch (err) {
//       if (err instanceof CanceledError) return;
//       setError((err as AxiosError).message);
//       setLoading(false);
//     }
//   };

//   fetchData();
//   return () => controller.abort();
// }, []);
