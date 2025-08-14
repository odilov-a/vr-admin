import { useState } from "react";
import { notification, Tabs } from "antd";
import { Button, Fields } from "components";
import { Field } from "formik";
import { useGet, useHooks } from "hooks";
import Container from "modules/container";
import { utils, api } from "services"; // api: sizda bor bo‘lgan axios instance deb faraz qilamiz

const { TabPane } = Tabs;

const Update = () => {
  const { get, t, navigate, location, params } = useHooks();
  const [selectedLang, setSelectedLang] = useState("O'z");
  const isUpdate = utils.extractBaseUrl(location.pathname) === "/books/update";
  const problemId = params.id;

  // 1) Fayl yuklovchi helperlar (CDN endpoint'lar nomini o'zingizniki bilan almashtiring)
  const uploadImage = async (file: File): Promise<{ id: string; url: string }> => {
    const fd = new FormData();
    fd.append("file", file);
    // misol uchun: POST /cdn/upload/image -> { id, url }
    const { data } = await api.post("/cdn/upload/image", fd);
    return { id: data.id, url: data.url };
  };

  const uploadPdf = async (file: File): Promise<{ id: string; url: string }> => {
    const fd = new FormData();
    fd.append("file", file);
    // misol uchun: POST /cdn/upload/pdf -> { id, url }
    const { data } = await api.post("/cdn/upload/image", fd);
    return { id: data.id, url: data.url };
  };

  const { data: problemData } = useGet({
    name: `books`,
    url: `/books/${problemId}`,
    onError: (err) => console.error("Error fetching data:", err),
  });

  const data = get(problemData, "data");

  return (
    <div>
      <Container.Form
        url={isUpdate && data ? `/books/${get(data, "_id")}` : "/books"}
        name="books"
        method={isUpdate ? "put" : "post"}
        // 2) Dastlabki qiymatlar backend formatida bo‘lsa ( [{id,url}] ), shu zanjir bilan ketaveradi
        fields={[
          { type: "string", required: true, name: "nameUz", value: get(data, "nameUz") },
          { type: "string", required: true, name: "descriptionUz", value: get(data, "descriptionUz") },
          { type: "string", required: true, name: "nameRu", value: get(data, "nameRu") },
          { type: "string", required: true, name: "descriptionRu", value: get(data, "descriptionRu") },
          { type: "string", required: true, name: "nameEn", value: get(data, "nameEn") },
          { type: "string", required: true, name: "descriptionEn", value: get(data, "descriptionEn") },
          { type: "number", required: true, name: "price", value: get(data, "price") },
          { type: "array", required: true, name: "photoUrls", value: get(data, "photoUrls") }, // [{id,url}]
          { type: "array", required: true, name: "pdfUrls", value: get(data, "pdfUrls") },     // [{id,url}]
        ]}
        onSuccess={() => navigate("/books")}
        onError={(error) =>
          notification.error({
            message: get(error, "errorMessage", t("Something went wrong!")),
            duration: 2,
          })
        }
      >
        {({ submitForm }) => (
          <div>
            <div className="content-panel page-heading">
              <p className="page-heading__title">
                {isUpdate ? t("O'zgartirish") : t("Qo'shish")}
              </p>
              <div className="page-heading__right gap-2">
                <Button title={t("Bekor qilish")} className="mr-[20px]" onClick={() => navigate("/books")} />
                <Button title={isUpdate ? t("Saqlash") : t("Tasdiqlash")} onClick={submitForm} />
              </div>
            </div>

            <div className="content-panel">
              <Tabs activeKey={selectedLang} onChange={setSelectedLang as any} type="card">
                <TabPane tab="O'zbek" key="O'z">
                  <Field type="text" name="nameUz" label={t("Name (uz)")} component={Fields.Input} placeholder={t("uz sarlavhani kiriting")} />
                  <p className="text-[#9EA3B5] px-[12px] py-[6px] bg-[#E6ECFE] dark:bg-[#454d70] rounded-[6px] inline-block mb-[12px] mr-[10px]">
                    {t("Description (uz)")}
                  </p>
                  <Field name="descriptionUz" className="h-[40vh]" component={Fields.Ckeditor} placeholder={t("uz haqida kiriting")} />
                </TabPane>

                <TabPane tab="Русский" key="Ру">
                  <Field type="text" name="nameRu" label={t("Name (ru)")} component={Fields.Input} placeholder={t("ru sarlavhani kiriting")} />
                  <p className="text-[#9EA3B5] px-[12px] py-[6px] bg-[#E6ECFE] dark:bg-[#454d70] rounded-[6px] inline-block mb-[12px] mr-[10px]">
                    {t("Description (ru)")}
                  </p>
                  <Field name="descriptionRu" className="h-[40vh]" component={Fields.Ckeditor} placeholder={t("ru haqida kiriting")} />
                </TabPane>

                <TabPane tab="English" key="En">
                  <Field type="text" name="nameEn" label={t("Name (en)")} component={Fields.Input} placeholder={t("en sarlavhani kiriting")} />
                  <p className="text-[#9EA3B5] px-[12px] py-[6px] bg-[#E6ECFE] dark:bg-[#454d70] rounded-[6px] inline-block mb-[12px] mr-[10px]">
                    {t("Description (en)")}
                  </p>
                  <Field name="descriptionEn" className="h-[40vh]" component={Fields.Ckeditor} placeholder={t("en haqida kiriting")} />
                </TabPane>

                <TabPane tab="Image" key="File">
                  <div className="flex items-center">
                    <Field
                      type="number"
                      name="price"
                      label={t("Price")}
                      component={Fields.Input}
                      placeholder={t("Narxni kiriting")}
                      className="mr-[30px]"
                    />
                  </div>

                  {/* 3) Rasm uploader: multiple + onUpload -> [{id,url}] */}
                  <div className="flex items-center justify-content-between g-4">
                    <Field
                      name="photoUrls"
                      placeholder={t("Rasm qo'shish")}
                      multiple
                      // agar sizning FileUpload ham onUpload qabul qilsa:
                      onUpload={uploadImage}
                      accept="image/*"
                      limit={6}
                      component={Fields.FileUpload}
                      className="mr-[30px]"
                    />
                  </div>

                  {/* 4) PDF uploader: multiple + onUpload -> [{id,url}] */}
                  <div className="mt-3">
                    <Field
                      name="pdfUrls"
                      placeholder={t(".PDF file qo'shish")}
                      multiple
                      onUpload={uploadPdf}
                      accept=".pdf"
                      limit={1}
                      listType="picture-card"
                      component={Fields.PdfUploadField}
                      className="mr-[30px]"
                    />
                  </div>
                </TabPane>
              </Tabs>
            </div>
          </div>
        )}
      </Container.Form>
    </div>
  );
};

export default Update;
