import { useState } from "react";
import { Modal, Table, Button as AntButton, notification } from "antd";
import { Delete } from "assets/images/icons";
import { useHooks } from "hooks";
import { Container } from "modules";
import More from "./more";

const Order = () => {
  const { t, queryClient } = useHooks();
  const [moreModal, showMoreModal] = useState({ open: false, data: {} });

  const handleDelete = (record: any) => {
    const orderId = record._id;
    Modal.confirm({
      title: "Buyurtmani bekor qilmoqchimisiz?",
      cancelText: "Yo'q",
      okType: "danger",
      okText: "Ha",
      onOk: async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_ROOT_API}/orders/${orderId}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const result = await response.json();
          if (!response.ok) {
            throw new Error(result.message || "Xatolik yuz berdi");
          }
          notification.success({
            message: "Buyurtma bekor qilindi!",
            duration: 2,
          });
          queryClient.invalidateQueries(["orders"]);
        } catch (error) {
          notification.error({
            message:
              (error as Error).message || "Buyurtmani bekor qilishda xatolik!",
            duration: 3,
          });
        }
      },
    });
  };

  const columns = [
    {
      title: t("Orders"),
      dataIndex: ["product", "name"],
      key: "orders",
      ellipsis: true,
    },
    {
      title: t("Total"),
      dataIndex: "total",
      key: "total",
      ellipsis: true,
      render: (total: number) => <span>{total} Point</span>,
    },
    {
      title: t("Created at"),
      dataIndex: "createdAt",
      key: "createdAt",
      ellipsis: true,
      render: (date: string) => <span>{new Date(date).toLocaleString()}</span>,
    },
    {
      title: t("Actions"),
      key: "actions",
      ellipsis: true,
      render: (text: any, record: any) => (
        <span>
          <AntButton
            icon={<Delete />}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(record);
            }}
            style={{
              marginLeft: 8,
              borderColor: "red",
              background: "red",
              padding: "10px 10px",
              color: "white",
            }}
          />
        </span>
      ),
    },
  ];

  return (
    <div className="flex">
      <Modal
        open={moreModal.open}
        onCancel={() => showMoreModal({ open: false, data: {} })}
        footer={null}
        centered
        title={t("More information")}
        width={600}
        destroyOnClose
      >
        <More {...{ showMoreModal, moreModal }} />
      </Modal>
      <div>
        <Container.All name="orders" url="/orders">
          {({ items, meta }) => (
            <div>
              <Table
                onRow={(record) => ({
                  onClick: () => showMoreModal({ open: true, data: record }),
                })}
                columns={columns}
                dataSource={items}
                pagination={{ pageSize: 12 }}
                rowKey="_id"
                className="mt-[15px] bg-white dark:bg-[#454d70] rounded-[10px] cursor-pointer"
              />
            </div>
          )}
        </Container.All>
      </div>
    </div>
  );
};

export default Order;
