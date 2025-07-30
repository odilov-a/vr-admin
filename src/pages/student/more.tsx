import { useHooks } from "hooks";
import Avatar from "assets/images/27470334_7309681.jpg";

const More = ({ showMoreModal, moreModal }: any) => {
  const data = moreModal?.data;
  const { t } = useHooks();
  if (!data) {
    return <p>{t("Loading")}...</p>;
  }
  return (
    <div>
      <div className="flex">
        <div className="mr-[30px]">
          <div className="flex items-center mb-[10px]">
            <p className="mr-[20px]">{t("is Active")}:</p>
            <b style={{ color: data.isActive ? "green" : "red" }}>
              {data.isActive ? t("Active") : t("Not Active")}
            </b>
          </div>
          <div className="flex items-center mb-[10px]">
            <p className="mr-[20px]">{t("Full name")}:</p>
            <b>
              {data.firstName} {data.lastName}
            </b>
          </div>
          <div className="flex items-center mb-[10px]">
            <p className="mr-[20px]">{t("Last active")}:</p>
            <b>{new Date(data.lastLogin).toLocaleString()}</b>
          </div>
        </div>
        <div className="mr-[20px]">
          <div className="flex items-center mb-[10px]">
            <p className="mr-[20px]">{t("username")}:</p>
            <b>{data.username}</b>
          </div>
          <div className="flex items-center mb-[10px]">
            <p className="mr-[20px]">{t("email")}:</p>
            <p>
              <a
                href={`mailto:${data.email}`}
                className="text-blue-500 hover:underline"
              >
                {data.email}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default More;
