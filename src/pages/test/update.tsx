import { notification, Spin } from "antd";
import { Container } from "modules";
import { useGet, useHooks } from "hooks";
import { gen4 } from "services/helpers";

import Form from "./form";

const TestCreate = (): JSX.Element => {
  const { get, t, params, queryClient, navigate } = useHooks();
  let id = get(params, "id");

  const { data: testData } = useGet({
    name: `test-${id}`,
    url: `/tests/test/${id}`,
    onSuccess: () => {},
    onError: () => {},
  });

  const data = get(testData, "data");

  return (
    <div>
      <Container.Form
        name="tests"
        url={get(data, "_id") ? `tests/${get(data, "_id")}` : "tests"}
        method={get(data, "_id") ? "put" : "post"}
        fields={[
          {
            name: "nameUz",
            type: "string",
            value: get(data, "nameUz", null),
            required: true,
          },
          {
            name: "nameRu",
            type: "string",
            value: get(data, "nameRu", null),
            required: true,
          },
          {
            name: "nameEn",
            type: "string",
            value: get(data, "nameEn", null),
            required: true,
          },
          {
            name: "subject",
            type: "any",
            value: get(data, "subject", null),
            onSubmitValue: (value) => value._id,
          },
          {
            name: "point",
            type: "number",
            value: get(data, "point", null),
          },
          {
            name: "questions",
            type: "array",
            value:
              get(data, "questions", []).length > 0
                ? get(data, "questions", []).reduce(
                    (prev: any, curr: any) => [
                      ...prev,
                      {
                        uid: gen4(),
                        _id: curr._id,
                        titleUz: curr.titleUz,
                        titleRu: curr.titleRu,
                        titleEn: curr.titleEn,
                        type: curr.type,
                        photoUrl: curr.photoUrl,
                        answers: get(curr, "answers", []).map((item: any) =>
                          get(curr, "answers", []).length > 0
                            ? {
                                uid: gen4(),
                                _id: item._id,
                                answerUz: item.answerUz,
                                answerRu: item.answerRu,
                                answerEn: item.answerEn,
                                isCorrect: item.isCorrect,
                              }
                            : {
                                uid: gen4(),
                                photoUrl: "",
                                answerUz: "",
                                answerRu: "",
                                answerEn: "",
                                isCorrect: "",
                              }
                        ),
                      },
                    ],
                    []
                  )
                : [
                    {
                      uid: gen4(),
                      titleUz: "",
                      titleRu: "",
                      titleEn: "",
                      photoUrl: "",
                      type: 1,
                      answers: [
                        {
                          uid: gen4(),
                          answerUz: "",
                          answerRu: "",
                          answerEn: "",
                          isCorrect: false,
                        },
                      ],
                    },
                  ],
            onSubmitValue: (value, values) =>
              value.map((item: any, idx: any) => ({
                _id: item._id,
                titleUz: item.titleUz,
                titleRu: item.titleRu,
                titleEn: item.titleEn,
                photoUrl: item.photoUrl,
                type: item.type.value,
                answers: get(item, "answers", []).map((ans: any) => ({
                  _id: ans._id,
                  answerUz: ans.answerUz,
                  answerRu: ans.answerRu,
                  answerEn: ans.answerEn,
                  isCorrect: ans.isCorrect,
                })),
              })),
          },
        ]}
        onSuccess={(data, resetForm, query) => {
          navigate("/test");
          queryClient.invalidateQueries({
            queryKey: [`test-${id}`],
          });
          notification["success"]({
            message: get(data, "_id")
              ? t("Успешно изменен!")
              : t("Успешно добавлен!"),
            duration: 2,
          });
        }}
        onError={(error) => {
          notification["error"]({
            message: t(get(error, "response.data.error", "Произошло ошибка!")),
            duration: get(error, "response.data.message") ? 4 : 2,
          });
        }}
      >
        {({ isLoading, setFieldValue, values }) => {
          return (
            <Spin spinning={isLoading} tip={t("Verifying")}>
              <Form {...{ setFieldValue, values }} />
            </Spin>
          );
        }}
      </Container.Form>
    </div>
  );
};

export default TestCreate;
