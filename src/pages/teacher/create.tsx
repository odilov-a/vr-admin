import { Spin, notification } from "antd";
import { Field } from "formik";
import { useHooks } from "hooks";
import { Container } from "modules";
import { Fields, Button } from "components";

const Teacher = ({ showCreateModal, createModal }: any): JSX.Element => {
  const { t, get } = useHooks();
  let data = createModal.data && createModal?.data;
  return (
    <div>
      <Container.Form
        url={data._id ? `/teachers/${get(data, "_id")}` : "/teachers/register"}
        method={data._id ? "put" : "post"}
        name="teachers"
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
            type: "any",
            name: "subject",
            value: get(data, "subject"),
          },
          {
            type: "string",
            name: "password",
          },
          {
            type: "string",
            name: "username",
            value: get(data, "username"),
          },
        ]}
        onSuccess={(data, resetForm, query) => {
          query.invalidateQueries({ queryKey: ["teachers"] });
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
        {({ isLoading, setFieldValue }) => {
          return (
            <Spin spinning={isLoading} tip={t("Verifying")}>
              <div className="mt-5">
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
                    required
                    name="username"
                    label={t("Username")}
                    component={Fields.Input}
                    placeholder={t("Username")}
                    rootClassName="mb-[10px] mr-[10px] w-full"
                  />
                  <Field
                    required
                    name="password"
                    label={t("Password")}
                    component={Fields.Input}
                    placeholder={t("Password")}
                    rootClassName="mb-[10px] mr-[10px] w-full"
                  />
                </div>
                <div className="flex">
                  <Field
                    required
                    name="subject"
                    isMulti={true}
                    url="/subjects"
                    optionValue="_id"
                    optionLabel="title"
                    label={t("subjects")}
                    placeholder={t("subjects")}
                    component={Fields.AsyncSelect}
                    rootClassName="mb-[10px] w-full"
                    onChange={(value: any) => {
                      setFieldValue("subject", value);
                    }}
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

export default Teacher;
