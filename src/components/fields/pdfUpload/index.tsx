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

interface Props extends FieldProps<any, any> {
  label?: string;
  className?: string;
  errorMessage?: string | any;
  rootClassName?: string;
  limit?: number;
  listType?: UploadProps["listType"];
  multiple?: boolean;

  /**
   * Optional uploader for URL-mode.
   * If provided, the file is uploaded immediately and the returned URL
   * is stored in Formik (string | string[]). If omitted, the component
   * stores File objects (for multipart/form-data submits).
   */
  onUpload?: (file: RcFile) => Promise<string>;
}

const toUploadFile = (
  url: string,
  uidBase: string,
  idx: number
): UploadFile<any> => {
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
    status: "done" as UploadFile<any>["status"],
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

  // Normalize initial value
  const initialList: UploadFile<any>[] = useMemo(() => {
    const raw = get(values, name);
    const uidBase = get(values, "_id", "temp");
    if (!raw) return [];
    if (Array.isArray(raw)) {
      return raw
        .filter((u: unknown): u is string => typeof u === "string")
        .map((u, i) => toUploadFile(u, uidBase, i));
    }
    if (typeof raw === "string") {
      return [toUploadFile(raw, uidBase, 0)];
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

  const syncFormik = (newList: UploadFile<any>[]) => {
    if (onUpload) {
      // URL mode
      if (multiple) {
        const urls = newList.map((f) => f.url).filter(Boolean) as string[];
        setFieldValue(name, urls);
      } else {
        setFieldValue(name, (newList[0]?.url as string) || undefined);
      }
    } else {
      // FormData mode
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
    if (onUpload) {
      // URL mode
      try {
        const url = await onUpload(file as RcFile);
        const added: UploadFile<any> = {
          uid: file.uid,
          name: file.name,
          status: "done" as UploadFile<any>["status"],
          url,
          thumbUrl: /\.pdf$/i.test(file.name)
            ? "/assets/images/pdf.png"
            : undefined,
        };
        const next: UploadFile<any>[] = [...fileList, added];
        setFileList(next);
        syncFormik(next);
      } catch (e) {
        // message.error('Upload failed');
      }
    } else {
      // FormData mode
      const added: UploadFile<any> = {
        uid: file.uid,
        name: file.name,
        status: "done" as UploadFile<any>["status"],
        originFileObj: file as RcFile,
      };
      const next: UploadFile<any>[] = [...fileList, added];
      setFileList(next);
      syncFormik(next);
    }
    return false;
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined style={{ color: "#002855" }} />
      <div className="mt-[8px]" style={{ color: isDark ? "#002855" : "#002855" }}>
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
        <img
          alt="preview"
          style={{ width: "100%" }}
          src={previewImage || "/assets/images/pdf.png"}
        />
      </Modal>
    </>
  );
};

export default PdfUploadField;
