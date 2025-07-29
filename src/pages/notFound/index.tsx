import Button from "components/button";
import { useHooks } from "hooks";
import useStore from "store";

const NotFound = () => {
  const { navigate } = useHooks();

  return (
    <div>
      <div className="flex align-center items-center flex-col justify-between">
        <p className="text-[32px] font-bold text-center mt-[100px]">
          Oops! Page not found!
        </p>
        <Button
          title="Back Home"
          size="large"
          onClick={() => navigate("/")}
          className="px-[28px] py-[22px] mt-[40px]"
        />
      </div>
    </div>
  );
};

export default NotFound;
