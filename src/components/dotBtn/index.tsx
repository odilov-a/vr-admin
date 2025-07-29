import { useRef, useState, useEffect } from "react";
import { Delete, Dots, Edit, View } from "assets/images/icons"
import { useHooks } from "hooks";

const DotButton = ({ row, editFunction, deleteFunction, viewFunction }: any) => {
  const { t, get } = useHooks()
  const dropdownRef = useRef(null);
  const [opentActionMenu, setOpenActionMenu] = useState<Number | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current &&
        !(dropdownRef.current as any).contains(event.target)) {
        setOpenActionMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggleMenu = () => {
    setOpenActionMenu(opentActionMenu === get(row, "_id") ? null : get(row, "_id", null));
  };

  const handleEdit = () => {
    editFunction();
    setOpenActionMenu(null);
  };

  const handleDelete = () => {
    deleteFunction();
    setOpenActionMenu(null);
  };

  const handleView = () => {
    viewFunction && viewFunction();
    setOpenActionMenu(null);
  };

  return (
    <div>
      <div className="action-menu-wrapper" ref={dropdownRef}>
        <div
          className={`dot-btn ${opentActionMenu === get(row, "_id") ? "dot-btn--actived" : ""}`}
          onClick={handleToggleMenu}
        >
          <Dots />
        </div>
        <div className={`action-menu ${opentActionMenu === get(row, "_id") ? "action-menu--opened" : ""}`}>
          {viewFunction && <div className="action-menu__item" onClick={handleView}>
            <View />
            <p>{t("Ko'rish")}</p>
          </div>}
          <div className="action-menu__item" onClick={handleEdit}>
            <Edit />
            <p>{t("Tahrirlash")}</p>
          </div>
          <div className="action-menu__item" onClick={handleDelete}>
            <Delete />
            <p>{t("O'chirish")}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DotButton