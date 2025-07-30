import { useHooks } from "hooks";

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
            <p className="mr-[20px]">{t("Username")}:</p>
            <b>{data.student.username}</b>
          </div>
          <div className="flex items-center mb-[10px]">
            <p className="mr-[20px]">{t("Telefon raqam")}:</p>
            <p>
              <a
                href={`tel:${data.student.phoneNumber}`}
                className="text-blue-500 hover:underline"
              >
                {data.student.phoneNumber}
              </a>
            </p>
          </div>
          <div className="flex items-center mb-[10px]">
            <p className="mr-[20px]">{t("createdAt")}:</p>
            <b>{new Date(data.createdAt).toLocaleString()}</b>
          </div>
        </div>
        <div className="mr-[20px]">
          <div className="flex items-center mb-[10px]">
            <p className="mr-[20px]">{t("Product")}:</p>
            <b>{data.product.name}</b>
          </div>
          <div className="flex items-center mb-[10px]">
            <p className="mr-[20px]">{t("Total")}:</p>
            <b>{data.total} Point</b>
          </div>
        </div>
      </div>
      <div className="flex">
        <img
          src={data.product.photoUrl[0]}
          className="w-[200px] h-[150px] object-cover rounded-[10px]"
        />
      </div>
    </div>
  );
};

export default More;
