import { useState } from "react";
import { Input, Modal } from "antd";
import { Button } from "components";
import { useHooks } from "hooks";
import useStore from "store";
import { utils } from "services";
import ChangePassword from "./changePassword";

const Profile = () => {
  const { t, get, navigate } = useHooks();
  const {
    auth: { data },
  } = useStore();
  const userData = get(data, "data");

  const [passwordModal, openPasswordModal] = useState(false);
  return (
    <div>
      <Modal
        open={passwordModal}
        onOk={() => openPasswordModal(true)}
        onCancel={() => openPasswordModal(false)}
        footer={null}
        centered
        title={t("Parolni o‘zgartirish")}
        width={600}
        destroyOnClose
      >
        <ChangePassword {...{ openPasswordModal }} />
      </Modal>
      <div className="profile-main">
        <div className="profile-info-panel">
          <div className="profile-info-panel__avatar">
            <img
              className="object-cover"
              src={get(userData, "photo_url.url")}
              alt="Avatar"
            />
          </div>
          <div className="profile-info-panel__data">
            <p className="profile-info-panel__name">
              {get(userData, "firstname", "user") +
                " " +
                get(userData, "lastname", "admin")}
            </p>
            <p className="profile-info-panel__role">{get(userData, "role")}</p>
            <div className="profile-info-panel__more">
              <div className="profile-info-panel__more-card">
                <div className="registration-date__top">
                  <p className="top-text">
                    {utils.formatTimestamp(get(userData, "createdAt", ""))}
                  </p>
                  <p className="top-time">
                    {utils.timestampToTime(get(userData, "createdAt", ""))}
                  </p>
                </div>
                <p className="bottom-text">
                  {t("Ro‘yxatdan o‘tilgan sana va vaqti")}
                </p>
              </div>
              <div className="profile-info-panel__more-card">
                <a className="top-text" href="">
                  {get(userData, "phone_number", "")}
                </a>
                <p className="bottom-text">{t("Telefon")}</p>
              </div>
              <div className="profile-info-panel__more-card">
                <a className="top-text" href="">
                  {get(userData, "email", "")}
                </a>
                <p className="bottom-text">{t("Elektron pochta")}</p>
              </div>
            </div>
          </div>
        </div>
        <Button
          type="default"
          edit={true}
          title="O'zgartirish"
          onClick={() => navigate("/profile/edit")}
        />
      </div>
      <div className="profile-main mt-[24px]">
        <div className="password-panel">
          <p className="panel-label">{t("Login")}</p>
          <p className="panel-login">{get(userData, "login", "login")}</p>
          <p className="panel-label">{t("Parol")}</p>
          <Input.Password
            placeholder={t("Parol")}
            value={"password"}
            className="panel-password"
            disabled
          />
        </div>
        <Button
          onClick={() => openPasswordModal(true)}
          type="default"
          edit={true}
          title="Parolni o'zgartirish"
        />
      </div>
    </div>
  );
};

export default Profile;
