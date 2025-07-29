import { useState } from "react";
import { notification, Tabs } from "antd";
import { Button, Fields } from "components";
import { Field } from "formik";
import { useGet, useHooks } from "hooks";
import Container from "modules/container";
import { utils } from "services";

const { TabPane } = Tabs;

const Update = () => {
  const { get, t, navigate, location, params } = useHooks();
  const [selectedLang, setSelectedLang] = useState("O'z");
  const isUpdate = utils.extractBaseUrl(location.pathname) === "/organs/update";
  const problemId = params.id;

  const { data: problemData } = useGet({
    name: `organs`,
    url: `/organs/${problemId}`,
    onSuccess: () => {},
    onError: (err) => {
      console.error("Error fetching data:", err);
    },
  });

  const data = get(problemData, "data");

  return (
    <div>
      <Container.Form
        url={isUpdate && data ? `/organs/${get(data, "_id")}` : "/organs"}
        name="organs"
        method={isUpdate ? "put" : "post"}
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
            name: "descriptionUz",
            value: get(data, "descriptionUz"),
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
            name: "descriptionRu",
            value: get(data, "descriptionRu"),
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
            name: "descriptionEn",
            value: get(data, "descriptionEn"),
          },
          {
            type: "number",
            required: true,
            name: "type",
            value: get(data, "type"),
          },
          {
            type: "array",
            required: true,
            name: "photoUrls",
            value: get(data, "photoUrls"),
          },
        ]}
        onSuccess={() => {
          navigate("/organs");
        }}
        onError={(error) => {
          notification.error({
            message: get(error, "errorMessage", t("Something went wrong!")),
            duration: 2,
          });
        }}
      >
        {({ submitForm }) => {
          return (
            <div>
              <div className="content-panel page-heading">
                <p className="page-heading__title">
                  {isUpdate ? t("O'zgartirish") : t("Qo'shish")}
                </p>
                <div className="page-heading__right gap-2">
                  <Button
                    title={t("Bekor qilish")}
                    className="mr-[20px]"
                    onClick={() => navigate("/organs")}
                  />
                  <Button
                    title={isUpdate ? t("Saqlash") : t("Tasdiqlash")}
                    onClick={submitForm}
                  />
                </div>
              </div>
              <div className="content-panel">
                <Tabs
                  activeKey={selectedLang}
                  onChange={(key) => setSelectedLang(key)}
                  type="card"
                >
                  <TabPane tab="O'zbek" key="O'z">
                    <div>
                      <Field
                        type="text"
                        name="nameUz"
                        label={t("Name (uz)")}
                        component={Fields.Input}
                        placeholder={t("uz sarlavhani kiriting")}
                      />
                      <p className="text-[#9EA3B5] px-[12px] py-[6px] bg-[#E6ECFE] dark:bg-[#454d70] rounded-[6px] inline-block mb-[12px] mr-[10px]">
                        {t("Description (uz)")}
                      </p>
                      <Field
                        name="descriptionUz"
                        className="h-[40vh]"
                        component={Fields.Ckeditor}
                        placeholder={t("uz haqida kiriting")}
                      />
                    </div>
                  </TabPane>
                  <TabPane tab="Русский" key="Ру">
                    <div>
                      <Field
                        type="text"
                        name="nameRu"
                        label={t("Name (ru)")}
                        component={Fields.Input}
                        placeholder={t("ru sarlavhani kiriting")}
                      />
                      <p className="text-[#9EA3B5] px-[12px] py-[6px] bg-[#E6ECFE] dark:bg-[#454d70] rounded-[6px] inline-block mb-[12px] mr-[10px]">
                        {t("Description (ru)")}
                      </p>
                      <Field
                        name="descriptionRu"
                        className="h-[40vh]"
                        component={Fields.Ckeditor}
                        placeholder={t("ru haqida kiriting")}
                      />
                    </div>
                  </TabPane>
                  <TabPane tab="English" key="En">
                    <div>
                      <Field
                        type="text"
                        name="nameEn"
                        label={t("Name (en)")}
                        component={Fields.Input}
                        placeholder={t("en sarlavhani kiriting")}
                      />
                      <p className="text-[#9EA3B5] px-[12px] py-[6px] bg-[#E6ECFE] dark:bg-[#454d70] rounded-[6px] inline-block mb-[12px] mr-[10px]">
                        {t("Description (en)")}
                      </p>
                      <Field
                        name="descriptionEn"
                        className="h-[40vh]"
                        component={Fields.Ckeditor}
                        placeholder={t("en haqida kiriting")}
                      />
                    </div>
                  </TabPane>
                  <TabPane tab="Image" key="File">
                    <div className="flex items-center">
                      <Field
                        name="type"
                        label={t("Type")}
                        component={Fields.Select}
                        options={[
                          { label: t("Erkan"), value: 1 },
                          { label: t("Ayol"), value: 2 },
                        ]}
                        className="mr-[30px]"
                      />
                    </div>
                    <div>
                      <Field
                        name="photoUrls"
                        placeholder={t("Rasm qo'shish")}
                        multiple={true}
                        component={Fields.FileUpload}
                        className="mr-[30px]"
                      />
                    </div>
                  </TabPane>
                </Tabs>
              </div>
            </div>
          );
        }}
      </Container.Form>
    </div>
  );
};

export default Update;
