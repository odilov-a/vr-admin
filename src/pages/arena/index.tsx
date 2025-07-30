import { useState } from "react";
import { Modal, notification, Card, Row, Col } from "antd";
import { Delete, Edit, CreateDoc } from "assets/images/icons";
import { useHooks, usePost } from "hooks";
import { Button } from "components";
import { Container } from "modules";
import Create from "./create";
import More from "./more";

const Arena = () => {
  const { Meta } = Card;
  const { get, queryClient, t } = useHooks();
  const [createModal, showCreateModal] = useState({ open: false, data: {} });
  const [moreModal, showMoreModal] = useState({ open: false, data: {} });
  const { mutate } = usePost();
  const onDeleteHandler = (id: string) => {
    Modal.confirm({
      title: t("Вы уверены что хотите удалить?"),
      okText: t("да"),
      okType: "danger",
      cancelText: t("нет"),
      onOk: () => deleteAction(id),
    });
  };
  const deleteAction = (id: string) => {
    if (id) {
      mutate(
        { method: "delete", url: `/arena/${id}`, data: null },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["arena"] });
            notification.success({
              message: t("Успешно удалена"),
              duration: 2,
            });
          },
          onError: (error) => {
            notification.error({
              message: get(error, "errorMessage", t("Произошло ошибка!")),
              duration: 2,
            });
          },
        }
      );
    }
  };
  return (
    <div className="flex">
      <Modal
        open={createModal.open}
        onCancel={() => showCreateModal({ open: false, data: {} })}
        footer={null}
        centered
        title={
          get(createModal, "data._id") ? t("Update arena") : t("Create arena")
        }
        width={600}
        destroyOnClose
      >
        <Create {...{ showCreateModal, createModal }} />
      </Modal>
      <Modal
        open={moreModal?.open}
        onOk={() => showMoreModal({ open: true, data: {} })}
        onCancel={() => showMoreModal({ open: false, data: {} })}
        footer={null}
        centered
        title={t("More informaiton")}
        width={600}
        destroyOnClose
      >
        <More {...{ showMoreModal, moreModal }} />
      </Modal>
      <div>
        <Container.All name="arena" url="/arena">
          {({ items }) => (
            <div>
              <div className="flex justify-between">
                <Button
                  size="large"
                  icon={<CreateDoc />}
                  title={t("Create arena")}
                  onClick={() => showCreateModal({ open: true, data: {} })}
                />
              </div>
              <Row className="h-[120px] mt-[15px]">
                {items.map((card) => (
                  <Col
                    className="cursor-pointer"
                    onClick={() => showMoreModal({ open: true, data: card })}
                  >
                    <div className="mr-8 mb-4 w-[250px] h-[150px]">
                      <Meta
                        className="pb-[40px] p-0"
                        title={
                          <div className="mb-1">
                            <p className="dark:text-[#e5e7eb] block truncate">
                              <strong>{get(card, "title", "")}</strong>
                            </p>
                          </div>
                        }
                      />
                      <div className="btnPanel2">
                        <div
                          className="editBtn"
                          onClick={(e) => {
                            e.stopPropagation();
                            showCreateModal({ open: true, data: card });
                          }}
                        >
                          <Edit />
                        </div>
                        <div
                          className="deleteBtn"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteHandler(get(card, "_id", ""));
                          }}
                        >
                          <Delete />
                        </div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </Container.All>
      </div>
    </div>
  );
};

export default Arena;
