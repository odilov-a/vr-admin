import { useRef, useState, useEffect } from "react";
import { Delete, Dots, EditProblem } from "assets/images/icons";
import { useHooks } from "hooks";

const DotButton = ({ row, editFunction, deleteFunction }: any) => {
  const { t, get } = useHooks();
  const dropdownRef = useRef(null);
  const [opentActionMenu, setOpenActionMenu] = useState<Number | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as any).contains(event.target)
      ) {
        setOpenActionMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggleMenu = () => {
    setOpenActionMenu(
      opentActionMenu === get(row, "_id") ? null : get(row, "_id", null)
    );
  };

  const handleEdit = () => {
    editFunction();
    setOpenActionMenu(null);
  };

  const handleDelete = () => {
    deleteFunction();
    setOpenActionMenu(null);
  };

  return (
    <div>
      <div className="action-menu-wrapper" ref={dropdownRef}>
        <div
          className={`dot-btn ${
            opentActionMenu === get(row, "_id") ? "dot-btn--actived" : ""
          }`}
          onClick={handleToggleMenu}
        >
          <Dots />
        </div>
        <div
          className={`action-menu ${
            opentActionMenu === get(row, "_id") ? "action-menu--opened" : ""
          }`}
        >
          <div className="action-menu__item" onClick={handleEdit}>
            <EditProblem />
            <p>{t("Tahrirlash")}</p>
          </div>
          <div className="action-menu__item" onClick={handleDelete}>
            <Delete />
            <p>{t("O'chirish")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DotButton;
