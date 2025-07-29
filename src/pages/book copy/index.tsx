import { Modal, notification, Table } from "antd";
import { Button, DotBtn } from "components";
import { useHooks, usePost } from "hooks";
import Container from "modules/container";

const Organ = () => {
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
        { method: "delete", url: `/organs/${id}`, data: null },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: [`organs`],
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
          <Container.All url="/organs" name="organs">
            {({ meta, items }) => {
              return (
                <div>
                  <div className="page-heading">
                    <div className="page-heading__right">
                      <Button
                        title={t("Qo'shish")}
                        onClick={() => navigate("/organs/create")}
                      />
                    </div>
                  </div>
                  <Table
                    dataSource={items}
                    pagination={{ pageSize: 12 }}
                    columns={[
                      {
                        key: "name",
                        align: "center",
                        title: t("Name"),
                        dataIndex: "name",
                        className: "w-[80px]",
                        render: (value) => <div>{value}</div>,
                      },
                      {
                        key: "type",
                        align: "center",
                        title: t("Type"),
                        dataIndex: "type",
                        className: "w-[80px]",
                        render: (value) => {
                          const type = parseInt(value);
                          return type === 1 ? (
                            <span>Erkak</span>
                          ) : type === 2 ? (
                            <span>Ayol</span>
                          ) : (
                            <span>Boshqa</span>
                          );
                        },
                      },
                      {
                        key: "description",
                        align: "center",
                        title: t("Description"),
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
                        title: t("Actions"),
                        align: "center",
                        className: "w-[1px]",
                        render: (value, row) => (
                          <DotBtn
                            row={row}
                            editFunction={() =>
                              navigate(`/organs/update/${get(row, "_id")}`)
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

export default Organ;
