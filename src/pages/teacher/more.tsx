import { useHooks } from "hooks";
import Avatar from "assets/images/27470334_7309681.jpg";

const More = ({ showMoreModal, moreModal }: any) => {
  const data = moreModal?.data;
  const { t } = useHooks();
  if (!data) {
    return <p>{t("Loading...")}</p>;
  }
  return (
    <div>
      <div className="flex">
        <div className="mr-[30px]">
          <div className="flex items-center mb-[10px]">
            <p className="mr-[20px]">
              <p>{t("Full name")}:</p>
            </p>
            <b>{data.firstName} {data.lastName}</b>
          </div>
          <div className="flex items-center mb-[10px]">
            <p className="mr-[20px]">
              <p>{t("subjects")}:</p>
            </p>
            <div>
              {data.subject && data.subject.length > 0 ? (
                <ul>
                  {data.subject.map((sub: any) => (
                    <b>
                      <li key={sub._id}>{sub.title}</li>
                    </b>
                  ))}
                </ul>
              ) : (
                <b>{t("No subjects available")}</b>
              )}
            </div>
          </div>
        </div>
        <div className="mr-[20px]">
          <div className="flex items-center mb-[10px]">
            <p className="mr-[20px]">
              <p>{t("username")}:</p>
            </p>
            <b>{data.username}</b>
          </div>
          <div className="flex items-center mb-[10px]">
            <p className="mr-[20px]">
              <p>{t("Telefon raqam")}:</p>
            </p>
            <p>
              <a
                href={`tel:${data.phoneNumber}`}
                className="text-blue-500 hover:underline"
              >
                {data.phoneNumber}
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="flex">
        <img
          src={data.photoUrl[0] || Avatar}
          className="w-[200px] h-[150px] object-cover rounded-[10px]"
        />
      </div>
    </div>
  );
};

export default More;
