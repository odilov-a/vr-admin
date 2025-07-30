import { Spin, notification } from "antd";
import { Field } from "formik";
import { useHooks } from "hooks";
import { Container } from "modules";
import { Fields, Button } from "components";

const User = ({ showEditModal, selectedCard }: any): JSX.Element => {
  const { get, t } = useHooks();
  return (
    <div>
      <Container.Form
        url="/admins/update/me"
        name="admins"
        method="put"
        fields={[
          {
            type: "string",
            required: true,
            name: "username",
            value: get(selectedCard, "username"),
          },
          {
            type: "string",
            name: "password",
          },
        ]}
        onSuccess={(data, resetForm, query) => {
          query.invalidateQueries({ queryKey: ["admins"] });
          resetForm();
          showEditModal(false);
        }}
        onError={(error) => {
          notification.error({
            message: get(error, "errorMessage", t("Something went wrong!")),
            duration: 2,
          });
        }}
      >
        {({ isLoading }) => {
          return (
            <Spin spinning={isLoading} tip={t("Verifying")}>
              <div>
                <Field
                  type="text"
                  name="username"
                  label={t("Username")}
                  component={Fields.Input}
                  placeholder={t("Username")}
                />
                <Field
                  type="password"
                  name="password"
                  label={t("Password")}
                  component={Fields.Input}
                  placeholder={t("Password")}
                />
                <Button
                  size="large"
                  htmlType="submit"
                  title={t("Saqlash")}
                  className="w-full mt-[10px]"
                />
              </div>
            </Spin>
          );
        }}
      </Container.Form>
    </div>
  );
};

export default User;
