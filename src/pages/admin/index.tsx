import { useState } from "react";
import { Card, Modal } from "antd";
import { useHooks, useGet } from "hooks";
import { Edit } from "assets/images/icons";
import Update from "./update";

const User = () => {
  const { get, t } = useHooks();
  const { Meta } = Card;
  const [editModal, showEditModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const onEdit = (item: object) => {
    showEditModal(true);
    setSelectedCard(item);
  };
  const { data } = useGet({ name: "admins", url: "/admins/me" });
  const info = get(data, "data", {});
  return (
    <div className="flex">
      <Modal
        open={editModal}
        onOk={() => showEditModal(true)}
        onCancel={() => showEditModal(false)}
        footer={null}
        centered
        title={t("Edit user")}
        width={400}
        destroyOnClose
      >
        <Update {...{ showEditModal, selectedCard }} />
      </Modal>
      <div>
        <div>
          <Card hoverable style={{ width: 450, marginRight: 15 }}>
            <Meta
              className="pb-[60px]"
              title={
                <div className="">
                  <p>
                    {t("Username")} - {get(info, "username", "")}
                  </p>
                </div>
              }
            />
            <div className="btnPanel">
              <div className="editBtn" onClick={() => onEdit(info)}>
                <Edit />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default User;