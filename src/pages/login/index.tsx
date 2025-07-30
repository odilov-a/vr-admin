import { Container } from "modules";
import { notification } from "antd";
import { Fields, Button } from "components";
import { FastField } from "formik";
import { useHooks } from "hooks";
import useStore from "store";

const Login = () => {
  const { get, t } = useHooks();
  const { signIn } = useStore((state) => state);
  return (
    <section className="h-[100vh] px-[6%] py-[12%] login-wrapper">
      <Container.Form
        className="xl:max-w-[650px] lg:max-w-[450px] md:max-w-[400px] md:flex md:justify-center"
        url="/admins/login"
        method="post"
        fields={[
          {
            type: "string",
            required: true,
            name: "username",
          },
          {
            type: "string",
            required: true,
            name: "password",
          },
        ]}
        onSuccess={(response) => {
          signIn({
            token: get(response, "data.token"),
            data: {
              username: get(response, "data.username"),
              role: "admin",
            },
          });
        }}
        onError={(error) => {
          notification.error({
            message: get(error, "errorMessage", t("Something went wrong!")),
            duration: 2,
          });
        }}
      >
        {({ isLoading, setFieldTouched }) => {
          return (
            <div>
              <div>
                <h1 className="text-center text-[#000000DE] text-[32px] font-[600] mb-[8px]">
                  {t("Welcome to")}{" "}
                  <span className="text-[#3367F6]">
                    {" "}
                    {t("Admin Dashboard")}
                  </span>
                </h1>
                <p className="text-center text-[20px] text-[#9EA3B5] mb-[48px]">
                  {t("Please enter your admin credentials to login.")}
                </p>
                <FastField
                  required={true}
                  name="username"
                  isLoginPage={true}
                  rootClassName="mb-7"
                  placeholder={t("Login")}
                  component={Fields.Input}
                  setFieldTouched={setFieldTouched}
                />
                <FastField
                  required={true}
                  name="password"
                  type="password"
                  rootClassName="mb-7"
                  component={Fields.Password}
                  placeholder={t("Password")}
                />
                <Button
                  size="large"
                  htmlType="submit"
                  isLoading={isLoading}
                  className="w-full h-[50px] mt-[24px] text-[16px] font-[600]"
                  title={isLoading ? t("Please wait a second") : t("Log in")}
                />
              </div>
            </div>
          );
        }}
      </Container.Form>
    </section>
  );
};

export default Login;
