import { useHooks } from "hooks";

const More = ({ showMoreModal, moreModal }: any) => {
  const data = moreModal?.data;
  const { t, get } = useHooks();
  if (!data) {
    return <p>{t("Loading...")}</p>;
  }
  return (
    <div className="flex-1">
      <p>{get(data, "feedback")}</p>
    </div>
  );
};

export default More;
