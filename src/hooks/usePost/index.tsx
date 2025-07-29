import { useMutation } from "@tanstack/react-query";
import { AxiosRequestConfig } from 'axios'
import { api, queryBuilder } from "services";
import { IMethod, TParams } from "services/types";

interface IPostOptions {
  method: IMethod;
  url: string;
  data: any;
  params?: TParams | undefined;
  configs?: AxiosRequestConfig<any> | undefined
}

export async function postData(options: IPostOptions) {
  const { method = "post", url, data, params, configs } = options;
  return await api[method](queryBuilder(url, params), data, configs);
}

const usePost = () => {
  return useMutation(postData);
};

export default usePost;
