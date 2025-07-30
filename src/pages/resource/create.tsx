import { Spin, notification } from "antd";
import { Field, FieldArray } from "formik";
import { useHooks } from "hooks";
import { Container } from "modules";
import { Fields, Button } from "components";

const Resource = ({ showCreateModal, createModal }: any): JSX.Element => {
  const { t, get } = useHooks();
  let data = createModal.data && createModal?.data;
  return (
    <div>
      <Container.Form
        url={data._id ? `/resources/${get(data, "_id")}` : "/resources"}
        method={data._id ? "put" : "post"}
        name="resources"
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
          {
            type: "array",
            name: "resources",
            value: get(data, "resources", []),
          },
        ]}
        onSuccess={(data, resetForm, query) => {
          query.invalidateQueries({ queryKey: ["products"] });
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
        {({ values, isLoading }) => {
          return (
            <Spin spinning={isLoading} tip={t("Verifying")}>
              <div className="mt-5">
                <div className="flex">
                  <Field
                    required
                    name="titleUz"
                    label={t("title uzbek")}
                    component={Fields.Input}
                    placeholder={t("title uzbek")}
                    rootClassName="mb-[10px] mr-[10px]"
                  />
                  <Field
                    required
                    name="titleRu"
                    label={t("title rus")}
                    component={Fields.Input}
                    placeholder={t("title rus")}
                    rootClassName="mb-[10px] mr-[10px]"
                  />
                  <Field
                    required
                    name="titleEn"
                    label={t("title eng")}
                    component={Fields.Input}
                    placeholder={t("title eng")}
                    rootClassName="mb-[10px]"
                  />
                </div>
                <FieldArray name="resources">
                  {({ push, remove }) => (
                    <div className="mb-4">
                      <p className="text-[#9EA3B5] px-[12px] py-[6px] bg-[#E6ECFE] dark:bg-[#454d70] rounded-[6px] inline-block mb-[12px] mr-[10px]">
                        {t("Resource")}
                      </p>
                      <Button
                        onClick={() => push("")}
                        title={t("Add New Resource")}
                        className="mb-2"
                      />
                      {values.resources && values.resources.length > 0
                        ? values.resources.map((_: any, index: any) => (
                            <div key={index} className="flex gap-2 mb-2">
                              <Field
                                name={`resources.${index}`}
                                component={Fields.Input}
                                placeholder={t("Resource value")}
                                className="w-full"
                              />
                              <Button
                                onClick={() => remove(index)}
                                title={t("Remove")}
                              />
                            </div>
                          ))
                        : null}
                    </div>
                  )}
                </FieldArray>
                <Button
                  size="large"
                  title={t("Save")}
                  htmlType="submit"
                  className="w-full mt-[20px]"
                />
              </div>
            </Spin>
          );
        }}
      </Container.Form>
    </div>
  );
};

export default Resource;
