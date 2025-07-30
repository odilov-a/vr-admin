import { useHooks } from "hooks";

const More = ({ showMoreModal, moreModal }: any) => {
  const data = moreModal?.data;
  const { t } = useHooks();

  if (!data) {
    return <p>{t("Loading...")}</p>;
  }

  return (
    <div>
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">{t("Groups")}</th>
            <th className="border border-gray-300 px-4 py-2">{t("Problems")}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-4 py-2 align-top">
              {data.groups?.length ? (
                <ul>
                  {data.groups.map((group: any, index: number) => (
                    <li key={group._id}>{index + 1}. {group.name}</li>
                  ))}
                </ul>
              ) : (
                <p>{t("No groups available")}</p>
              )}
            </td>
            <td className="border border-gray-300 px-4 py-2 align-top">
              {data.problems?.length ? (
                <ul>
                  {data.problems.map((problem: any, index: number) => (
                    <li key={problem._id}>{index + 1}. {problem.title}</li>
                  ))}
                </ul>
              ) : (
                <p>{t("No problems available")}</p>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default More;
