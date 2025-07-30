import { Spin, notification } from "antd";
import { Field } from "formik";
import { useHooks } from "hooks";
import { Container } from "modules";
import { Fields, Button } from "components";

const Student = ({ showCreateModal, createModal }: any): JSX.Element => {
  const { t, get } = useHooks();
  let data = createModal.data && createModal?.data;
  return (
    <div>
      <Container.Form
        url={data._id ? `/students/${get(data, "_id")}` : "/students/admin/register"}
        method={data._id ? "put" : "post"}
        name="students"
        fields={[
          {
            type: "string",
            name: "firstName",
            value: get(data, "firstName"),
          },
          {
            type: "string",
            name: "lastName",
            value: get(data, "lastName"),
          },
          {
            type: "string",
            name: "password",
          },
          {
            type: "any",
            name: "isActive",
            value: get(data, "isActive"),
          },
          {
            type: "string",
            name: "username",
            value: get(data, "username"),
          },
        ]}
        onSuccess={(data, resetForm, query) => {
          query.invalidateQueries({ queryKey: ["students"] });
          resetForm();
          showCreateModal(false);
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
              <div className="mt-5">
                  <p className="text-[#9EA3B5] px-[12px] py-[6px] bg-[#E6ECFE] dark:bg-[#454d70] rounded-[6px] inline-block mb-[12px] mr-[10px]">
                    {t("is Active")}
                  </p>
                  <Field
                    name="isActive"
                    component={Fields.Switch}
                    rootClassName="mb-[10px]"
                  />
                <div className="flex">
                  <Field
                    name="firstName"
                    label={t("First name")}
                    component={Fields.Input}
                    placeholder={t("First name")}
                    rootClassName="mb-[10px] mr-[10px] w-full"
                  />
                  <Field
                    name="lastName"
                    label={t("Last name")}
                    component={Fields.Input}
                    placeholder={t("Last name")}
                    rootClassName="mb-[10px] w-full"
                  />
                </div>
                <div className="flex">
                  <Field
                    name="username"
                    label={t("Username")}
                    component={Fields.Input}
                    placeholder={t("Username")}
                    rootClassName="mb-[10px] mr-[10px] w-full"
                  />
                  <Field
                    name="password"
                    label={t("Password")}
                    component={Fields.Input}
                    placeholder={t("Password")}
                    rootClassName="mb-[10px] mr-[10px] w-full"
                  />
                </div>
                <Button
                  size="large"
                  title={t("Save")}
                  htmlType="submit"
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

export default Student;
