import { notification } from "antd";
import { Field } from "formik";

import { Button, Fields } from "components";
import { useHooks, useGet } from "hooks";
import { Container } from "modules";

const Edit = ({ onClose }: { onClose: () => void }) => {
  const { get, t } = useHooks();

  const { data } = useGet({
    name: "profileData",
    url: "/admins/me",
    onSuccess: () => {},
    onError: () => {},
  });

  const userData = get(data, "data");

  return (
    <Container.Form
      url="/admins/update/me"
      name="profileData"
      method="put"
      fields={[
        { type: "string", name: "username", value: get(userData, "username") },
        { type: "string", name: "password" },
      ]}
      onSuccess={() => {
        notification.success({
          message: t("Ma'lumotlar muvaffaqiyatli saqlandi!"),
          duration: 2,
        });
        onClose();
      }}
      onError={(error) => {
        notification.error({
          message: get(error, "errorMessage", t("Something went wrong!")),
          duration: 2,
        });
        onClose();
      }}
    >
      {({ submitForm }) => (
        <div>
          <div className="content-panel page-heading">
            <p className="page-heading__title">{t("Profilni tahrirlash")}</p>
          </div>

          <div className="content-panel">
            <div className="flex justify-between flex-col">
              <Field
                type="username"
                name="username"
                label={t("Login")}
                component={Fields.Input}
                placeholder={t("Login kiriting")}
                rootClassName="w-full"
              />
              <Field
                type="password"
                name="password"
                label={t("Parol")}
                component={Fields.Input}
                placeholder={t("Parol kiriting")}
                rootClassName="w-full"
              />
            </div>
            <Button
              type="primary"
              title="Saqlash"
              className="w-full mt-[20px]"
              onClick={() => {
                submitForm();
                onClose();
              }}
            />
          </div>
        </div>
      )}
    </Container.Form>
  );
};

export default Edit;
