import { useState } from "react";
import { Modal, notification, Card, Row, Col } from "antd";
import { Delete, Edit, CreateDoc } from "assets/images/icons";
import { useHooks, usePost } from "hooks";
import { Button } from "components";
import { Container } from "modules";
import Create from "./create";

const Difficulty = () => {
  const { Meta } = Card;
  const { get, queryClient, t } = useHooks();
  const [createModal, showCreateModal] = useState({ open: false, data: {} });
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
        { method: "delete", url: `/difficulties/${id}`, data: null },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["difficulties"] });
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
          get(createModal, "data._id")
            ? t("Update difficulty")
            : t("Create difficulty")
        }
        width={500}
        destroyOnClose
      >
        <Create {...{ showCreateModal, createModal }} />
      </Modal>
      <div>
        <Container.All name="difficulties" url="/difficulties">
          {({ items }) => (
            <div>
              <div className="flex justify-between">
                <Button
                  title={t("Create difficulty")}
                  icon={<CreateDoc />}
                  size="large"
                  className="bg-[#002855]"
                  onClick={() => showCreateModal({ open: true, data: {} })}
                />
              </div>
              <Row className="h-[120px] mt-[15px]">
                {items.map((card) => (
                  <Col className="cursor-pointer">
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

export default Difficulty;
