import { Table } from "antd";
import { Container } from "modules";
import { useHooks } from "hooks";

const Passed = () => {
  const { t } = useHooks();
  const columns = [
    {
      title: t("Student Name"),
      dataIndex: ["student", "name"],
      key: "studentName",
    },
    {
      title: t("Test Name"),
      dataIndex: ["test", "name"],
      key: "testName",
    },
    {
      title: t("Total Questions"),
      dataIndex: ["stats", "totalQuestions"],
      key: "totalQuestions",
    },
    {
      title: t("Correct Answers"),
      dataIndex: ["stats", "correctAnswers"],
      key: "correctAnswers",
    },
    {
      title: t("Incorrect Answers"),
      dataIndex: ["stats", "incorrectAnswers"],
      key: "incorrectAnswers",
    },
    {
      title: t("Created At"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => new Date(text).toLocaleString(),
    },
  ];

  return (
    <div className="flex flex-col h-screen">
      <Container.All name="passed" url="/passed">
        {({ items }) => (
          <div className="flex-grow overflow-auto">
            <Table
              columns={columns}
              dataSource={items}
              pagination={{ pageSize: 10 }}
              rowKey="id"
              style={{ backgroundColor: "inherit", color: "inherit" }}
            />
          </div>
        )}
      </Container.All>
    </div>
  );
};

export default Passed;
