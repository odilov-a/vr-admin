import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { Field } from "formik";

import { Fields, Button } from "components";
import { useHooks } from "hooks";
import { gen4 } from "services/helpers";
import { Checkbox } from "antd";

const Form = ({ setFieldValue, values }: any) => {
  const { get, t } = useHooks();

  const removeMultiBox = (uid: any) => {
    const newArray = values.questions.filter((f: any) => f.uid !== uid);
    setFieldValue("questions", newArray);
  };

  const addMultiBox = () => {
    setFieldValue("questions", [
      ...values.questions,
      {
        uid: gen4(),
        photoUrl: "",
        answers: [
          {
            answerUz: "",
            answerRu: "",
            answerEn: "",
            isCorrect: false,
            uid: gen4(),
          },
        ],
      },
    ]);
  };

  const removeAnsBox = (uid: any, ansId: any) => {
    values.questions.map((item: any, idx: number) => {
      if (uid === item.uid) {
        const newArray = get(values.questions[idx], "answers").filter(
          (f: any) => f.uid !== ansId
        );
        setFieldValue(`questions[${idx}]answers`, newArray);
      }
    });
  };

  const addAnsBox = (uid: any) => {
    values.questions.map((item: any, idx: number) => {
      if (uid === item.uid) {
        setFieldValue(`questions[${idx}]answers`, [
          ...values.questions[idx].answers,
          {
            uid: gen4(),
            answerUz: "",
            answerRu: "",
            answerEn: "",
            isCorrect: false,
          },
        ]);
      }
    });
  };

  return (
    <>
      <div>
        <div className="flex justify-between mb-[30px]">
          <div className="w-[49%]">
            <Field
              type="text"
              name="nameUz"
              label={t("nameUz")}
              component={Fields.Input}
              placeholder={t("nameUz")}
            />
            <Field
              type="text"
              name="nameRu"
              label={t("nameRu")}
              component={Fields.Input}
              placeholder={t("nameRu")}
            />
            <Field
              type="text"
              name="nameEn"
              label={t("nameEn")}
              component={Fields.Input}
              placeholder={t("nameEn")}
            />
          </div>
          <div className="w-[49%]">
            <Field
              required
              name="subject"
              url="/subjects"
              optionValue="_id"
              optionLabel="titleEn"
              label={t("subjects")}
              placeholder={t("subjects")}
              component={Fields.AsyncSelect}
              onChange={(value: any) => {
                setFieldValue("subject", value);
              }}
              rootClassName="mb-[10px] w-full mr-[10px]"
            />
            <Field
              type="text"
              name="point"
              label={t("point")}
              placeholder={t("point")}
              component={Fields.Input}
              rootClassName="mb-[15px]"
            />
          </div>
        </div>
        <div className="mb-[24px]">
          <p className="mb-[10px] font-bold text-[18px]">{t("Questions")}</p>
          {get(values, "questions", []).map((item: any, index: number) => {
            return (
              <div
                key={item.uid}
                className="flex justify-between flex-col w-full border-2 border-dashed rounded-[10px] p-2 mb-[10px]"
              >
                <div className="w-full flex justify-between">
                  <div className="w-[48%] flex">
                    <div className="w-full">
                      <Field
                        type="text"
                        size="large"
                        component={Fields.Input}
                        label={t("question (uz)")}
                        placeholder={t("question (uz)")}
                        name={`questions[${index}].titleUz`}
                        rootClassName="w-full mr-[10px] mb-[15px]"
                        onChange={(e: any) => {
                          setFieldValue(
                            `questions[${index}].titleUz`,
                            e.target.value
                          );
                        }}
                      />
                      <Field
                        type="text"
                        size="large"
                        component={Fields.Input}
                        label={t("question (ru)")}
                        placeholder={t("question (ru)")}
                        name={`questions[${index}].titleRu`}
                        rootClassName="w-full mr-[10px] mb-[15px]"
                        onChange={(e: any) => {
                          setFieldValue(
                            `questions[${index}].titleRu`,
                            e.target.value
                          );
                        }}
                      />
                      <Field
                        type="text"
                        size="large"
                        component={Fields.Input}
                        label={t("question (en)")}
                        placeholder={t("question (en)")}
                        name={`questions[${index}].titleEn`}
                        rootClassName="w-full mr-[10px] mb-[15px]"
                        onChange={(e: any) => {
                          setFieldValue(
                            `questions[${index}].titleEn`,
                            e.target.value
                          );
                        }}
                      />
                      <Field
                        component={Fields.Select}
                        name={`questions[${index}].type`}
                        label="type"
                        placeholder={t("Test turini tanlang")}
                        optionLabel="label"
                        optionValue="value"
                        isClearable={true}
                        rootClassName="w-full mr-[10px] mb-[15px]"
                        options={[
                          {
                            label: t(
                              "Ochiq test (O'quvchi variantlardan birini tanlaydi)"
                            ),
                            value: 1,
                          },
                          {
                            label: t(
                              "Yopiq test (O'quvchi savolga javob yozadi)"
                            ),
                            value: 2,
                          },
                          {
                            label: t(
                              "Geometrik chizmali (O'quvchi geometrik chizma chizadi)"
                            ),
                            value: 3,
                          },
                        ]}
                      />
                      <div className="w-full">
                        <p className="text-[#9EA3B5] px-[12px] py-[6px] bg-[#E6ECFE] dark:bg-[#454d70] rounded-[6px] inline-block mb-[12px] mr-[10px]">
                          {t("question as photo format")}
                        </p>
                        <Field
                          type="file"
                          accept="image/*"
                          value={undefined}
                          rootClassName="mb-[10px]"
                          component={Fields.FileUpload3}
                          name={`questions[${index}].photoUrl`}
                          onChange={(event: any) => {
                            const files = event.target.files;
                            if (files && files.length > 0) {
                              setFieldValue(
                                `questions[${index}].photoUrl`,
                                files[0]
                              );
                            }
                          }}
                        />
                        {item.photoUrl && typeof item.photoUrl === "string" && (
                          <div className="mt-2">
                            <img
                              alt="Preview"
                              src={item.photoUrl}
                              className="max-w-[200px] rounded"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-[48%]">
                    {get(item, "answers", []).map((ans: any, idx: number) => {
                      return (
                        <div key={index} className="flex mb-[30px]">
                          <div className="w-full">
                            <Field
                              type="text"
                              size="large"
                              component={Fields.Input}
                              label={t("answer (uz)")}
                              placeholder={t("answer (uz)")}
                              rootClassName="w-full mr-[10px] mb-[15px]"
                              name={`questions[${index}].answers[${idx}].answerUz`}
                              onChange={(e: any) => {
                                setFieldValue(
                                  `questions[${index}].answers[${idx}].answerUz`,
                                  e.target.value
                                );
                              }}
                            />
                            <Field
                              type="text"
                              size="large"
                              label={t("answer (ru)")}
                              component={Fields.Input}
                              placeholder={t("answer (ru)")}
                              rootClassName="w-full mr-[10px] mb-[15px]"
                              name={`questions[${index}].answers[${idx}].answerRu`}
                              onChange={(e: any) => {
                                setFieldValue(
                                  `questions[${index}].answers[${idx}].answerRu`,
                                  e.target.value
                                );
                              }}
                            />
                            <Field
                              type="text"
                              size="large"
                              component={Fields.Input}
                              label={t("answer (en)")}
                              placeholder={t("answer (en)")}
                              rootClassName="w-full mr-[10px]"
                              name={`questions[${index}].answers[${idx}].answerEn`}
                              onChange={(e: any) => {
                                setFieldValue(
                                  `questions[${index}].answers[${idx}].answerEn`,
                                  e.target.value
                                );
                              }}
                            />
                            <Checkbox
                              className="mt-[20px]"
                              checked={
                                values.questions[index].answers[idx].isCorrect
                              }
                              onChange={(e: any) => {
                                const updatedAnswers = values.questions[
                                  index
                                ].answers.map((ans: any, ansIdx: number) => ({
                                  ...ans,
                                  isCorrect:
                                    ansIdx === idx ? e.target.checked : false,
                                }));
                                setFieldValue(
                                  `questions[${index}].answers`,
                                  updatedAnswers
                                );
                              }}
                            >
                              {t("true answer")}
                            </Checkbox>
                          </div>
                          <div className="h-full contents">
                            <div className="ml-[8px] flex flex-col justify-center">
                              {get(item, "answers", []).length > 1 && (
                                <button
                                  type="button"
                                  className="w-[30px] h-[100%] border-2 rounded-[5px] mb-[6px]"
                                  onClick={() =>
                                    removeAnsBox(item.uid, ans.uid)
                                  }
                                >
                                  <MinusCircleOutlined
                                    style={{ color: "red" }}
                                  />
                                </button>
                              )}
                              {get(item, "answers", []).length - 1 === idx && (
                                <button
                                  type="button"
                                  className="w-[30px] h-[100%] border-2 rounded-[5px]"
                                  onClick={() => addAnsBox(item.uid)}
                                >
                                  <PlusCircleOutlined
                                    style={{ color: "#40a9ff" }}
                                  />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="w-full">
                  <div className="mr-[8px] mt-[12px] flex justify-center w-full">
                    {get(values, "questions", []).length > 1 && (
                      <button
                        type="button"
                        className="h-[30px] w-full border-2 rounded-[5px] mr-[6px]"
                        onClick={() => removeMultiBox(item.uid)}
                      >
                        <MinusCircleOutlined style={{ color: "red" }} />
                      </button>
                    )}
                    {get(values, "questions", []).length - 1 === index && (
                      <button
                        type="button"
                        className="h-[30px] w-full border-2 rounded-[5px]"
                        onClick={() => addMultiBox()}
                      >
                        <PlusCircleOutlined style={{ color: "#40a9ff" }} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Button
        size="large"
        title={t("Save")}
        htmlType="submit"
        className="mt-[10px] w-full"
      />
    </>
  );
};

export default Form;
