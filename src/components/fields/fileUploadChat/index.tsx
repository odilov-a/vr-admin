import { useState } from "react";
import { GetProp, UploadFile, UploadProps, message, Upload } from "antd";
import { FieldProps } from "formik";
import axios from "axios";

import { usePost, useHooks } from "hooks";
import { storage } from "services";
import { PaperClip } from "assets/images/icons";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

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
  limit: number;
  listType: any;
  successed: boolean;
  isChat: boolean;
  setSuccess: any;
  customDelete: boolean;
  onSuccess: () => void;
  hasSuccess: boolean;
}

const App = (props: Props) => {
  const { get } = useHooks();

  const {
    form: { setFieldValue },
    field: { name, value },
    limit = 1,
  } = props;
  const [fileList, setFileList] = useState<UploadFile[]>();

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const customRequest = async ({ file, onSuccess, onError }: any) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${process.env.REACT_APP_ROOT_API_FILE_UPLOAD}/files/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${storage.get("token")}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setFieldValue(name, { type: "file", file: get(response.data.data, "url"), text: null });
        onSuccess();
      } else {
        message.error("File upload failed");
        onError(response.statusText);
      }
    } catch (error) {
      console.error("File upload error:", error);
      message.error("File upload failed");
      onError(error || "File upload failed");
    }
  };

  return (
    <div className="chat-file-upload">
      <Upload
        fileList={fileList}
        onChange={handleChange}
        customRequest={customRequest}
      >
        {<div className="chat-btn">
          <PaperClip />
        </div>}
      </Upload>
    </div>
  );
};

export default App;