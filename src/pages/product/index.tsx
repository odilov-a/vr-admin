import { useState } from "react";
import { Col, Row, Modal, notification, Input } from "antd";
import { Container } from "modules";
import { Button } from "components";
import Create from "./create";
import More from "./more";
import { useHooks, usePost } from "hooks";
import { Delete, Edit, CreateDoc } from "assets/images/icons";

const Product = () => {
  const { get, queryClient, t } = useHooks();
  const [createModal, showCreateModal] = useState({ open: false, data: {} });
  const [moreModal, showMoreModal] = useState({ open: false, data: {} });

  const { mutate } = usePost();
  const onDeleteHandler = (id: string) => {
    Modal.confirm({
      title: t("Вы действительно хотите удалить ?"),
      okText: t("да"),
      okType: "danger",
      cancelText: t("нет"),
      onOk: () => deleteAction(id),
    });
  };

  const deleteAction = (id: string) => {
    if (id) {
      mutate(
        { method: "delete", url: `/products/${id}`, data: null },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: [`products`],
            });
            notification["success"]({
              message: t("Успешно удалена"),
              duration: 2,
            });
          },
          onError: (error: any) => {
            notification["error"]({
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
            ? t("Update product")
            : t("Create product")
        }
        width={700}
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
        width={400}
        destroyOnClose
      >
        <More {...{ showMoreModal, moreModal }} />
      </Modal>
      <div>
        <Container.All name="products" url="/products">
          {({ items }) => {
            return (
              <div>
                <div className="flex justify-between">
                  <Button
                    size="large"
                    icon={<CreateDoc />}
                    title={t("Create product")}
                    onClick={() => showCreateModal({ open: true, data: {} })}
                  />
                </div>
                <Row className="h-[120px] mt-[15px]">
                  {items.map((card) => {
                    return (
                      <>
                        <Col
                          className="flex items-baseline justify-center cursor-pointer"
                          onClick={() =>
                            showMoreModal({ open: true, data: card })
                          }
                        >
                          <div className="mr-8 mb-4">
                            <img
                              className="object-cover rounded-[10px] w-[260px] h-[200px]"
                              src={get(card, "photoUrl.0")}
                            />
                            <div className="btnPanel2">
                              <div
                                className="editBtn"
                                onClick={(e) => (
                                  e.stopPropagation(),
                                  showCreateModal({ open: true, data: card })
                                )}
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
                      </>
                    );
                  })}
                </Row>
              </div>
            );
          }}
        </Container.All>
      </div>
    </div>
  );
};

export default Product;
