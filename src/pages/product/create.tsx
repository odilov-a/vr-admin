import { Spin, notification } from "antd";
import { Field } from "formik";
import { useHooks } from "hooks";
import { Container } from "modules";
import { Fields, Button } from "components";

const Product = ({ showCreateModal, createModal }: any): JSX.Element => {
  const { t, get } = useHooks();
  let data = createModal.data && createModal?.data;
  return (
    <div>
      <Container.Form
        url={data._id ? `/products/${get(data, "_id")}` : "/products"}
        method={data._id ? "put" : "post"}
        name="products"
        fields={[
          {
            type: "string",
            required: true,
            name: "nameUz",
            value: get(data, "nameUz"),
          },
          {
            type: "string",
            required: true,
            name: "nameRu",
            value: get(data, "nameRu"),
          },
          {
            type: "string",
            required: true,
            name: "nameEn",
            value: get(data, "nameEn"),
          },
          {
            type: "string",
            required: true,
            name: "price",
            value: get(data, "price"),
          },
          {
            type: "any",
            name: "photoUrl",
            value: get(data, "photoUrl"),
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
        {({ isLoading }) => {
          return (
            <Spin spinning={isLoading} tip={t("Verifying")}>
              <div className="mt-5">
                <div className="flex">
                  <Field
                    required
                    name="nameUz"
                    label={t("name uzbek")}
                    component={Fields.Input}
                    placeholder={t("name uzbek")}
                    rootClassName="mb-[10px] mr-[10px]"
                  />
                  <Field
                    required
                    name="nameRu"
                    label={t("name rus")}
                    component={Fields.Input}
                    placeholder={t("name rus")}
                    rootClassName="mb-[10px] mr-[10px]"
                  />
                  <Field
                    required
                    name="nameEn"
                    label={t("name eng")}
                    component={Fields.Input}
                    placeholder={t("name eng")}
                    rootClassName="mb-[10px] mr-[10px]"
                  />
                </div>
                <div>
                  <Field
                    required
                    name="price"
                    component={Fields.Input}
                    rootClassName="mb-[10px] w-[40%]"
                    type="number"
                    label={t("price")}
                    placeholder={t("price")}
                  />
                  <div>
                    <p className="text-[#9EA3B5] px-[12px] py-[6px] bg-[#E6ECFE] dark:bg-[#454d70] rounded-[6px] inline-block mb-[12px] mr-[10px]">
                      {t("photo")}
                    </p>
                    <Field
                      name="photoUrl"
                      label={t("Photo")}
                      placeholder={t("Photo")}
                      rootClassName="mb-[10px]"
                      component={Fields.FileUpload3}
                      accept="image/png, image/jpeg, image/jpg"
                    />
                  </div>
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

export default Product;
