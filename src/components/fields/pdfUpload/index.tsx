import React, { useMemo, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Modal, Upload } from "antd";
import type { UploadFile, UploadProps } from "antd";
import type { RcFile } from "antd/es/upload";
import { FieldProps } from "formik";
import { useHooks } from "hooks";
import { storage } from "services";

type FileType = Parameters<NonNullable<UploadProps["beforeUpload"]>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

type UploadedItem = { id: string; url: string };

interface Props extends FieldProps<any, any> {
  label?: string;
  className?: string;
  errorMessage?: string | any;
  rootClassName?: string;
  limit?: number;
  listType?: UploadProps["listType"];
  multiple?: boolean;

  /** Upload funksiyasi: faylni yuboradi va {id,url} qaytaradi */
  onUpload?: (file: RcFile) => Promise<UploadedItem>;
}

/** URL (yoki {id,url}) ni UploadFile ko‘rinishiga o‘tkazish */
const toUploadFile = (
  input: string | UploadedItem,
  uidBase: string,
  idx: number
): UploadFile<any> => {
  const url = typeof input === "string" ? input : input.url;
  const nameFromUrl = (() => {
    try {
      const u = new URL(url);
      return decodeURIComponent(u.pathname.split("/").pop() || `file-${idx + 1}`);
    } catch {
      const parts = url.split("/");
      return decodeURIComponent(parts[parts.length - 1] || `file-${idx + 1}`);
    }
  })();
  const isPdf = /\.pdf(\?|$)/i.test(url);
  return {
    uid: `${uidBase}-${idx}`,
    name: nameFromUrl,
    status: "done",
    url,
    thumbUrl: isPdf ? "/assets/images/pdf.png" : undefined,
  };
};

const PdfUploadField = (props: Props) => {
  const { get, t } = useHooks();
  const [isDark] = useState(storage.get("theme") !== "light");
  const uploadRef = useRef<any>(null);

  const {
    form: { setFieldValue, values },
    field: { name },
    multiple = false,
    limit = 1,
    listType = "picture-card",
    onUpload,
  } = props;

  /** Dastlabki ro‘yxatni normalize qilish (string yoki {id,url}) */
  const initialList: UploadFile<any>[] = useMemo(() => {
    const raw = get(values, name);
    const uidBase = get(values, "_id", "temp");
    if (!raw) return [];
    if (Array.isArray(raw)) {
      return raw
        .filter((u: any) => typeof u === "string" || (u && u.url))
        .map((u: any, i: number) => toUploadFile(u, uidBase, i));
    }
    if (typeof raw === "string" || (raw && raw.url)) {
      return [toUploadFile(raw as any, uidBase, 0)];
    }
    return [];
  }, [get(values, name), get(values, "_id")]);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile<any>[]>(initialList);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile<any>) => {
    if (!file.url && !file.preview && file.originFileObj) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    const src = (file.url as string) || (file.preview as string) || "";
    setPreviewImage(src);
    setPreviewOpen(true);
    setPreviewTitle(file.name || (src ? src.split("/").pop() || "" : ""));
  };

  /** Formik qiymatini backendga mos ( {id,url} ) qilib yozish */
  const syncFormik = async (newList: UploadFile<any>[]) => {
    // URL-rejim: onUpload mavjud bo‘lsa, bu maydon {id,url} obyektlarini saqlaydi
    if (onUpload) {
      if (multiple) {
        const items: UploadedItem[] = newList
          .map((f) => (f.response as UploadedItem) || (f as any).__uploaded || null)
          .filter(Boolean) as UploadedItem[];
        setFieldValue(name, items);
      } else {
        const f = newList[0];
        const item =
          (f && ((f.response as UploadedItem) || (f as any).__uploaded)) || undefined;
        setFieldValue(name, item);
      }
    } else {
      // FormData rejimi (agar keyin submitda o‘zingiz map qilsangiz)
      if (multiple) {
        const payload = newList.map((f) =>
          f.originFileObj ? f.originFileObj : (f.url as string)
        );
        setFieldValue(name, payload);
      } else {
        const f = newList[0];
        const payload = f
          ? f.originFileObj
            ? f.originFileObj
            : (f.url as string)
          : undefined;
        setFieldValue(name, payload);
      }
    }
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    syncFormik(newFileList);
  };

  const beforeUpload: UploadProps["beforeUpload"] = async (file) => {
    // URL-rejim: shu yerning o‘zida yuklab, {id,url} ni saqlaymiz
    if (onUpload) {
      try {
        const meta = await onUpload(file as RcFile); // <- {id,url}
        const added: UploadFile<any> = {
          uid: file.uid,
          name: file.name,
          status: "done",
          url: meta.url,
          thumbUrl: /\.pdf$/i.test(file.name) ? "/assets/images/pdf.png" : undefined,
          response: meta,
        };
        // kichkina bayroq — keyin syncFormik’da o‘qib olamiz
        (added as any).__uploaded = meta;

        const next = [...fileList, added];
        setFileList(next);
        await syncFormik(next);
      } catch {
        // message.error(t('Upload failed'));
      }
    } else {
      // FormData rejimi
      const added: UploadFile<any> = {
        uid: file.uid,
        name: file.name,
        status: "done",
        originFileObj: file as RcFile,
      };
      const next = [...fileList, added];
      setFileList(next);
      await syncFormik(next);
    }
    return false; // antd: o‘zi upload qilmasin
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined style={{ color: "#002855" }} />
      <div className="mt-[8px]" style={{ color: "#002855" }}>
        {t("Upload")}
      </div>
    </button>
  );

  return (
    <>
      <Upload
        listType={listType}
        ref={uploadRef}
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={beforeUpload}
        multiple={multiple}
        accept=".pdf"
      >
        {fileList.length >= (limit ?? 1) ? null : uploadButton}
      </Upload>

      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt="preview" style={{ width: "100%" }} src={previewImage || "/assets/images/pdf.png"} />
      </Modal>
    </>
  );
};

export default PdfUploadField;
