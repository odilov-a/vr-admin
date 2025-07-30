import { Modal, notification, Table } from "antd";
import { Button, DotBtn } from "components";
import { useHooks, usePost } from "hooks";
import Container from "modules/container";
import { CreateDoc } from "assets/images/icons";

const Problems = () => {
  const { t, get, queryClient, navigate } = useHooks();
  const { mutate } = usePost();

  const onDeleteHandler = (row: any) => {
    const id = get(row, "_id");
    Modal.confirm({
      title: t("O'chirishni tasdiqlaysizmi") + "?",
      cancelText: t("yo'q"),
      okType: "danger",
      okText: t("ha"),
      onOk: () => deleteAction(id),
    });
  };

  const deleteAction = (id: any) => {
    if (id) {
      mutate(
        { method: "delete", url: `/problems/${id}`, data: null },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: [`problems`],
            });
            notification["success"]({
              message: t("Успешно удален!"),
              duration: 2,
            });
          },
          onError: (error: any) => {
            notification["error"]({
              message: t(
                get(error, "response.data.error", "Произошло ошибка!")
              ),
              duration: get(error, "response.data.message") ? 4 : 2,
            });
          },
        }
      );
    }
  };

  return (
    <>
      <div className="content-panel">
        <div>
          <Container.All url="/problems" name="problems">
            {({ meta, items }) => {
              return (
                <div>
                  <div className="page-heading">
                    <div className="page-heading__right">
                      <Button
                        icon={<CreateDoc />}
                        title={t("Qo'shish")}
                        onClick={() => navigate("/problems/create")}
                      />
                    </div>
                  </div>
                  <Table
                    dataSource={items}
                    pagination={{ pageSize: 12 }}
                    columns={[
                      {
                        key: "title",
                        align: "center",
                        title: t("title"),
                        dataIndex: "title",
                        className: "w-[80px]",
                        render: (value) => (
                          <div className="flex items-center">{value}</div>
                        ),
                      },
                      // {
                      //   key: "forArena",
                      //   align: "center",
                      //   title: t("forArena"),
                      //   dataIndex: "forArena",
                      //   className: "w-[80px]",
                      //   render: (value) => (
                      //     <div className={value ? "text-green-500" : "text-red-500"}>
                      //       {value ? t("ha") : t("yo'q")}
                      //     </div>
                      //   ),
                      // },
                      {
                        key: "description",
                        align: "center",
                        title: t("description"),
                        dataIndex: "description",
                        className: "w-[180px]",
                        render: (value) => (
                          <span
                            className="dark:text-[#e5e7eb] line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: value }}
                          />
                        ),
                      },
                      {
                        title: t("Amallar"),
                        align: "center",
                        className: "w-[1px]",
                        render: (value, row) => (
                          <DotBtn
                            row={row}
                            editFunction={() =>
                              navigate(`/problems/update/${get(row, "_id")}`)
                            }
                            deleteFunction={() => onDeleteHandler(row)}
                          />
                        ),
                      },
                    ]}
                  />
                </div>
              );
            }}
          </Container.All>
        </div>
      </div>
    </>
  );
};

export default Problems;
