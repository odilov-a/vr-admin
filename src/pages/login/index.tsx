import { useState } from "react";
import { Fields, Button } from "components";

import { Container } from "modules";
import { FastField } from "formik";

import { useHooks } from "hooks";
import useStore from "store";

const Login = () => {
  const { get, t } = useHooks();
  const { signIn } = useStore((state) => state);

  const { system } = useStore();

  return (
    <section className="login-wrapper">
      {get(system, "attemptStatus") === "200" && (
        <div className="form-wrapper">
          <Container.Form
            url="admins/login"
            method="post"
            name="profileData"
            fields={[
              {
                name: "username",
                type: "string",
              },
              {
                name: "password",
                type: "string",
              },
            ]}
            onSuccess={(response) => {
              signIn({
                token: get(response, "data.token"),
                data: response,
              });
            }}
            onError={(error) => {
              console.log("Error", error);
              console.log({ error: error.response.status });
            }}
          >
            {({ isLoading, setFieldTouched }) => {
              return (
                <div>
                  <h1 className="text-center text-[#000000DE] text-[32px] font-[700] mb-[4px]">
                    {t("Tizimga kirish")}
                  </h1>
                  <p className="text-center text-[20px] mb-[32px]">
                    {t("Admin paneliga xush kelibsiz")}
                  </p>
                  <div></div>
                  <FastField
                    name="username"
                    component={Fields.Input}
                    autoComplete="off"
                    placeholder="Login"
                    label="Login"
                    setFieldTouched={setFieldTouched}
                    rootClassName="mb-[8px]"
                  />
                  <FastField
                    name="password"
                    autoComplete="off"
                    component={Fields.Password}
                    placeholder={"Parol"}
                    label={"Parol"}
                    type="password"
                    rootClassName="mb-[8px]"
                  />
                  <Button
                    title={isLoading ? "Iltimos kuting" : "Kirish"}
                    isLoading={isLoading}
                    disabled={isLoading}
                    size="large"
                    htmlType="submit"
                    className="w-full h-auto"
                  />
                </div>
              );
            }}
          </Container.Form>
        </div>
      )}
    </section>
  );
};

export default Login;
