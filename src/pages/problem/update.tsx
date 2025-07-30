import { useState } from "react";
import { notification, Upload, Tabs } from "antd";
import { Button, Fields } from "components";
import { Field, FieldArray } from "formik";
import { UploadOutlined } from "@ant-design/icons";
import { useGet, useHooks } from "hooks";
import Container from "modules/container";
import { utils } from "services";

const { TabPane } = Tabs;

const Create = () => {
  const { get, t, navigate, location, params } = useHooks();
  const [selectedLang, setSelectedLang] = useState("O'z");
  const isUpdate =
    utils.extractBaseUrl(location.pathname) === "/problems/update";
  const problemId = params.id;

  const { data: problemData } = useGet({
    name: `problems`,
    url: `/problems/${problemId}`,
    onSuccess: () => {},
    onError: () => {},
  });

  const data = get(problemData, "data");

  const handleFileUpload = async (
    file: any,
    setFieldValue: any,
    field: string,
    index: number,
    type: "input" | "output"
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_ROOT_FILE_UPLOAD}/tests/upload`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const result = await response.json();
      if (response.ok && result.data) {
        setFieldValue(`testCases.${index}.${type}FileUrl`, result.data.fileUrl);
        notification.success({
          message: t("File upload successful"),
          description: t("The file was uploaded successfully"),
        });
      } else {
        notification.error({
          message: t("File upload failed"),
          description: result.message || t("Something went wrong"),
        });
      }
    } catch (error) {
      notification.error({
        message: t("File upload error"),
        description: (error as Error).message,
      });
    }
  };

  return (
    <div>
      <Container.Form
        url={isUpdate ? `/problems/${get(data, "_id")}` : "/problems"}
        name="problems"
        method={isUpdate ? "put" : "post"}
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
            name: "descriptionUz",
            value: get(data, "descriptionUz"),
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
            name: "descriptionRu",
            value: get(data, "descriptionRu"),
          },
          {
            type: "string",
            required: true,
            name: "titleEn",
            value: get(data, "titleEn"),
          },
          {
            type: "string",
            required: true,
            name: "descriptionEn",
            value: get(data, "descriptionEn"),
          },
          {
            name: "point",
            required: true,
            type: "number",
            value: get(data, "point"),
          },
          {
            type: "string",
            required: true,
            name: "tutorials",
            value: get(data, "tutorials"),
          },
          {
            type: "number",
            required: true,
            name: "timeLimit",
            value: get(data, "timeLimit"),
          },
          {
            type: "number",
            required: true,
            name: "memoryLimit",
            value: get(data, "memoryLimit"),
          },
          {
            type: "any",
            required: true,
            name: "subject",
            value: get(data, "subject"),
          },
          {
            type: "any",
            required: true,
            name: "difficulty",
            value: get(data, "difficulty"),
          },
          {
            type: "array",
            required: true,
            name: "testCases",
            value: get(data, "testCases", []),
          },
          // {
          //   type: "boolean",
          //   name: "forArena",
          //   value: get(data, "forArena"),
          // },
        ]}
        onSuccess={() => {
          navigate("/problems");
        }}
        onError={(error) => {
          notification.error({
            message: get(error, "errorMessage", t("Something went wrong!")),
            duration: 2,
          });
        }}
      >
        {({ submitForm, values, setFieldValue }) => {
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
                    onClick={() => navigate("/problems")}
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
                        name="titleUz"
                        label={t("Title (uz)")}
                        component={Fields.Input}
                        placeholder={t("uz sarlavhani kiriting")}
                      />
                      <p className="text-[#9EA3B5] px-[12px] py-[6px] bg-[#E6ECFE] dark:bg-[#454d70] rounded-[6px] inline-block mb-[12px] mr-[10px]">
                        {t("descriptionUz")}
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
                        name="titleRu"
                        label={t("Title (ru)")}
                        component={Fields.Input}
                        placeholder={t("ru sarlavhani kiriting")}
                      />
                      <p className="text-[#9EA3B5] px-[12px] py-[6px] bg-[#E6ECFE] dark:bg-[#454d70] rounded-[6px] inline-block mb-[12px] mr-[10px]">
                        {t("descriptionRu")}
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
                        name="titleEn"
                        label={t("Title (en)")}
                        component={Fields.Input}
                        placeholder={t("en sarlavhani kiriting")}
                      />
                      <p className="text-[#9EA3B5] px-[12px] py-[6px] bg-[#E6ECFE] dark:bg-[#454d70] rounded-[6px] inline-block mb-[12px] mr-[10px]">
                        {t("descriptionEn")}
                      </p>
                      <Field
                        name="descriptionEn"
                        className="h-[40vh]"
                        component={Fields.Ckeditor}
                        placeholder={t("en haqida kiriting")}
                      />
                    </div>
                  </TabPane>
                  <TabPane tab="Settings" key="St">
                    <div className="flex">
                      <div className="mr-[20px]">
                        {/* <p className="text-[#9EA3B5] px-[12px] py-[6px] bg-[#E6ECFE] dark:bg-[#454d70] rounded-[6px] inline-block mb-[12px] mr-[10px]">
                          {t("forArena")}
                        </p>
                        <Field
                          name="forArena"
                          label={t("forArena")}
                          component={Fields.Switch}
                          rootClassName="mb-[10px]"
                        /> */}
                        <Field
                          required
                          name="point"
                          type="number"
                          label={t("point")}
                          component={Fields.Input}
                          placeholder={t("point")}
                          rootClassName="mb-[10px] mr-[10px] w-full"
                        />
                        <Field
                          required
                          type="number"
                          name="timeLimit"
                          label={t("timeLimit")}
                          component={Fields.Input}
                          placeholder={t("timeLimit")}
                          rootClassName="mb-[10px] mr-[10px] w-full"
                        />
                        <Field
                          required
                          type="number"
                          name="memoryLimit"
                          label={t("memoryLimit")}
                          component={Fields.Input}
                          placeholder={t("memoryLimit")}
                          rootClassName="mb-[10px] w-full mr-[10px]"
                        />
                        <Field
                          required
                          name="tutorials"
                          label={t("tutorial link")}
                          component={Fields.Input}
                          placeholder={t("tutorial")}
                          rootClassName="mb-[10px] w-full mr-[10px]"
                        />
                      </div>
                      <div className="grid grid-rows-4 w-[30%]">
                        <Field
                          required
                          name="subject"
                          url="/subjects"
                          optionValue="_id"
                          optionLabel="title"
                          label={t("subjects")}
                          placeholder={t("subjects")}
                          component={Fields.AsyncSelect}
                          onChange={(value: any) => {
                            setFieldValue("subject", value);
                          }}
                        />
                        <Field
                          required
                          name="difficulty"
                          url="/difficulties"
                          optionValue="_id"
                          optionLabel="title"
                          label={t("difficulty")}
                          placeholder={t("difficulty")}
                          component={Fields.AsyncSelect}
                          onChange={(value: any) => {
                            setFieldValue("difficulty", value);
                          }}
                        />
                      </div>
                    </div>
                  </TabPane>
                  <TabPane tab="Test Cases" key="TC">
                    <FieldArray name="testCases">
                      {({ push, remove }) => (
                        <div>
                          <div className="mb-[10px] w-[30%]">
                            <Button
                              title={t("Add Test Case")}
                              onClick={() =>
                                push({ inputFileUrl: "", outputFileUrl: "" })
                              }
                            />
                          </div>
                          {values.testCases.map(
                            (testCase: any, index: number) => (
                              <div key={index} className="flex mb-[10px]">
                                <div className="mr-[10px]">
                                  <p className="text-[#9EA3B5] px-[12px] py-[6px] bg-[#E6ECFE] dark:bg-[#454d70] rounded-[6px] inline-block mb-[12px] mr-[10px]">
                                    {index + 1}
                                  </p>
                                  <Upload
                                    beforeUpload={(file) => {
                                      handleFileUpload(
                                        file,
                                        setFieldValue,
                                        "testCases",
                                        index,
                                        "input"
                                      );
                                      return false;
                                    }}
                                    showUploadList={false}
                                  >
                                    <Button
                                      icon={<UploadOutlined />}
                                      title={t("Upload Input File")}
                                    />
                                  </Upload>
                                </div>
                                <div>
                                  <p className="text-[#9EA3B5] px-[12px] py-[6px] bg-[#E6ECFE] dark:bg-[#454d70] rounded-[6px] inline-block mb-[12px] mr-[10px]">
                                    {index + 1}
                                  </p>
                                  <Upload
                                    beforeUpload={(file) => {
                                      handleFileUpload(
                                        file,
                                        setFieldValue,
                                        "testCases",
                                        index,
                                        "output"
                                      );
                                      return false;
                                    }}
                                    showUploadList={false}
                                  >
                                    <Button
                                      icon={<UploadOutlined />}
                                      title={t("Upload Output File")}
                                    />
                                  </Upload>
                                </div>
                                <div className="ml-[10px]">
                                  <Button
                                    title={t("Remove")}
                                    onClick={() => remove(index)}
                                  />
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </FieldArray>
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

export default Create;
