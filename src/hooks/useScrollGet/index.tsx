import {
  UseInfiniteQueryResult,
  UseQueryOptions,
  useInfiniteQuery,
} from "@tanstack/react-query";
import qs from "qs";
import { api, queryBuilder } from "services";
import { TParams } from "services/types";

interface IUseInfiniteScroll {
  name: string;
  url: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  queryOptions?: UseQueryOptions<any, any, any, any>;
  params?: TParams | undefined;
  dataKey?: string;
  search?: string;
}

const fetchProjects = async ({ pageParam = 1, queryKey }: any) => {
  const { url, params, search } = queryKey[1].args;

  const res = await api.get(queryBuilder(url, { page: pageParam, ...params, extra: { search: search } }));

  const newData = {
    ...res?.data,
    next: res?.data?._links?.next,
    previous: res?.data?._links?.first,
  };

  return newData;
};

function useGetInfiniteScroll(
  args: IUseInfiniteScroll
): UseInfiniteQueryResult {
  const { name, onSuccess, onError, queryOptions } = args;

  const data = useInfiniteQuery({
    queryKey: [`${name}`, { args }],
    queryFn: fetchProjects,
    getNextPageParam: (lastPage, pages) => {
      const params = qs.parse(lastPage.next);
      return params.page;
    },
    onSuccess,
    onError,
    ...queryOptions,
  });

  return { ...data };
}

export default useGetInfiniteScroll;
