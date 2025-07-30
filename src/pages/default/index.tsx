import { Exclamation, Problem } from "assets/images/icons";
import { useHooks, useGet } from "hooks";

const DefaultPage = () => {
  const { get, t } = useHooks();
  const { data } = useGet({ name: "admins", url: "/admins/me" });
  const info = get(data, "data", {});
  return (
    <div>
      <div className="top-part dark:bg-[##222638] bg-[#F3F4F7] p-[30px] rounded-[24px] h-[65vh]">
        <p className="text-[24px] font-[500] mb-[20px]">
          {t("Welcome")}, {get(info, "username")}
        </p>
        <div className="rounded-[12px] bg-[#E6ECFE] dark:bg-[#525459] text-[#222638] dark:text-[#9EA3B5] p-[22px] w-[560px]">
          <div className="flex mb-[20px]">
            <Exclamation />
            <p className="text-[18px] font-[500] ml-[20px] mt-[-5px] w-[250px]">
              {t("About login and password in the admin panel")}
            </p>
          </div>
          <p className="text-[16px] font-[500] mb-[20px]">
            {t(
              "Never tell anyone your login and password for your admin panel!"
            )}
          </p>
          <div className="flex mb-[10px]">
            <Problem />
            <p className="text-[18px] font-[500] ml-[20px] mt-[-1px]">
              {t("Problem")}
            </p>
          </div>
          <p className="text-[16px] font-[500]">
            {t(
              "If you are having problems with your system, contact to Admin!"
            )}
          </p>
        </div>
      </div>
      <div className="bottom-part mt-[32px] flex justify-between items-center">
        <div className="left-part w-[500px] text-[18px] dark:text-[#9EA3B5]">
          <div className="flex justify-between">
            <p className="mb-[10px]">{t("Admin's telegram:")} </p>
            <a
              className="text-[#222638]"
              href="https://t.me/uzcontest_support"
              target="_blank"
            >
              {t("Support @uzcontest_support")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultPage;
