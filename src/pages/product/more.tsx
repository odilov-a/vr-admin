import { useHooks } from "hooks";

const More = ({ showMoreModal, moreModal }: any) => {
  const data = moreModal?.data;
  const { t } = useHooks();
  if (!data) {
    return <p>{t("Loading...")}</p>;
  }
  return (
    <div className="flex flex-col items-center">
      <div className="flex">
        <div className="mr-[30px]">
          <div className="flex items-center mb-[10px]">
            <p className="mr-[20px]">{t("Name")}:</p>
            <b>{data.name}</b>
          </div>
          <div className="flex items-center mb-[10px]">
            <p className="mr-[20px]">{t("Price")}:</p>
            <b>{data.price.toLocaleString()}</b>&nbsp;{t("Point")}
          </div>
        </div>
      </div>
      <div className="flex">
        <img
          src={data.photoUrl[0]}
          className="w-[200px] h-[150px] object-cover rounded-[10px]"
        />
      </div>
    </div>
  );
};

export default More;
