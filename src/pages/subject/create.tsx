import { Spin, notification } from "antd";
import { Field } from "formik";
import { useHooks } from "hooks";
import { Container } from "modules";
import { Fields, Button } from "components";

const Subject = ({ showCreateModal, createModal }: any): JSX.Element => {
  const { t, get } = useHooks();
  let data = createModal.data && createModal?.data;
  return (
    <div>
      <Container.Form
        url={data._id ? `/subjects/${get(data, "_id")}` : "/subjects"}
        method={data._id ? "put" : "post"}
        name="subjects"
        fields={[
          {
            type: "string",
            required: true,
            name: "titleUz",
            value: get(data, "titleUz"),
          },
          {
            type: "string",
            required: true,
            name: "titleRu",
            value: get(data, "titleRu"),
          },
          {
            type: "string",
            required: true,
            name: "titleEn",
            value: get(data, "titleEn"),
          },
        ]}
        onSuccess={(data, resetForm, query) => {
          query.invalidateQueries({ queryKey: ["subjects"] });
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
                <Field
                  required
                  name="titleUz"
                  component={Fields.Input}
                  rootClassName="mb-[10px]"
                  label={t("subject uzbek")}
                  placeholder={t("subject uzbek")}
                />
                <Field
                  required
                  name="titleRu"
                  component={Fields.Input}
                  rootClassName="mb-[10px]"
                  label={t("subject russian")}
                  placeholder={t("subject russian")}
                />
                <Field
                  required
                  name="titleEn"
                  component={Fields.Input}
                  rootClassName="mb-[10px]"
                  label={t("subject english")}
                  placeholder={t("subject english")}
                />
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

export default Subject;
