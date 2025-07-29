import { useState } from "react";
import { Input, notification } from "antd";
import { useHooks, usePost } from "hooks";
import { Button } from "components";

const ChangePassword = ({ openPasswordModal }: any) => {
  const { t, get } = useHooks();
  const { mutate } = usePost();
  const [passwordVal, setPasswordVal] = useState("");
  const [success, setSuccess] = useState(false);
  const [firstPassword, setFirstPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");

  const checkPassword = (password: string) => {
    if (password) {
      mutate(
        {
          method: "post",
          url: `admins/check-password`,
          data: { password: password },
        },
        {
          onSuccess: () => {
            setSuccess(true);
            notification["success"]({
              message: t("Успешно удален!"),
              duration: 2,
            });
          },
          onError: (error: any) => {
            notification["error"]({
              message: t(get(error, "errorMessage", "Произошло ошибка!")),
              duration: 2,
            });
          },
        }
      );
    }
  };

  const resetPassword = (oldPassword: string, newPassword: string) => {
    if (oldPassword && newPassword) {
      mutate(
        {
          method: "post",
          url: `admins/reset-password`,
          data: { old: oldPassword, new: newPassword },
        },
        {
          onSuccess: () => {
            notification["success"]({
              message: t("Успешно удален!"),
              duration: 2,
            });
            openPasswordModal(false);
          },
          onError: (error: any) => {
            notification["error"]({
              message: t(get(error, "errorMessage", "Произошло ошибка!")),
              duration: 2,
            });
          },
        }
      );
    }
  };

  return (
    <div>
      {!success ? (
        <>
          <div className="change-password-warning">
            <div className="change-password-warning__text">
              {t(
                "Parolingizni o'zgartirish uchun eski parolingizni kiriting va"
              )}{" "}
              <span className="uppercase font-bold">{t("yangi parol")}</span>{" "}
              {t("o'rnating")}
            </div>
          </div>
          <div className="mt-[20px]">
            <p className="py-[6px] inline-block mb-[8px]">{t("Parol")}</p>
            <Input.Password
              key={1}
              autoFocus
              autoComplete={"off"}
              placeholder={t("Parolni kiriting")}
              className="panel-password"
              onChange={(e) => setPasswordVal(e.target.value)}
            />
          </div>
          <div className="flex justify-between mt-[20px]">
            <Button
              type="default"
              title="Bekor qilish"
              className="w-[49%]"
              onClick={() => openPasswordModal((prev: any) => !prev)}
            />
            <Button
              type="primary"
              title="Tasdiqlash"
              className="w-[49%]"
              disabled={!passwordVal}
              onClick={() => checkPassword(passwordVal)}
            />
          </div>
        </>
      ) : (
        <>
          <div className="mt-[20px]">
            <p className="py-[6px] inline-block mb-[8px]">{t("Yangi parol")}</p>
            <Input.Password
              key={2}
              onChange={(e) => setFirstPassword(e.target.value)}
              autoFocus
              placeholder={t("Yangi parolni kiriting")}
              className="panel-password"
            />
          </div>
          <div className="mt-[20px]">
            <p className="py-[6px] inline-block mb-[8px]">
              {t("Tasdiqlash paroli")}
            </p>
            <Input.Password
              key={3}
              onChange={(e) => setSecondPassword(e.target.value)}
              placeholder={t("Tasdiqlash parolini kiriting")}
              className="panel-password"
            />
          </div>
          <div className="flex justify-between mt-[20px]">
            <Button
              type="default"
              title="Bekor qilish"
              className="w-[49%]"
              onClick={() => openPasswordModal((prev: any) => !prev)}
            />
            <Button
              type="primary"
              title="Tasdiqlash"
              className="w-[49%]"
              disabled={firstPassword !== secondPassword}
              onClick={() => resetPassword(passwordVal, secondPassword)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ChangePassword;
