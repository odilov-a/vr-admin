import useStore from "store";

const LogOut = () => {
  const { logOut } = useStore((state) => state);
  logOut();
  return (
    <div>LogOut</div>
  )
}

export default LogOut